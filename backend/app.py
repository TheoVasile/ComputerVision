from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from cnn_model import process_cnn
from pca_model import process_pca
from ff_model import process_ff
from image_model import process_image
import json

app = Flask(__name__)
CORS(app)

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
    print(jsonify({'result': X.tolist()}))
    return jsonify({'result': X.tolist()})


if __name__ == '__main__':
    app.run(debug=True)