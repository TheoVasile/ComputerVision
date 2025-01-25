"use client"

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Popup from './Popup';
import classnames from "classnames";
import {Slider} from '@base-ui-components/react/slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const MultiRangeSlider = ({ min, max, minVal, setMinVal, maxVal, setMaxVal, onChange, batch_size }) => {
    const step = (max - min) / batch_size;
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const leftRange = useRef(null);
    const middleRange = useRef(null);
    const rightRange = useRef(null);
  
    // Convert to percentage
    const getPercent = useCallback(
      (value) => Math.round(((value - min) / (max - min)) * 100),
      [min, max]
    );
  
    // Adjust the left, middle, and right ranges based on slider values
    useEffect(() => {
      if (minValRef.current && maxValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxVal);
  
        if (leftRange.current) {
          leftRange.current.style.width = `${minPercent}%`;
        }
  
        if (middleRange.current) {
          middleRange.current.style.left = `${minPercent}%`;
          middleRange.current.style.width = `${maxPercent - minPercent}%`;
        }
  
        if (rightRange.current) {
          rightRange.current.style.left = `${maxPercent}%`;
          rightRange.current.style.width = `${100 - maxPercent}%`;
        }
      }
    }, [minVal, maxVal, getPercent]);
  
    // Get min and max values when their state changes
    useEffect(() => {
      onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);
  
    return (
      <div className="container">
        {/* Slider input for the lower thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          ref={minValRef}
          onChange={(event) => {
            const value = Math.min(+event.target.value, maxVal - 1);
            setMinVal(value);
            event.target.value = value.toString();
          }}
          className={classnames("thumb thumb--zindex-3", {
            "thumb--zindex-5": minVal > max - 100,
          })}
        />
  
        {/* Slider input for the upper thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(event) => {
            const value = Math.max(+event.target.value, minVal + 1);
            setMaxVal(value);
            event.target.value = value.toString();
          }}
          className="thumb thumb--zindex-4"
        />
  
        {/* Slider Track and Ranges */}
        <div className="slider">
          <div className="slider__track" />
          <div ref={leftRange} className="slider__range slider__range--left" />
          <div ref={middleRange} className="slider__range slider__range--middle" />
          <div ref={rightRange} className="slider__range slider__range--right" />
          <div className="slider__left-value">{minVal}</div>
          <div className="slider__right-value">{maxVal}</div>
        </div>
      </div>
    );
  };

const PopupContent = ({epochs, setEpochs, learningRate, setLearningRate, handleTrain, batch_size}) => {
    const [minVal, setMinVal] = useState(80);
    const [maxVal, setMaxVal] = useState(90);
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
            <MultiRangeSlider
                min={0}
                max={100}
                minVal={minVal}
                setMinVal={setMinVal}
                maxVal={maxVal}
                setMaxVal={setMaxVal}
                onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
                batch_size={batch_size}
                />
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

const BackpropPopup = ({isLoading, handleTrain, batch_size}) => {
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.01);
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
          handleTrain={handleTrain} 
          batch_size={batch_size}
        />
      }
    />
  );
};

export default BackpropPopup;
