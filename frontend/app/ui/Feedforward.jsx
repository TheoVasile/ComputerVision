import { useState } from 'react'

import Popup from "./Popup";


const PopupContent = ({handleUpdate}) => {
    const [layers, setLayers] = useState([])

    const updateLayers = (index, weights, biases) => {
        setLayers(prevLayers => 
            prevLayers.map((layer, i) => i === index ? { weights: weights, biases: biases } : layer)
          );
    }

    const addLayer = (weights, biases) => {
        setLayers(prevLayers => [...prevLayers, {weights: weights, biases: biases}])
    }

    return (
        <div style={{ padding:'30px' }}>
            {layers.map((layer, index) => {
                return (
                <div>
                    weights
                    {JSON.stringify(layer.weights)}
                    biases
                    {JSON.stringify(layer.biases)}
                </div>)
            })}
            <button className="button" onClick={() => addLayer([-1, 0, 1], [0, 0, 0])}>
                +
            </button>
        </div>
    )
}

export default function Feedforward({groupKey, index, updateAlgorithmGroup, ...props}) {
    const handleUpdate = ({newValue}) => {
        updateAlgorithmGroup(groupKey, index, newValue)
    }
    
    return (
      <Popup buttonContent={<div className="ff-card">
        <span style={{
            fontSize: '12px', // Adjust the size as needed
            fontWeight: 'bold'
        }}>FF</span>
        </div>} renderPopupContent={() => <PopupContent handleUpdate={handleUpdate}/>}>
        </Popup>
    );
  }