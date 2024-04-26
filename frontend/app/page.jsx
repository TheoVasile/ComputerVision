"use client"

import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import ImageCard from './ui/Imagecard'
import InsertNetwork from './ui/InsertNetwork'
import BottomDrawer from './ui/BottomDrawer'
import {useState} from 'react'

const Page = () => {
  const isImgSelected = true
  const [showSidebar, setShowSidebar] = useState(false);
  const encoder = []
  const decoder = []

  const handleAddAlgorithm = (algorithmType) => {
    // Logic to add the specific machine learning algorithm component
    console.log(`Adding algorithm: ${algorithmType}`);
  };

  return (
    <div className='p-4'>
      <Sidebar />
      {isImgSelected ? (
        <div className="container">
          <Dropzone className='' text='Drop image' height='150px' width='150px' />
          <InsertNetwork width='50px' height='50px' onAddComponent={handleAddAlgorithm}/>
          <ImageCard width='100px' height='100px' />
          <InsertNetwork width='50px' height='50px' onAddComponent={handleAddAlgorithm}/>
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