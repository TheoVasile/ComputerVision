from flask import Flask, request, jsonify
import numpy as np
from cnn_model import process_cnn
from pca_model import process_pca
from ff_model import process_ff

app = Flask(__name__)

@app.route('/process-data', methods=['GET'])
def process():
    data = request.json
    input = np.array(data["input"])
    for algorithm in data["algorithms"]:
        if algorithm["type"] == "CNN":
            input = process_cnn(input, np.array(algorithm["kernel"]))
        elif algorithm["type"] == "PCA":
            input = process_pca(input, algorithm["output_size"])
        elif algorithm["type"] == "FF":
            print(algorithm)
            input = process_ff(input, algorithm["parameters"])
    return str(input)

@app.route('/process-image', methods=['GET'])
def process_image():
    data = request.json
    url = data["path"]
    print(url)


if __name__ == '__main__':
    app.run(debug=True)