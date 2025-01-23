import React from 'react'
import { FixedSizeList } from 'react-window'

const Row = ({ index, style, data }) => (
    <div style={{ ...style, display: 'flex' }}>
      <img src={data[index].src} alt={`image ${index}`} style={{ width: '150px', height: '150px' }} />
    </div>
  );  

const HorizontalImageList = ({ images }) => {
    return (
        <FixedSizeList 
            className='horizontal-image-list'
            height={150} 
            itemCount={images.length}
            itemSize={160}
            layout='horizontal'
            width={300}
            itemData={images}
        >
            {Row}
        </FixedSizeList>
    )
}

export default HorizontalImageList;