"use client"

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const FormatImagesPopup = ({ open, onClose, onFormat }) => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [error, setError] = useState({ width: false, height: false });

    const handleSubmit = () => {
        // Validate inputs
        const widthNum = parseInt(width);
        const heightNum = parseInt(height);
        const newError = {
            width: !widthNum || widthNum <= 0,
            height: !heightNum || heightNum <= 0
        };
        
        setError(newError);

        if (newError.width || newError.height) {
            return;
        }

        onFormat(widthNum, heightNum);
    };

    const handleClose = () => {
        setWidth('');
        setHeight('');
        setError({ width: false, height: false });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: '400px',
                    maxWidth: '90vw',
                }
            }}
        >
            <DialogTitle>Format Images</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2
                    }}
                >
                    <TextField
                        label="Width (px)"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        error={error.width}
                        helperText={error.width ? "Please enter a valid width" : ""}
                        fullWidth
                    />
                    <TextField
                        label="Height (px)"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        error={error.height}
                        helperText={error.height ? "Please enter a valid height" : ""}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Format
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormatImagesPopup;
