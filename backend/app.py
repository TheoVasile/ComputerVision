from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from cnn_model import process_cnn
from pca_model import process_pca
from ff_model import process_ff
from image_model import process_image
import json
import base64
import io
from PIL import Image
from dotenv import load_dotenv
import os
import boto3
from flask import send_file
from io import BytesIO
import time
from typing import List, Dict
from numpy.typing import NDArray
# Load the .env file
load_dotenv()

# Access the environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")

# connect to s3
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

app = Flask(__name__)
CORS(app)

def array_to_base64(arr):
    # Normalize the array to 0-255 range
    arr_normalized = ((arr - arr.min()) * (255.0 / (arr.max() - arr.min()))).astype(np.uint8)
    
    # Convert to PIL Image
    img = Image.fromarray(arr_normalized)
    
    # Save to bytes buffer
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    
    # Convert to base64
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return img_str

@app.route('/encode', methods=['POST'])
def process():
    try:
        print("Processing encode request")
        algorithms = request.form.get("algorithms")
        if not algorithms:
            return jsonify({
                'status': 'error',
                'message': 'No algorithms provided'
            }), 400
            
        algorithms = json.loads(algorithms)
        print("Algorithms:", algorithms)
        
        # Process the input image
        if not request.files or "input" not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No input file provided'
            }), 400
            
        X = process_image(request.files["input"], normalize=True, preserveColor=False)
        print("Input shape after process_image:", X.shape)
        
        # For first FF algorithm, flatten the image to grayscale values
        if algorithms and algorithms[0]["type"] == "FF":
            print("First algorithm is FF, flattening image")
            X = X.flatten()
            print("Flattened shape:", X.shape)
        
        # Process through algorithms
        for algorithm in algorithms:
            print(f"Processing algorithm: {algorithm['type']}")
            if algorithm["type"] == "CNN":
                X = process_cnn(X, np.array(algorithm["kernel"]).astype(float))
            elif algorithm["type"] == "PCA":
                X = process_pca(X, algorithm["output_features"])
            elif algorithm["type"] == "FF":
                print("FF algorithm data:", algorithm)
                print("FF parameters type:", type(algorithm["parameters"]))
                #print("FF parameters:", algorithm["parameters"])
                
                # Convert parameters to numpy arrays
                params = []
                for i, layer in enumerate(algorithm["parameters"]):
                    print(f"Processing layer {i}:")
                    #print("  Layer data:", layer)
                    #print("  Layer type:", type(layer))
                    print("  Keys:", layer.keys())
                    params.append({
                        "weights": np.array(layer["weights"]).astype(float),
                        "biases": np.array(layer["biases"]).astype(float)
                    })
                #print("Processed params:", params)
                print("First layer weights shape:", np.array(params[0]["weights"]).shape)
                print("First layer biases shape:", np.array(params[0]["biases"]).shape)
                X = process_ff(X, params)
            print(f"Output shape after {algorithm['type']}:", X.shape)
    
        # Convert result to base64 image if it's from CNN
        image_data = None
        if algorithms and algorithms[-1]["type"] == "CNN":
            image_data = array_to_base64(X)
        
        return jsonify({
            'status': 'success',
            'result': X.tolist() if not isinstance(X, list) else X,
            'image': image_data
        })
        
    except Exception as e:
        print("Error in encode:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

def save_array_to_s3(array: NDArray[np.float_], bucket_name: str, object_name: str) -> None:
    # Serialize the array into a .npy file (binary format)
    np_bytes = io.BytesIO()
    np.save(np_bytes, array, allow_pickle=False)  # Convert array to binary
    np_bytes.seek(0)  # Reset the buffer pointer to the start

    # Upload to S3
    s3.put_object(Bucket=bucket_name, Key=object_name, Body=np_bytes.getvalue())

@app.route('/dataset/upload', methods=['POST'])
def upload_dataset():
    try:
        # Get the uploaded file from the request
        images = request.files.getlist('images')

        for img_file in images:
            array = process_image(img_file)
            save_array_to_s3(array, os.getenv("AWS_BUCKET_NAME"), img_file.filename)

        return jsonify({
            'status': 'success',
            'message': 'File uploaded successfully'
        })
    except Exception as e:
        print("Error in upload_dataset:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/dataset/clear', methods=['POST'])
def clear_dataset():
    try:
        # List all objects in the bucket
        bucket_name = os.getenv("AWS_BUCKET_NAME")
        while True:
            response = s3.list_objects_v2(Bucket=bucket_name)

            # If the bucket is empty, break the loop
            if "Contents" not in response:
                print(f"The bucket '{bucket_name}' is already empty.")
                break

            # Extract the keys of the objects to delete
            objects_to_delete = [{"Key": obj["Key"]} for obj in response["Contents"]]

            # Delete the objects in bulk
            delete_response = s3.delete_objects(
                Bucket=bucket_name,
                Delete={"Objects": objects_to_delete}
            )

            print(f"Deleted: {delete_response.get('Deleted', [])}")

            # If there are no more pages, break the loop
            if not response.get("IsTruncated"):
                break

        print(f"All objects in bucket '{bucket_name}' have been deleted.")

    except Exception as e:
        print(f"Error clearing bucket: {e}")

@app.route('/format_images', methods=['POST'])
def format_images():
    try:
        # Get dimensions from form data
        width = int(request.form.get('width'))
        height = int(request.form.get('height'))
        
        # Get all images from the request
        images = request.files.getlist('images')
        formatted_images = []
        
        for img_file in images:
            # Open image with PIL
            img = Image.open(img_file)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate dimensions to maintain aspect ratio when cropping
            img_width, img_height = img.size
            aspect_ratio = width / height
            
            if img_width / img_height > aspect_ratio:
                # Image is wider than target aspect ratio
                new_width = int(img_height * aspect_ratio)
                offset = (img_width - new_width) // 2
                img = img.crop((offset, 0, offset + new_width, img_height))
            else:
                # Image is taller than target aspect ratio
                new_height = int(img_width / aspect_ratio)
                offset = (img_height - new_height) // 2
                img = img.crop((0, offset, img_width, offset + new_height))
            
            # Resize to target dimensions
            img = img.resize((width, height), Image.Resampling.LANCZOS)
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=95)
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            formatted_images.append(img_base64)
        
        return jsonify({
            'status': 'success',
            'images': formatted_images
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/decode', methods=['POST'])
def decode():
    try:
        # Get input data and algorithms
        data = request.json
        print("Received data:", data)  # Debug print
        
        if not data or 'input' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing input data'
            }), 400
            
        if 'visualize' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing visualize parameters'
            }), 400
            
        # Ensure input_data is a numpy array and flatten if needed
        input_data = np.array(data['input'])
        if len(input_data.shape) > 1:
            input_data = input_data.flatten()
        input_size = len(input_data)
        print("Input shape:", input_data.shape)  # Debug print
        
        algorithms = data.get('algorithms', [])  # Default to empty list if no algorithms
        print("Algorithms:", algorithms)  # Debug print
        
        visualize_params = data['visualize']
        width = visualize_params.get('width')
        height = visualize_params.get('height')
        output_size = width * height
        
        if not width or not height:
            return jsonify({
                'status': 'error',
                'message': 'Invalid visualize parameters'
            }), 400
            
        print(f"Target dimensions: {width}x{height}")  # Debug print
        
        # Process through feedforward layers if any exist
        X = input_data
        for i, algorithm in enumerate(algorithms):
            if algorithm["type"] == "FF":
                print(f"Processing FF layer {i}")  # Debug print
                print(f"Input shape for FF {i}:", X.shape)  # Debug print
                X = process_ff(X, algorithm["parameters"])
                print(f"Output shape after FF {i}:", X.shape)  # Debug print
        
        # If no feedforward layers were added or processed, create a direct mapping
        # from input to output using a single feedforward layer
        if not algorithms or not any(algo["type"] == "FF" for algo in algorithms):
            print("No feedforward layers found, creating direct mapping")
            # Initialize weights and biases for direct mapping
            weights = np.random.randn(input_size, output_size) * np.sqrt(2.0 / input_size)  # He initialization
            biases = np.zeros(output_size)
            
            # Format parameters for process_ff
            final_ff_params = [{
                "weights": weights,
                "biases": biases
            }]
            print("Direct mapping params shape:", weights.shape, biases.shape)  # Debug print
            X = process_ff(X, final_ff_params)
        else:
            # Get the current size after all FF layers
            current_size = len(X)
            
            # Add final layer to match visualize dimensions
            weights = np.random.randn(current_size, output_size) * np.sqrt(2.0 / current_size)  # He initialization
            biases = np.zeros(output_size)
            
            # Format parameters for process_ff
            final_ff_params = [{
                "weights": weights,
                "biases": biases
            }]
            print("Final FF params shape:", weights.shape, biases.shape)  # Debug print
            X = process_ff(X, final_ff_params)
            
        print("Final output shape before reshape:", X.shape)  # Debug print
        
        # Reshape and normalize to create image
        X = X.reshape(height, width)
        print("Reshaped output shape:", X.shape)  # Debug print
        
        # Scale to 0-255 range
        X = (X * 255).astype(np.uint8)
        
        # Convert to base64 image
        image_data = array_to_base64(X)
        
        return jsonify({
            'status': 'success',
            'image': image_data
        })
        
    except Exception as e:
        print("Error in decode:", str(e))  # Debug print
        import traceback
        traceback.print_exc()  # Print full traceback
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)