import boto3
import numpy as np
from numpy.typing import NDArray
import io
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME

# Initialize S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def retrieve_all_npy_from_s3() -> list[NDArray[np.float_]]:
    """
    Retrieve all .npy files from a specific directory in S3.

    Args:
        directory (str): The directory path in the S3 bucket (e.g., "datasets/").

    Returns:
        list of numpy.ndarray: A list of NumPy arrays loaded from the .npy files.
    """
    arrays = []
    try:
        # List all objects in the directory
        response = s3.list_objects_v2(Bucket=AWS_BUCKET_NAME)
        for obj in response.get("Contents", []):
            if obj["Key"].endswith(".npy"):  # Only process .npy files
                print(f"Retrieving {obj['Key']}...")
                array = retrieve_npy_from_s3(obj["Key"])
                arrays.append(array)
        return arrays
    except Exception as e:
        print(f"Error retrieving files from {directory}: {e}")
        raise