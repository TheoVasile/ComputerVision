import React, { useContext } from 'react';
import Popup from './Popup';
import AlgorithmGroupContext from '../contexts/AlgorithmGroupContext';


const PopupContent = ({dimensions, handleUpdate}) => {
    return (
        <div style={{ padding:'30px' }}>
            <div>
            Output size
            </div>
            <div>
            <input
                className='input'
                key={"pca"} 
                type="text" 
                value={dimensions} 
                onChange={(e) => {const val = e.target.value;
                    // Check if the value is an integer and greater than 0
                    if (/^[1-9]\d*$/.test(val) || val === '') {
                      handleUpdate(val);
                    } else if (val === '') {
                      // Allow the field to be empty (in case the user wants to delete the input)
                      handleUpdate(val);
                    }}}/>
            </div>
        </div>
    );
};


export default function PCA({groupKey, index }) {
  const {updateAlgorithmGroup} = useContext(AlgorithmGroupContext)
  const [value, setValue] = React.useState(10);
  const handleUpdate = (newValue) => {
    setValue(newValue);
    updateAlgorithmGroup(groupKey, index, { type: "PCA", output_features: parseInt(newValue, 10) });
  }
  
  return (
    <Popup buttonContent={
      <div className='pca-card'>
        <span style={{
            fontSize: '12px', // Adjust the size as needed
            fontWeight: 'bold'
        }}>PCA</span>
      </div>} renderPopupContent={() => <PopupContent dimensions={value} handleUpdate={handleUpdate}/>}
      />
  );
}