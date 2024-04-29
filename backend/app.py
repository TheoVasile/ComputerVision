from flask import Flask, request, jsonify
from cnn_model import process_cnn
from pca_model import process_pca
from ff_model import process_ff

app = Flask(__name__)

@app.route('/process-cnn', methods=['POST'])
def process():
    data = request.json
    result = process_cnn(data['kernel'])
    return jsonify(result)

@app.route('/process-nn', methods=['POST'])
def process_ff_endpoint():
    data = request.json
    result = process_ff(data['weights', data['biases']])
    return jsonify(result)

@app.route('/process-pca', methods=['POST'])
def process_pca_endpoint():
    data = request.json
    result = process_pca(data['outputSize'])
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)