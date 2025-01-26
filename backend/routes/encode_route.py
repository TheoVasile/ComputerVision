from flask import Blueprint, request, jsonify
import json
import numpy as np
from models.image_model import process_image
from models.cnn_model import process_cnn
from models.pca_model import process_pca
from models.ff_model import process_ff
from services.helpers import array_to_base64


encode_bp = Blueprint("encode", __name__)

@encode_bp.route('/encode', methods=['POST'])
def encode():
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