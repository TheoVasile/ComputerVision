import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

const Popup = ({buttonContent, renderPopupContent, ...props}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}>
                {buttonContent}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                {renderPopupContent(handleClose)}
            </Dialog>
        </React.Fragment>
    );
};

export default Popup;