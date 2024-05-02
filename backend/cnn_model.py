import numpy as np
from numpy.typing import NDArray
from typing import Tuple

def process_cnn(kernel):
    pass

def _process_kernel(X: NDArray[np.float_], kernel: NDArray[np.float_], coordinate: Tuple[int]) -> np.float_:
    """
    Perform the dot product of the kernel and the section of the matrix it covers

    Args:
        X (numpy.ndarray): An m x n array representing the input matrix
        kernel (numpy.ndarray): An j x i array representing a convolutional kernel. 0 < j < m, 0 < i < n
        coordinates (tuple[int]): The indices in X where the kernel is positioned
    
    Returns:
        float: The dot product where the kernel intersects the matrix
    """
    return np.dot(X[coordinate[0]:coordinate[0]+len(kernel[0])][coordinate[1]:coordinate[1]+len(kernel[1])], kernel)

def convolve(X: NDArray[np.float_], kernel: NDArray[np.float_]) -> NDArray[np.float_]:
    """
    Perform a convolution on X using kernel with dot product

    Args:
        X (numpy.ndarray): An m x n array representing the input matrix
        kernel (numpy.ndarray): An j x i array representing a convolutional kernel. 0 < j < m, 0 < i < n

    Returns:
        numpy.ndarray: the resulting matrix from convolution
    """
    Z = np.zeros(X.size)
    for i in range(X.size[0]-kernel.size[0]):
        for j in range(X.size[1]-kernel.size[1]):
            Z[i][j] = _process_kernel(X, kernel, (i, j))
    return Z