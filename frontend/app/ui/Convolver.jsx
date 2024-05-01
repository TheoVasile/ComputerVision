import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import Kernel from './Kernel';
import KernelContext from '../contexts/KernelContext'

const useGrid = (rows, cols) => {
  const createGrid = (rows, cols) => {
      return Array.from({ length: rows }, () => Array.from({ length: cols }, () => '0'));
  };

  const [gridValues, setGridValues] = useState(createGrid(rows, cols));

  useEffect(() => {
      setGridValues(createGrid(rows, cols));
  }, [rows, cols]);

  return [gridValues, setGridValues];
};

const Convolver = ({groupKey, index, updateAlgorithmGroup }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [gridValues, setGridValues] = useGrid(rows, cols);
  return (
    <Popup buttonContent={
    <div className="cnn-card">
      <span style={{
          fontSize: '12px', // Adjust the size as needed
          fontWeight: 'bold'
      }}>CNN</span>
      </div>
      } renderPopupContent={() => (
        <KernelContext.Provider value={{rows, setRows, cols, setCols, gridValues, setGridValues}}>
          <Kernel
            updateAlgorithmGroup={updateAlgorithmGroup} 
            groupKey={groupKey}
            index={index}
          />
        </KernelContext.Provider>
        )}>
      </Popup>
  );
}

export default Convolver;