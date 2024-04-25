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

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                open form dialog
            </Button>
            <Dialog open={open} onClose={handleClose}>
                {children}
            </Dialog>
        </React.Fragment>
    );
};

export default Popup;