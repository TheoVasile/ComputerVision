import numpy as np
from numpy.typing import NDArray
from typing import List, Dict

def ReLu(x: NDArray[np.float_]) -> NDArray[np.float_]:
    """
    Applies the Rectified Linear Unit (ReLU) function element-wise to a numpy array.

    Args:
        x (NDArray[np.float_]): Input array.

    Returns:
        NDArray[np.float_]: Array with ReLU applied element-wise.
    """
    return np.maximum(0, x)

def propogate(X: NDArray[np.float_], weights: NDArray[np.float_], biases: NDArray[np.float_]) -> NDArray[np.float_]:
    """
    Performs one step of forward propagation using matrix multiplication.

    Args:
        X (numpy.ndarray): An n x m array representing the input layer, where n is the batch size.
        weights (numpy.ndarray): An m x h array representing the weights connecting to the next layer.
        biases (numpy.ndarray): An array of shape (h,) representing the biases for the next layer.

    Returns:
        numpy.ndarray: An n x h matrix representing the values in the next layer after applying weights and biases.
    """
    return np.matmul(X, weights) + biases


def activate(X: NDArray[np.float_]) -> NDArray[np.float_]:
    """
    Applies the ReLU activation function element-wise to a matrix.

    Args:
        X (numpy.ndarray): An n x m array representing the input matrix.

    Returns:
        numpy.ndarray: The result of applying ReLU activation to each element of X.
    """
    return ReLu(X)


def process_ff(X: NDArray[np.float_], parameters: List[Dict[str, NDArray[np.float_]]]) -> NDArray[np.float_]:
    """
    Processes the feedforward operation for a neural network with any number of layers.

    Args:
        X (NDArray[np.float_]): The input array to the neural network.
        parameters (List[Dict[str, NDArray[np.float_]]]): List of dictionaries containing weights and biases for each layer.

    Returns:
        NDArray[np.float_]: The output of the neural network after processing all layers.
    """
    for param in parameters:
        W, b = param["weights"], param["biases"]
        X = propogate(X, W, b)
        X = activate(X)
    return X