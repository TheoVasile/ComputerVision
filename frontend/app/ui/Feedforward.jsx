import { useState } from 'react'

import Popup from "./Popup";

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

const networkComponentList = (layer_sizes) => {
    return layer_sizes.map((layer_size, index) => {
        <div>
            layer size
            <input style={{inputStyle}} value={layer_size}/>
        </div>
    });
}

const popupContent = () => {
    const [layers, setLayers] = useState([0])
    return (
        <div>
            {networkComponentList(layers)}
        </div>
    )
}

export default function Feedforward({...props}) {
    return (
      <Popup buttonContent={<div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Add other styles for the box as needed, like width, height, border, etc.
        width: props.width, // example width
        height: props.height, // example height
        borderRadius: '10px',
        padding: '10px 10px',
        backgroundColor: '#8ec4f7',
        color: '#6389ac',
        boxShadow: '0 0 8px rgba(0,0,0,0.2)'
        }}>
        <span style={{
            fontSize: '12px', // Adjust the size as needed
            fontWeight: 'bold'
        }}>FF</span>
        </div>} renderPopupContent={popupContent}>
        </Popup>
    );
  }