from flask import Blueprint, request, jsonify
import numpy as np
from models.ff_model import process_ff
from services.helpers import array_to_base64

decode_bp = Blueprint("decode", __name__)

@decode_bp.route('/decode', methods=['POST'])
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