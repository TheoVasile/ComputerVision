import React from 'react'
import Popup from './Popup';
import Button from '@mui/material/Button';
import MLAlgorithmChooser from './MLAlgorithmChooser'

const InsertNetwork = ({ width, height, onAddComponent, isDecoder = false }) => {
    return (
        <Popup width={width} height={height}
        buttonContent={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: width,
                height: height,
                border: '2px solid blue',
                borderRadius: '10px',
                backgroundColor: 'transparent'
                }}>
                <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>+</span>
                </div>
        }
        renderPopupContent={(closePopup) => (
            <MLAlgorithmChooser 
                onClose={closePopup} 
                onSelectAlgorithm={onAddComponent}
                isDecoder={isDecoder}
            />
        )}
        />
    );
}

export default InsertNetwork;