"use client"

import React, { useContext, useEffect } from 'react';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';


export default function Fourier({ groupKey, index }) {
  const { updateAlgorithmGroup } = useContext(AlgorithmGroupContext);

  // Initialize Fourier
  useEffect(() => {
    console.log("Initializing Fourier");
    updateAlgorithmGroup(groupKey, index, {
      type: "Fourier"
    });
  }, []); // Added proper dependencies

  return (
    <div className='fourier-card'>
        <span style={{
        fontSize: '12px',
        fontWeight: 'bold'
        }}>Fourier</span>
    </div>
  );
}
