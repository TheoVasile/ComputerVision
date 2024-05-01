import { useState, useContext } from 'react'

import Popup from "./Popup";
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';


const PopupContent = ({layers, handleUpdate}) => {
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
            <button className="button" onClick={()=>{handleUpdate([-1, 0, 1], [1, 1, 1])}}>
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
        </div>} renderPopupContent={() => <PopupContent layers={layers} handleUpdate={(weights, biases)=> {addLayer(weights, biases)}}/>}>
        </Popup>
    );
  }