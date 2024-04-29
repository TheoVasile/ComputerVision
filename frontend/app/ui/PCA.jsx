import * as React from 'react';
import Popup from './Popup';

const PopupContent = ({handleUpdate}) => {
    const [value, setValue] = React.useState(10);
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
                value={value} 
                onChange={(e) => {const value = e.target.value;
                    // Check if the value is an integer and greater than 0
                    if (/^[1-9]\d*$/.test(value)) {
                      setValue(value);
                      handleUpdate(value);
                    } else if (value === '') {
                      // Allow the field to be empty (in case the user wants to delete the input)
                      setValue(value);
                    }}}/>
            </div>
        </div>
    );
};

export default function PCA({groupKey, index, updateAlgorithmGroup, ...props}) {
  const handleUpdate = (newValue) => {
    updateAlgorithmGroup(groupKey, index, { type: "PCA", output_size: parseInt(newValue, 10) });
  }
  
  return (
    <Popup buttonContent={
      <div className='pca-card'>
        <span style={{
            fontSize: '12px', // Adjust the size as needed
            fontWeight: 'bold'
        }}>PCA</span>
      </div>} renderPopupContent={() => <PopupContent handleUpdate={handleUpdate}/>}
      />
  );
}