"use client"

import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
import ImageCard from './ui/Imagecard'
import {useState} from 'react'

const Page = () => {
  const isImgSelected = true
  const [showSidebar, setShowSidebar] = useState(false);
  const encoder = []
  const decoder = []
  return (
    <div className='p-4'>
      <Sidebar />
      {isImgSelected ? (
        <div className="container">
          <Dropzone className='' text='Drop image' height='150px' width='150px' />
          <Convolver />
          <ImageCard width='100px' height='100px' />
          <ImageCard width='150px' height='150px' />
        </div>
      ) : (
        <p>hello</p>
      )}
    </div>
  )
}

export default Page