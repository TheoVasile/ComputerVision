"use client"

import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import PCA from './ui/PCA'
import Feedforward from './ui/Feedforward'
import ImageCard from './ui/Imagecard'
import InsertNetwork from './ui/InsertNetwork'
import BottomDrawer from './ui/BottomDrawer'
import {useState} from 'react'


const Page = () => {
  const [algorithmGroups, setAlgorithmGroups] = useState({encoder: [], decoder: []})

  const updateAlgorithmGroup = (groupKey, index, newAlgorithmData) => {
    setAlgorithmGroups(prev => ({
      ...prev,
      [groupKey]: prev[groupKey].map((item, idx) => idx === index ? { ...item, ...newAlgorithmData } : item)
    }));
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
          return <Convolver key={index} groupKey={groupKey} index={index} updateAlgorithmGroup={updateAlgorithmGroup}/>;
        case "PCA":
          return <PCA key={index} groupKey={groupKey} index={index} updateAlgorithmGroup={updateAlgorithmGroup}/>;
        case "FF":
          return <Feedforward key={index} groupKey={groupKey} index={index} updateAlgorithmGroup={updateAlgorithmGroup}/>;
      default:
        return null;
      }
    });
  }

  return (
    <div className='p-4'>
      <Sidebar />
        <div className="container">
          <div>
            <Dropzone className='' text='Drop image' height='150px' width='150px' />
            <button className="button">Encode</button>
          </div>
          {algorithmComponentList("encoder")}
          <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => addAlgorithm('encoder', algorithmType)}/>
          <div>
            <ImageCard width='100px' height='100px' />
            <button className="button">Decode</button>
          </div>
          {algorithmComponentList("decoder")}
          <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => addAlgorithm('decoder', algorithmType)}/>
          <ImageCard width='150px' height='150px' />
        </div>
      <BottomDrawer>
        <div>
          content
        </div>
      </BottomDrawer>
    </div>
  )
}

export default Page