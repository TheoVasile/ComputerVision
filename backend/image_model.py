import numpy as np
from numpy.typing import NDArray
from PIL import Image

def process_image(file) -> NDArray[np.float_]:
    """
    convert image url to numpy matrix representing pixel values

    Args:
        url (string): the url representing the input image

    Returns:
        numpy float array: wxhxc matrix where w represents width, h represents height, and c represents color channels
    """
    # Open the image from the bytes in the response content
    print(file)
    image = Image.open(file.stream)
    feature_matrix = np.asarray(image)
    print(feature_matrix)
    return feature_matrix