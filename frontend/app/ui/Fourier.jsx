"use client"

import React, { useContext, useEffect, useState } from 'react';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';
import Popup from './Popup';


const PopupContent = ({ component, handleUpdate }) => {
    return (
      <div style={{ padding: '30px' }}>
        <div>Select Component to Display</div>
        <select value={component} onChange={(e) => handleUpdate(e.target.value)}>
          <option value="amplitude">Amplitude</option>
          <option value="phase">Phase</option>
        </select>
      </div>
    );
  };


export default function Fourier({ groupKey, index }) {
  const { updateAlgorithmGroup } = useContext(AlgorithmGroupContext);
  const [component, setComponent] = useState("amplitude");

  // Initialize Fourier
  useEffect(() => {
    console.log("Initializing Fourier");
    updateAlgorithmGroup(groupKey, index, {
      type: "Fourier",
      component: "amplitude"
    });
  }, []); // Added proper dependencies

  const handleUpdate = (newValue) => {
    setComponent(newValue);
    updateAlgorithmGroup(groupKey, index, { 
      type: "Fourier", 
      component: newValue 
    });
  }

  return (
    <Popup
      buttonContent={
        <div className='fourier-card'>
        <span style={{
        fontSize: '12px',
        fontWeight: 'bold'
        }}>Fourier</span>
        </div>
      }
      renderPopupContent={() => 
        <PopupContent 
          component={component}
          handleUpdate={handleUpdate}
        />
      }
    />
  );
}
