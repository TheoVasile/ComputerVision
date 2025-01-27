from .dataset_routes import retrieve_all_npy_from_s3
from flask import Blueprint, jsonify, request
import json


backprop_bp = Blueprint("backprop", __name__)

@backprop_bp.route('/backprop', methods=['POST'])
def backprop():
    """
    Tune the parameters of the feedforward network to fit the data.
    """
    try:
        data = retrieve_all_npy_from_s3()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No items in Dataset found'
            }), 400

        algorithms = request.form.get("algorithms")
        if not algorithms:
            return jsonify({
                'status': 'error',
                'message': 'No algorithms provided'
            }), 400
            
        algorithms = json.loads(algorithms)
        print("Algorithms:", algorithms)

        ff_network = []
        for algorithm in algorithms[::-1]:
            print(f"Processing algorithm: {algorithm['type']}")
            if algorithm["type"] == "FF":
                ff_network.append(algorithm["parameters"])
            else:
                break
        
        return jsonify({
            'status': 'success',
            'message': 'Files retrieved successfully',
            'data': data
        })
    except Exception as e:
        print(f"Error training: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400