"use client"

import React, { useContext, useEffect } from 'react';
import Popup from './Popup';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';

const DEFAULT_KERNEL = [
  [0.0625, 0.125, 0.0625],
  [0.125, 0.25, 0.125],
  [0.0625, 0.125, 0.0625]
];

const PopupContent = ({ kernel, handleUpdate }) => {
  return (
    <div style={{ padding: '30px' }}>
      <div>Kernel Matrix (3x3)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginTop: '10px' }}>
        {kernel.map((row, i) => 
          row.map((value, j) => (
            <input
              key={`${i}-${j}`}
              className='input'
              type="number"
              step="0.0001"
              value={value}
              style={{ width: '60px' }}
              onChange={(e) => {
                const newKernel = kernel.map((r, ri) => 
                  r.map((v, rj) => 
                    ri === i && rj === j ? parseFloat(e.target.value) : v
                  )
                );
                handleUpdate(newKernel);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function CNN({ groupKey, index }) {
  const { updateAlgorithmGroup } = useContext(AlgorithmGroupContext);
  const [kernel, setKernel] = React.useState(DEFAULT_KERNEL);

  // Initialize CNN with default kernel
  useEffect(() => {
    console.log("Initializing CNN with default kernel:", DEFAULT_KERNEL);
    updateAlgorithmGroup(groupKey, index, {
      type: "CNN",
      kernel: DEFAULT_KERNEL
    });
  }, [groupKey, index, updateAlgorithmGroup]); // Added proper dependencies

  const handleUpdate = (newKernel) => {
    setKernel(newKernel);
    updateAlgorithmGroup(groupKey, index, {
      type: "CNN",
      kernel: newKernel
    });
  };

  return (
    <Popup
      buttonContent={
        <div className='cnn-card'>
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold'
          }}>CNN</span>
        </div>
      }
      renderPopupContent={() => 
        <PopupContent 
          kernel={kernel}
          handleUpdate={handleUpdate}
        />
      }
    />
  );
}
