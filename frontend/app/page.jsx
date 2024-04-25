"use client"

import Dropzone from './ui/Dropzone'
import Sidebar from './ui/Sidebar'
import Convolver from './ui/Convolver'
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
        <div>
          <Dropzone className="flex bg-gray-100 w-50 h-50 border-2 border-dashed items-center rounded" />
          <Convolver />
        </div>
      ) : (
        <p>hello</p>
      )}
    </div>
  )
}

export default Page