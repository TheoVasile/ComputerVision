"use client"

import React, { useContext } from 'react';
import Popup from './Popup';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';

const PopupContent = ({ width, height, handleUpdate }) => {
    return (
        <div style={{ padding: '30px' }}>
            <div>
                Output dimensions
            </div>
            <div style={{ marginTop: '10px' }}>
                <div>Width</div>
                <input
                    className='input'
                    type="text"
                    value={width}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^[1-9]\d*$/.test(val) || val === '') {
                            handleUpdate(val, height);
                        }
                    }}
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <div>Height</div>
                <input
                    className='input'
                    type="text"
                    value={height}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^[1-9]\d*$/.test(val) || val === '') {
                            handleUpdate(width, val);
                        }
                    }}
                />
            </div>
        </div>
    );
};

const Visualize = ({ groupKey, index }) => {
    const { updateAlgorithmGroup } = useContext(AlgorithmGroupContext);
    const [dimensions, setDimensions] = React.useState({ width: 224, height: 224 });

    const handleUpdate = (newWidth, newHeight) => {
        const width = newWidth === '' ? dimensions.width : parseInt(newWidth, 10);
        const height = newHeight === '' ? dimensions.height : parseInt(newHeight, 10);
        
        setDimensions({ width, height });
        updateAlgorithmGroup(groupKey, index, {
            type: "Visualize",
            parameters: { width, height }
        });
    };

    return (
        <Popup
            buttonContent={
                <div className='visualize-card'>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>Vis</span>
                </div>
            }
            renderPopupContent={() => (
                <PopupContent
                    width={dimensions.width}
                    height={dimensions.height}
                    handleUpdate={handleUpdate}
                />
            )}
        />
    );
};

export default Visualize;
