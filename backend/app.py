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
    #data = request.json
    print("hello")
    X = process_image(request.files["input"], normalize=True, preserveColor=False)
    algorithms = request.form.get("algorithms")
    if algorithms:
        algorithms = json.loads(algorithms)
        for algorithm in algorithms:
            if algorithm["type"] == "CNN":
                X = process_cnn(X, np.array(algorithm["kernel"]).astype(float))
            elif algorithm["type"] == "PCA":
                X = process_pca(X, algorithm["output_features"])
            elif algorithm["type"] == "FF":
                X = process_ff(X, algorithm["parameters"])
    
    # Convert result to base64 image if it's from CNN
    image_data = None
    if algorithms and algorithms[-1]["type"] == "CNN":
        image_data = array_to_base64(X)
    
    print(jsonify({
        'result': X.tolist(),
        'image': image_data
    }))
    return jsonify({
        'result': X.tolist(),
        'image': image_data
    })

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

if __name__ == '__main__':
    app.run(debug=True)