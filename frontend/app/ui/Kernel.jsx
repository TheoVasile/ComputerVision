import React, { useState, useEffect, useContext } from 'react';
import KernelContext from '../contexts/KernelContext';


const Kernel = ({ groupKey, index, updateAlgorithmGroup }) => {
    const {rows, setRows, cols, setCols, gridValues, setGridValues} = useContext(KernelContext)

    const handleInputChange = (rowIndex, colIndex, value) => {
        if (/^-?\d*(\.\d*)?$/.test(value)) {
            const newGridValues = gridValues.map((row, rIndex) =>
                row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? value : cell))
            );

            setGridValues(newGridValues);
            updateAlgorithmGroup(groupKey, index, { type: "CNN", kernel: newGridValues });
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} />
            <input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
                {gridValues.map((row, rowIndex) => row.map((value, colIndex) => (
                    <input
                        className="input"
                        key={`${rowIndex}-${colIndex}`}
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    />
                )))}
            </div>
        </div>
    );
};

export default Kernel;