import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

const Popup = ({children, ...props}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const buttonStyle = {
        backgroundColor: props.backgroundColor,
        border: `2px solid ${props.color}`,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        outline: 'none',
        fontSize: '16px',
        color: props.color,
    }

    return (
        <React.Fragment>
            <Button style={buttonStyle} variant="outlined" onClick={handleClickOpen}>
                {props.text}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                {children}
            </Dialog>
        </React.Fragment>
    );
};

export default Popup;