import React from 'react'

import Popup from './Popup';
import Button from '@mui/material/Button';
import MLAlgorithmChooser from './MLAlgorithmChooser'

const InsertNetwork = ({...props}) => {
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
        renderPopupContent={(closePopup) => (
            <MLAlgorithmChooser onClose={closePopup} onSelectAlgorithm={props.onAddComponent}/>
    )}
        />
    );
}

export default InsertNetwork;