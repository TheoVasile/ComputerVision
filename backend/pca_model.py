import numpy as np
from numpy.typing import NDArray

def process_pca(X: NDArray[np.float_], dimensions: int) -> NDArray[np.float_]:
    """
    Reduces the input to the most important dimensions using Principle Component Analysis

    Args:
        X (numpy array): nxm matrix where n is the size of the dataset, and m is the number of features
    Returns:
        numpy array: nxh matrix, where n is the size of the dataset, and h are the reduced principal components
    """
    X -= np.mean(X, axis=0)
    U, S, Vt = np.linalg.svd(X)
    return X.dot(Vt.T[:, :dimensions])