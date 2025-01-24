"use client"

import { useState } from 'react'
import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import PCA from './ui/PCA'
import Feedforward from './ui/Feedforward'
import Visualize from './ui/Visualize'
import ImageCard from './ui/Imagecard'
import InsertNetwork from './ui/InsertNetwork'
import AlgorithmGroupContext from './contexts/AlgorithmGroupContext'

const BACKEND_URL = 'http://127.0.0.1:5000';

const Page = () => {
  // Image states
  const [inputImageSrc, setInputImageSrc] = useState("")
  const [inputImageFile, setInputImageFile] = useState(null)
  const [inputImageDimensions, setInputImageDimensions] = useState({ width: 0, height: 0 });
  const [bottleneck, setBottleneck] = useState([])
  const [bottleneckImage, setBottleneckImage] = useState(null)
  const [outputImage, setOutputImage] = useState([])

  const [images, setFiles] = useState([]);
  
  // Algorithm states
  const [algorithmGroups, setAlgorithmGroups] = useState({
    encoder: [], 
    decoder: [{ type: 'Visualize', parameters: { width: 224, height: 224 } }]
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

  const handleDecodeData = async () => {
    if (!bottleneck || bottleneck.length === 0) {
      setError('No data to decode');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the visualize parameters from the last algorithm
      const visualizeParams = algorithmGroups.decoder[algorithmGroups.decoder.length - 1].parameters;
      
      // Get all feedforward algorithms (excluding the visualize)
      const feedforwardAlgorithms = algorithmGroups.decoder.slice(0, -1);

      // Convert bottleneck to array if it's not already
      const inputData = Array.isArray(bottleneck) ? bottleneck : [bottleneck];

      const response = await fetch(`${BACKEND_URL}/decode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputData,
          algorithms: feedforwardAlgorithms,
          visualize: visualizeParams
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setOutputImage(data.image ? `data:image/png;base64,${data.image}` : null);
    } catch (err) {
      setError(err.message || 'Failed to decode data');
      setOutputImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrain = () => {
    if (images.length === 0) {
      setError('Please add images to train');
      return;
    }
    setIsLoading(true);
    setIsLoading(false);
  };

  const handleImageLoad = (file) => {
    const img = new Image();
    img.onload = () => {
      setInputImageDimensions({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleFileSet = (file) => {
    setInputImageFile(file);
    handleImageLoad(file);
  };

  const updateAlgorithmGroup = (groupKey, index, newAlgorithmData) => {
    console.log("Updating algorithm:", groupKey, index, newAlgorithmData);
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: prev[groupKey].map((item, idx) => 
        idx === index ? newAlgorithmData : item
      )
    }));
  };

  const addAlgorithm = (groupKey, algorithmType) => {
    setAlgorithmGroups(prev => {
      if (groupKey === 'decoder') {
        // For decoder, add new algorithms before the Visualize algorithm
        const newAlgorithms = [...prev.decoder];
        newAlgorithms.splice(-1, 0, { type: algorithmType });
        return {
          ...prev,
          decoder: newAlgorithms
        };
      }
      // For encoder, just append to the end
      return {
        ...prev,
        [groupKey]: [...prev[groupKey], { type: algorithmType }]
      };
    });
  };

  return (
    <div className='p-4'>
      <Sidebar images={images} setFiles={setFiles} />
      <AlgorithmGroupContext.Provider value={{ updateAlgorithmGroup }}>
        <div className="container">
          {/* Input Section */}
          <div className="input-section">
            <Dropzone
              src={inputImageSrc}
              setSrc={setInputImageSrc}
              file={inputImageFile}
              setFile={handleFileSet}
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
            {algorithmGroups.encoder.map((algorithm, index) => {
              const props = {
                key: `${algorithm.type}-${index}`,
                groupKey: "encoder",
                index,
                inputSize: index === 0 ? 
                  (inputImageDimensions.width * inputImageDimensions.height) : // First FF gets flattened image size
                  null
              };

              switch (algorithm.type) {
                case "CNN":
                  return <Convolver key={`${algorithm.type}-${index}`} groupKey={"encoder"} index={index} inputSize={index === 0 ? (inputImageDimensions.width * inputImageDimensions.height) : null} />;
                case "PCA":
                  return <PCA key={`${algorithm.type}-${index}`} groupKey={"encoder"} index={index} inputSize={index === 0 ? (inputImageDimensions.width * inputImageDimensions.height) : null} />;
                case "FF":
                  return <Feedforward key={`${algorithm.type}-${index}`} groupKey={"encoder"} index={index} inputSize={index === 0 ? (inputImageDimensions.width * inputImageDimensions.height) : null} />;
                default:
                  return null;
              }
            })}
            <InsertNetwork
              width='50px'
              height='50px'
              onAddComponent={(type) => addAlgorithm('encoder', type)}
              isDecoder={false}
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
            <button 
              className={`button mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleDecodeData}
              disabled={isLoading || !bottleneck || bottleneck.length === 0}
            >
              {isLoading ? 'Decoding...' : 'Decode'}
            </button>
          </div>

          {/* Decoder Section */}
          <div className="decoder-section mt-6">
            {algorithmGroups.decoder.slice(0, -1).map((algorithm, index) => {
              const props = {
                key: `${algorithm.type}-${index}`,
                groupKey: "decoder",
                index,
                inputSize: index === 0 ? bottleneck.length : null, // Pass bottleneck size if first FF
                outputSize: index === algorithmGroups.decoder.length - 2 ? // If this is the last FF before Visualize
                  algorithmGroups.decoder[algorithmGroups.decoder.length - 1].parameters.width * 
                  algorithmGroups.decoder[algorithmGroups.decoder.length - 1].parameters.height : 
                  null
              };

              switch (algorithm.type) {
                case "FF":
                  return <Feedforward key={`${algorithm.type}-${index}`}
                  groupKey="decoder"
                  index={index}
                  inputSize={index === 0 ? bottleneck.length : null} // Pass bottleneck size if first FF
                  outputSize={index === algorithmGroups.decoder.length - 2 ? // If this is the last FF before Visualize
                    algorithmGroups.decoder[algorithmGroups.decoder.length - 1].parameters.width * 
                    algorithmGroups.decoder[algorithmGroups.decoder.length - 1].parameters.height : 
                    null} />;
                default:
                  return null;
              }
            })}
            <InsertNetwork
              width='50px'
              height='50px'
              onAddComponent={(type) => addAlgorithm('decoder', type)}
              isDecoder={true}
            />
            {/* Visualize component is always last */}
            {algorithmGroups.decoder.slice(-1).map((algorithm, index) => {
              const props = {
                key: `${algorithm.type}-${algorithmGroups.decoder.length - 1}`,
                groupKey: "decoder",
                index: algorithmGroups.decoder.length - 1
              };
              return <Visualize key={props.key}
              groupKey="decoder"
              index={algorithmGroups.decoder.length - 1} />;
            })}
          </div>

          {/* Output Section */}
          <div className="output-section mt-6">
            <ImageCard 
              width='100px' 
              height='100px' 
              src={outputImage}
              text={!outputImage ? 'Output' : undefined}
            />
            <button 
              className={`button mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTrain}
              disabled={isLoading}
            >
              {isLoading ? 'Training...' : 'Train'}
            </button>
          </div>
        </div>
      </AlgorithmGroupContext.Provider>
    </div>
  );
};

export default Page;