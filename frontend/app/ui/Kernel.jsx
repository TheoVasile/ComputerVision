import * as React from 'react';
import Button from '@mui/material/Button'

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

function Kernel() {
    const [rows, setRows] = React.useState(3);
    const [cols, setCols] = React.useState(3);
    const [gridValues, setGridValues] = React.useState([]);
    
    const initializeGrid = (rows, cols) => {
        const grid = Array.from({ length: rows}, () => Array.from({ length: cols}, () => ''));
        setGridValues(grid);
    };

    const handleInputChange = (rowIndex, colIndex, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        // Create a new copy of the grid with the updated value
        const newGridValues = gridValues.map((row, rIndex) => 
            row.map((cell, cIndex) => {
                if (rIndex === rowIndex && cIndex === colIndex) {
                    return numericValue; // update the value for the specific cell
                }
                return cell; // return the existing value for other cells
            })
        );
    
        // Update the state with the new grid
        setGridValues(newGridValues);
    };

    React.useEffect(() => {
        initializeGrid(rows, cols);
    }, [rows, cols]);

    return (
        <div style={{padding:'30px'}}>
            <input type="number" value={rows} onChange={e => {setRows(e.target.value)}} />
            <input type="number" value={cols} onChange={e => {setCols(e.target.value)}} />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                {gridValues.map((row, rowIndex) => {
                    return row.map((value, colIndex) => {
                        return (
                            <input
                                key={`${rowIndex}-${colIndex}`} 
                                type="text" 
                                value={value} 
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                style={inputStyle} 
                            />
                        );
                    });
                })}
            </div>
        </div>
    );
};

export default Kernel;