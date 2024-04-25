import * as React from 'react';
import Button from '@mui/material/Button'

const Kernel = () => {
    const [rows, setRows] = React.useState(3);
    const [cols, setCols] = React.useState(3);
    const [gridValues, setGridValues] = React.useState([]);
    
    const initializeGrid = (rows, cols) => {
        const grid = Array.from({ length: rows}, () => Array.from({ length: cols}, () => ''));
        setGridValues(grid);
    };

    React.useEffect(() => {
        initializeGrid(rows, cols);
    }, [rows, cols]);

    return (
        <div>
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
                                style={{ width: '100%', padding: '10px' }} 
                            />
                        );
                    });
                })}
            </div>
            <Button>
                Submit
            </Button>
        </div>
    );
};

export default Kernel;