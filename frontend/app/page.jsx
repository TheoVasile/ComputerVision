"use client"

import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import PCA from './ui/PCA'
import Feedforward from './ui/Feedforward'
import ImageCard from './ui/Imagecard'
import InsertNetwork from './ui/InsertNetwork'
import { useState } from 'react'
import AlgorithmGroupContext from './contexts/AlgorithmGroupContext'


const Page = () => {
  const [inputImageSrc, setInputImageSrc] = useState("")
  const [inputImageFile, setInputImageFile] = useState(null)
  const [bottleneck, setBottleneck] = useState([])
  const [outputImage, setOutputImage] = useState([])
  const [algorithmGroups, setAlgorithmGroups] = useState({encoder: [], decoder: []})

  const handleEncodeData = async () => {
    const formData = new FormData();
    formData.append('input', inputImageFile);
    try {
      console.log("algos "+ JSON.stringify(algorithmGroups.encoder))
      formData.append('algorithms', JSON.stringify(algorithmGroups.encoder));
    } catch (e) {
      console.error(e)
    }
    const response = await fetch('http://127.0.0.1:5000/encode', {
        method: 'POST',
        body: formData //JSON.stringify({input: inputImageFile, algorithms: algorithmGroups.encoder})
    });
    const data = await response.json();
    setBottleneck(JSON.stringify(data));
};

  const updateAlgorithmGroup = (groupKey, index, newAlgorithmData) => {
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: prev[groupKey].map((item, idx) => idx === index ? { ...item, ...newAlgorithmData } : item)
    }));
    console.log(algorithmGroups)
    console.log(algorithmGroups.encoder)
  };

  // Example functions to add an algorithm to a group
  const addAlgorithm = (groupKey, algorithmType) => {
    const newAlgorithm = { type: algorithmType, data: {} }; // Initialize with an empty data object
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: [...prev[groupKey], newAlgorithm]
    }));
  };

  function algorithmComponentList(groupKey) {
    return algorithmGroups[groupKey].map((algorithm, index) => {
      switch (algorithm.type) {
        case "CNN":
          return <Convolver key={index} groupKey={groupKey} index={index}/>;
        case "PCA":
          return <PCA key={index} groupKey={groupKey} index={index}/>;
        case "FF":
          return <Feedforward key={index} groupKey={groupKey} index={index}/>;
      default:
        return null;
      }
    });
  }

  return (
    <div className='p-4'>
      <Sidebar />
        <AlgorithmGroupContext.Provider value={{updateAlgorithmGroup}}>
          <div className="container">
            <div>
              <Dropzone src={inputImageSrc} setSrc={setInputImageSrc} file={inputImageFile} setFile={setInputImageFile} className='' text='Drop image' height='150px' width='150px'/>
              {inputImageSrc}
              <button className="button" onClick={handleEncodeData}>Encode</button>
            </div>
            {algorithmComponentList("encoder")}
            <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => addAlgorithm('encoder', algorithmType)}/>
            <div>
              <ImageCard width='100px' height='100px' />
              "{bottleneck}"
              <button className="button">Decode</button>
            </div>
            {algorithmComponentList("decoder")}
            <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => addAlgorithm('decoder', algorithmType)}/>
            <ImageCard width='150px' height='150px' />
          </div>
        </AlgorithmGroupContext.Provider>
    </div>
  )
}

export default Page