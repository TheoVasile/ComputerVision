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


if __name__ == '__main__':
    app.run(debug=True)