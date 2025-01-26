from numpy.typing import NDArray
import numpy as np

def process_fourier(X: NDArray[np.float_]) -> NDArray[np.float_]:
    """
    Perform a fourier transform on X

    Args:
        X (numpy.ndarray): An m x n array representing the input matrix

    Returns:
        numpy.ndarray: the resulting matrix from the fourier transform
    """
    return np.abs(np.fft.fft2(X))