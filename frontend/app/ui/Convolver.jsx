import * as React from 'react';
import Popup from './Popup';
import Kernel from './Kernel';

export default function Convolver({...props}) {
  return (
    <Popup buttonContent={<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Add other styles for the box as needed, like width, height, border, etc.
      width: props.width, // example width
      height: props.height, // example height
      borderRadius: '10px',
      padding: '10px 10px',
      backgroundColor: '#d7f58d',
      color: '#96ab62',
      boxShadow: '0 0 8px rgba(0,0,0,0.2)'
      }}>
      <span style={{
          fontSize: '12px', // Adjust the size as needed
          fontWeight: 'bold'
      }}>CNN</span>
      </div>} renderPopupContent={Kernel}>
      </Popup>
  );
}