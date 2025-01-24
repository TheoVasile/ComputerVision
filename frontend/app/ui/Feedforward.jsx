"use client"

import React, { useContext, useEffect, useState } from 'react';
import Popup from './Popup';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';

const PopupContent = ({ layerSizes, setLayerSizes, handleSubmit, inputSize }) => {
    return (
        <div style={{ padding: '30px' }}>
            <div>
                Layer sizes (comma-separated)
            </div>
            <div>
                <input
                    className='input'
                    type="text"
                    value={layerSizes}
                    onChange={(e) => {
                        const val = e.target.value;
                        // Allow only numbers, commas, and spaces
                        if (/^[\d,\s]*$/.test(val)) {
                            setLayerSizes(val);
                        }
                    }}
                />
            </div>
            <div className="mt-4 text-sm text-gray-600">
                Input size: {inputSize}
            </div>
            <button 
                className="button mt-4"
                onClick={handleSubmit}
            >
                Set Layers
            </button>
        </div>
    );
};

const Feedforward = ({ groupKey, index, inputSize, outputSize }) => {
    const { updateAlgorithmGroup } = useContext(AlgorithmGroupContext);
    const [layerSizes, setLayerSizes] = useState('');

    // Initialize the feedforward with empty parameters
    useEffect(() => {
        updateAlgorithmGroup(groupKey, index, {
            type: "FF",
            parameters: []
        });
    }, []);

    const handleSubmit = () => {
        console.log("Submitting layer sizes:", layerSizes);
        
        if (!inputSize) {
            console.error('Input size not available');
            return;
        }
        
        try {
            // Parse layer sizes
            const sizes = layerSizes.split(',')
                .map(s => parseInt(s.trim()))
                .filter(s => !isNaN(s) && s > 0);
            
            if (sizes.length === 0) {
                console.error('No valid layer sizes provided');
                return;
            }
            
            console.log("Layer sizes:", sizes);
            
            // For encoder, use the last size as output
            // For decoder, use the provided outputSize
            const allSizes = groupKey === 'encoder' 
                ? [inputSize, ...sizes]  // For encoder, output is last layer size
                : [inputSize, ...sizes.slice(0, -1), outputSize];  // For decoder, use provided output size
            
            console.log("All sizes:", allSizes);
            
            // Create layer parameters
            const parameters = [];
            for (let i = 0; i < allSizes.length - 1; i++) {
                const currentSize = allSizes[i];
                const nextSize = allSizes[i + 1];
                
                console.log(`Creating layer ${i}: ${currentSize} -> ${nextSize}`);
                
                // Create weight matrix of shape [currentSize x nextSize]
                const weights = [];
                for (let j = 0; j < currentSize; j++) {
                    const row = [];
                    for (let k = 0; k < nextSize; k++) {
                        // He initialization
                        row.push(Math.sqrt(2.0 / currentSize) * randn());
                    }
                    weights.push(row);
                }
                
                // Create bias vector of shape [nextSize]
                const biases = new Array(nextSize).fill(0);
                
                const layer = {
                    weights: weights,
                    biases: biases
                };
                console.log(`Layer ${i} data:`, layer);
                console.log(`Layer ${i} weights shape: ${weights.length}x${weights[0].length}`);
                console.log(`Layer ${i} biases length: ${biases.length}`);
                
                parameters.push(layer);
            }
            
            const algorithmData = {
                type: "FF",
                parameters: parameters
            };
            console.log("Final algorithm data:", algorithmData);
            
            updateAlgorithmGroup(groupKey, index, algorithmData);
        } catch (error) {
            console.error("Error creating feedforward parameters:", error);
        }
    };

    return (
        <Popup
            buttonContent={
                <div className='ff-card'>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>FF</span>
                </div>
            }
            renderPopupContent={() => (
                <PopupContent
                    layerSizes={layerSizes}
                    setLayerSizes={setLayerSizes}
                    handleSubmit={handleSubmit}
                    inputSize={inputSize}
                />
            )}
        />
    );
};

// Box-Muller transform for normal distribution
function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default Feedforward;