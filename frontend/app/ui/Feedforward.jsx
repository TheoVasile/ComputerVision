import { useState, useContext } from 'react'

import Popup from "./Popup";
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';

const initializeLayerParams = (layerSize) => {
    return {weights: Array.from({ length: layerSize }, () => Math.random()), biases: Array.from({ length: layerSize }, () => Math.random())};
}

const PopupContent = ({layers, handleUpdate}) => {
    return (
        <div style={{ padding:'30px' }}>
            {layers.map((layer, index) => {
                const formattedWeights = layer.weights.map(w => Number(w.toFixed(3)));
                const formattedBiases = layer.biases.map(b => Number(b.toFixed(3)));
                return (
                <div>
                    weights
                    {JSON.stringify(formattedWeights)}
                    biases
                    {JSON.stringify(formattedBiases)}
                </div>)
            })}
            <button className="button" onClick={()=>{handleUpdate(initializeLayerParams(3))}}>
                +
            </button>
        </div>
    )
}

export default function Feedforward({groupKey, index }) {
    const {updateAlgorithmGroup} = useContext(AlgorithmGroupContext)
    const [layers, setLayers] = useState([])

    const addLayer = (weights, biases) => {
        setLayers(prevLayers => [...prevLayers, {weights: weights, biases: biases}])
        updateAlgorithmGroup(groupKey, index, { type: "FF", params: layers })
    }

    return (
      <Popup buttonContent={<div className="ff-card">
        <span style={{
            fontSize: '12px', // Adjust the size as needed
            fontWeight: 'bold'
        }}>FF</span>
        </div>} renderPopupContent={() => <PopupContent layers={layers} handleUpdate={({weights, biases})=> {addLayer(weights, biases)}}/>}>
        </Popup>
    );
  }