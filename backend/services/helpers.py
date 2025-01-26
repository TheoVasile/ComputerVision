import numpy as np
import io
from PIL import Image
import base64

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