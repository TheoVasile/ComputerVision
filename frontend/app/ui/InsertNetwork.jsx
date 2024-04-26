import React from 'react'

import Popup from './Popup';
import Button from '@mui/material/Button';

const InsertNetwork = (props) => {
    return (
        <Popup width={props.width} height={props.height}
        buttonContent={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Add other styles for the box as needed, like width, height, border, etc.
                width: props.width, // example width
                height: props.height, // example height
                border: '2px solid blue',
                borderRadius: '10px',
                backgroundColor: 'transparent'
                }}>
                <span style={{
                    fontSize: '24px', // Adjust the size as needed
                    fontWeight: 'bold'
                }}>+</span>
                </div>
        }
        popupContent={
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%', // or a fixed width if you prefer
                height: '300px', // adjust as needed
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                boxSizing: 'border-box',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                {/* Replace with actual names or identifiers for your components */}
                <Button onClick={() => onPlaceComponent('CNN')}>Convolutional Neural Network</Button>
                <Button onClick={() => onPlaceComponent('PCA')}>Principle Component Analysis</Button>
                <Button onClick={() => onPlaceComponent('FF')}>Feed Forward</Button>
              </div>
        }
        />
    );
}

export default InsertNetwork;