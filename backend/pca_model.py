import numpy as np

def process_pca(data, output_size):
    """
    
    """
    data -= np.mean(data, axis=0)
    U, S, Vt = np.linalg.svd(data)
    return data.dot(Vt.T[:, :output_size])