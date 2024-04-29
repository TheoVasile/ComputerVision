import * as React from 'react';

const Kernel = ({groupKey, index, updateAlgorithmGroup}) => {
    const [rows, setRows] = React.useState(3);
    const [cols, setCols] = React.useState(3);
    const [gridValues, setGridValues] = React.useState([]);

    const initializeGrid = (rows, cols) => {
        const grid = Array.from({ length: rows}, () => Array.from({ length: cols}, () => '0'));
        setGridValues(grid);
    };

    const handleInputChange = (rowIndex, colIndex, value) => {
        const isValidValue = /^-?\d*(\.\d*)?$/.test(value);
        if (isValidValue) {
            // Create a new copy of the grid with the updated value
            const newGridValues = gridValues.map((row, rIndex) => 
                row.map((cell, cIndex) => {
                    if (rIndex === rowIndex && cIndex === colIndex) {
                        return value; // update the value for the specific cell
                    }
                    return cell; // return the existing value for other cells
                })
            );
            // Update the state with the new grid
            setGridValues(newGridValues);
            updateAlgorithmGroup(groupKey, index, {type: "CNN", kernel: newGridValues})
        }
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
                                className="input"
                                key={`${rowIndex}-${colIndex}`} 
                                type="text" 
                                value={value} 
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                            />
                        );
                    });
                })}
            </div>
        </div>
    );
};

export default Kernel;