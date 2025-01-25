"use client"

import React, { useState } from 'react';
import Popup from './Popup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const PopupContent = ({epochs, setEpochs, learningRate, setLearningRate, trainPercentage, valPercentage, testPercentage, setTestPercentage, handleTrainPercentageChange, handleValPercentageChange, handleTrain}) => {
    return (
        <div className="backprop-popup">
          <div className="input-group">
            <div>Epochs</div>
            <div>
                <input
                type="number"
                value={epochs}
                onChange={(e) => setEpochs(e.target.value)}
                placeholder="Epochs"
                />
            </div>
            <div>Learning Rate</div>
            <div>
                <input
                type="number"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(e.target.value)}
                placeholder="Learning Rate"
                />
            </div>
            {/* slider for choosing train, validation, and test  */}
            <div className="slider-group">
              <input
                type="range"
                min="0"
                max="100"
                value={trainPercentage}
                onChange={handleTrainPercentageChange}
              />
              <span>|</span>
              <input
                type="range"
                min="0"
                max={100 - trainPercentage}
                value={valPercentage}
                onChange={handleValPercentageChange}
              />
              <span>|</span>
              <input
                type="range"
                min="0"
                max={100 - trainPercentage - valPercentage}
                value={testPercentage}
                onChange={(e) => setTestPercentage(e.target.value)}
              />
            </div>
            <div>
            <button 
                onClick={handleTrain}
                className={`button mt-4`}
            >
                Backpropogate
            </button>
            </div>
          </div>
        </div>
      );
};

const BackpropPopup = ({isLoading, handleTrain}) => {
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.01);
  const [error, setError] = useState(0.1);
  const [trainPercentage, setTrainPercentage] = useState(70);
  const [valPercentage, setValPercentage] = useState(15);
  const [testPercentage, setTestPercentage] = useState(15);

  const handleTrainPercentageChange = (e) => {
    const value = Math.min(100, Math.max(0, e.target.value));
    setTrainPercentage(value);
    setValPercentage(100 - value - testPercentage);
  };

  const handleValPercentageChange = (e) => {
    const value = Math.min(100 - trainPercentage, Math.max(0, e.target.value));
    setValPercentage(value);
    setTestPercentage(100 - trainPercentage - value);
  };

  return (
    <Popup
      buttonContent={
        <button 
            className={`button mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
        >
            {isLoading ? 'Training...' : 'Train'}
        </button>
      }
      renderPopupContent={() => 
        <PopupContent 
          epochs={epochs} setEpochs={setEpochs} 
          learningRate={learningRate} setLearningRate={setLearningRate}
          trainPercentage={trainPercentage} setTrainPercentage={setTrainPercentage} 
          valPercentage={valPercentage} setValPercentage={setValPercentage} 
          testPercentage={testPercentage} setTestPercentage={setTestPercentage}
          handleTrain={handleTrain} 
          handleTrainPercentageChange={handleTrainPercentageChange}
          handleValPercentageChange={handleValPercentageChange}
        />
      }
    />
  );
};

export default BackpropPopup;
