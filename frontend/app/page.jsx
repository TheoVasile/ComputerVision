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


function algorithmComponentList(algorithms) {
  return algorithms.map((algorithm, index) => {
    if (algorithm === "CNN") {
      return(<Convolver key={index}/>);
    } else if (algorithm === "PCA") {
      return(<PCA key={index}/>)
    } else if (algorithm === "FF") {
      return(<Feedforward key={index}/>)
    }
  });
}

const Page = () => {
  const isImgSelected = true;
  const [encoder, setEncoder] = useState([]);
  const [decoder, setDecoder] = useState([]);

  const handleAddAlgorithm = (algorithmType, listType) => {
    if (listType === 'encoder') {
      setEncoder(prev => [...prev, algorithmType]);
    } else if (listType === 'decoder') {
      setDecoder(prev => [...prev, algorithmType]);
    }
  };

  return (
    <div className='p-4'>
      <Sidebar />
      {isImgSelected ? (
        <div className="container">
          <Dropzone className='' text='Drop image' height='150px' width='150px' />
          <PCA/>
          <Convolver />
          <Feedforward />
          {algorithmComponentList(encoder)}
          <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => handleAddAlgorithm(algorithmType, 'encoder')}/>
          <ImageCard width='100px' height='100px' />
          {algorithmComponentList(decoder)}
          <InsertNetwork width='50px' height='50px' onAddComponent={(algorithmType) => handleAddAlgorithm(algorithmType, 'decoder')}/>
          <ImageCard width='150px' height='150px' />
        </div>
      ) : (
        <p>hello</p>
      )}
      <BottomDrawer>
        <div>
          content
        </div>
      </BottomDrawer>
    </div>
  )
}

export default Page