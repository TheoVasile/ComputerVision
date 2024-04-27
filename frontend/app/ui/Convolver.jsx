import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Popup from './Popup';
import Kernel from './Kernel';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Convolver({...props}) {
  return (
    <Popup buttonContent={<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Add other styles for the box as needed, like width, height, border, etc.
      width: props.width, // example width
      height: props.height, // example height
      border: '2px solid #5a7575',
      borderRadius: '10px',
      padding: '10px 10px',
      backgroundColor: '#96C3C4',
      color: '#5a7575',
      }}>
      <span style={{
          fontSize: '12px', // Adjust the size as needed
          fontWeight: 'bold'
      }}>CNN</span>
      </div>} renderPopupContent={Kernel}>
        <Kernel />
      </Popup>
  );
}