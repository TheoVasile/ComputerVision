from flask import Blueprint, request, jsonify
import numpy as np
from numpy.typing import NDArray
import io
import os
import boto3
from models.image_model import process_image
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

# connect to s3
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)


def save_array_to_s3(array: NDArray[np.float_], bucket_name: str, object_name: str) -> None:
    # Serialize the array into a .npy file (binary format)
    np_bytes = io.BytesIO()
    np.save(np_bytes, array, allow_pickle=False)  # Convert array to binary
    np_bytes.seek(0)  # Reset the buffer pointer to the start

    # Upload to S3
    s3.put_object(Bucket=bucket_name, Key=object_name, Body=np_bytes.getvalue())


upload_bp = Blueprint("upload", __name__)

@upload_bp.route('/dataset/upload', methods=['POST'])
def upload_dataset():
    try:
        # Get the uploaded file from the request
        images = request.files.getlist('images')

        for i, img_file in enumerate(images):
            array = process_image(img_file)
            save_array_to_s3(array, os.getenv("AWS_BUCKET_NAME"), f"image_{i}.npy")

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

clear_bp = Blueprint("clear", __name__)

@clear_bp.route('/dataset/clear', methods=['POST'])
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
        return jsonify({
            'status': 'success',
            'message': 'File uploaded successfully'
        })

    except Exception as e:
        print(f"Error clearing bucket: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400