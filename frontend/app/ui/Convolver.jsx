import * as React from 'react';
import Popup from './Popup';
import Kernel from './Kernel';

const Convolver = ({groupKey, index, updateAlgorithmGroup, ...props}) => {
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

export default Convolver;