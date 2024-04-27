import * as React from 'react';
import Popup from './Popup';

const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '0', // to remove any default margin
    border: 'none', // to remove the default border
    backgroundColor: '#f0f0f0', // light gray background
    borderRadius: '8px', // rounded corners
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)', // indented shadow
    outline: 'none', // to remove the default focus outline
    // add additional styles as needed
};

const popupContent = () => {
    const [value, setValue] = React.useState(10);
    return (
        <div style={{ padding:'30px' }}>
            <div>
            Output size
            </div>
            <div>
            <input
                style={inputStyle}
                key={"pca"} 
                type="text" 
                value={value} 
                onChange={(e) => {const value = e.target.value;
                    // Check if the value is an integer and greater than 0
                    if (/^[1-9]\d*$/.test(value)) {
                      setValue(value);
                    } else if (value === '') {
                      // Allow the field to be empty (in case the user wants to delete the input)
                      setValue(value);
                    }}}/>
            </div>
        </div>
    );
};

export default function PCA({...props}) {
  return (
    <Popup buttonContent={<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Add other styles for the box as needed, like width, height, border, etc.
      width: props.width, // example width
      height: props.height, // example height
      border: '2px solid #b26d8e',
      borderRadius: '10px',
      padding: '10px 10px',
      backgroundColor: '#ff9ccb',
      color: '#b26d8e',
      }}>
      <span style={{
          fontSize: '12px', // Adjust the size as needed
          fontWeight: 'bold'
      }}>PCA</span>
      </div>} renderPopupContent={popupContent}>
      </Popup>
  );
}