import numpy as np
from numpy.typing import NDArray

def process_pca(X: NDArray[np.float_], dimensions: int) -> NDArray[np.float_]:
    """
    Reduces the input to the most important dimensions using Principle Component Analysis

    Args:
        X (numpy array): 
    """
    X -= np.mean(X, axis=0)
    U, S, Vt = np.linalg.svd(X)
    return X.dot(Vt.T[:, :dimensions])