from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from models.cnn_model import process_cnn
from models.pca_model import process_pca
from models.ff_model import process_ff
from models.image_model import process_image
import json
import base64
import io
from PIL import Image
import os
import boto3
from flask import send_file
from io import BytesIO
import time
from typing import List, Dict
from numpy.typing import NDArray
from routes import register_routes
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

app = Flask(__name__)
CORS(app)

register_routes(app)

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