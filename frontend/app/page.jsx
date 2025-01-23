"use client"

import { useState } from 'react'
import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import PCA from './ui/PCA'
import Feedforward from './ui/Feedforward'
import ImageCard from './ui/Imagecard'
import InsertNetwork from './ui/InsertNetwork'
import AlgorithmGroupContext from './contexts/AlgorithmGroupContext'

const BACKEND_URL = 'http://127.0.0.1:5000';

const Page = () => {
  // Image states
  const [inputImageSrc, setInputImageSrc] = useState("")
  const [inputImageFile, setInputImageFile] = useState(null)
  const [bottleneck, setBottleneck] = useState([])
  const [bottleneckImage, setBottleneckImage] = useState(null)
  const [outputImage, setOutputImage] = useState([])
  
  // Algorithm states
  const [algorithmGroups, setAlgorithmGroups] = useState({
    encoder: [], 
    decoder: []
  })
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleEncodeData = async () => {
    if (!inputImageFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('input', inputImageFile);
      formData.append('algorithms', JSON.stringify(algorithmGroups.encoder));

      const response = await fetch(`${BACKEND_URL}/encode`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setBottleneck(data.result || []);
      
      // Check if there are any non-CNN algorithms in the encoder chain
      const hasNonCNNAlgorithm = algorithmGroups.encoder.some(algo => algo.type !== "CNN");
      if (hasNonCNNAlgorithm) {
        setBottleneckImage(null); // Don't show image for non-CNN results
      } else {
        setBottleneckImage(data.image ? `data:image/png;base64,${data.image}` : null);
      }
    } catch (err) {
      setError(err.message || 'Failed to process image');
      setBottleneck([]);
      setBottleneckImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlgorithmGroup = (groupKey, index, newAlgorithmData) => {
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: prev[groupKey].map((item, idx) => 
        idx === index ? { ...item, ...newAlgorithmData } : item
      )
    }));
  };

  const addAlgorithm = (groupKey, algorithmType) => {
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: [...prev[groupKey], { type: algorithmType }]
    }));
  };

  const renderAlgorithmComponents = (groupKey) => {
    return algorithmGroups[groupKey].map((algorithm, index) => {
      const props = {
        key: `${algorithm.type}-${index}`,
        groupKey,
        index
      };

      switch (algorithm.type) {
        case "CNN":
          return <Convolver {...props} />;
        case "PCA":
          return <PCA {...props} />;
        case "FF":
          return <Feedforward {...props} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className='p-4'>
      <Sidebar />
      <AlgorithmGroupContext.Provider value={{ updateAlgorithmGroup }}>
        <div className="container">
          {/* Input Section */}
          <div className="input-section">
            <Dropzone
              src={inputImageSrc}
              setSrc={setInputImageSrc}
              file={inputImageFile}
              setFile={setInputImageFile}
              text='Drop image'
              height='150px'
              width='150px'
            />
            {inputImageSrc && <div className="mt-2 text-sm text-gray-600">{inputImageSrc}</div>}
            <button 
              className={`button mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleEncodeData}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Encode'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message text-red-500 mt-4">
              {error}
            </div>
          )}

          {/* Encoder Section */}
          <div className="encoder-section mt-6">
            {renderAlgorithmComponents("encoder")}
            <InsertNetwork
              width='50px'
              height='50px'
              onAddComponent={(type) => addAlgorithm('encoder', type)}
            />
          </div>

          {/* Bottleneck Section */}
          <div className="bottleneck-section mt-6">
            <ImageCard 
              width='100px' 
              height='100px' 
              src={bottleneckImage}
              text={
                !bottleneckImage && bottleneck.length > 0 ? 
                `${bottleneck.length} features` : 
                undefined
              }
            />
            {bottleneckImage && 
              <div className="mt-2 text-sm">
                {bottleneck.length} features
              </div>
            }
            <button className="button mt-4">
              Decode
            </button>
          </div>

          {/* Decoder Section */}
          <div className="decoder-section mt-6">
            {renderAlgorithmComponents("decoder")}
            <InsertNetwork
              width='50px'
              height='50px'
              onAddComponent={(type) => addAlgorithm('decoder', type)}
            />
          </div>

          {/* Output Section */}
          <div className="output-section mt-6">
            <ImageCard 
              width='150px' 
              height='150px'
            />
          </div>
        </div>
      </AlgorithmGroupContext.Provider>
    </div>
  );
};

export default Page;