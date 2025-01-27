from numpy.typing import NDArray
import numpy as np

def process_fourier(X: NDArray[np.float_], component: str) -> NDArray[np.float_]:
    """
    Perform a fourier transform on X

    Args:
        X (numpy.ndarray): An m x n array representing the input matrix

    Returns:
        numpy.ndarray: the resulting matrix from the fourier transform
    """
    res = np.fft.fft2(X)
    if component == "amplitude":
        return np.log(1+np.abs(res))
    elif component == "phase":
        return np.angle(res)
    else:
        raise ValueError("Component must be 'amplitude' or 'phase'")