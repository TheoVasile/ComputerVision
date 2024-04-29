import * as React from 'react';
import Popup from './Popup';
import Kernel from './Kernel';


const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '0', // to remove any default margin
  border: 'none', // to remove the default border
  backgroundColor: '#f0f0f0', // light gray background
  borderRadius: '8px', // rounded corners
  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)', // indented shadow
  outline: 'none', // to remove the default focus outline
  // add additional styles as needed
};


export default function Convolver({groupKey, index, updateAlgorithmGroup, ...props}) {
  return (
    <Popup buttonContent={
    <div className="cnn-card">
      <span style={{
          fontSize: '12px', // Adjust the size as needed
          fontWeight: 'bold'
      }}>CNN</span>
      </div>
      } renderPopupContent={() => (<Kernel
          updateAlgorithmGroup={updateAlgorithmGroup} 
          groupKey={groupKey} 
          index={index}
        />)}>
      </Popup>
  );
}