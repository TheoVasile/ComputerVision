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

export default function Convolver() {
  return (
    <Popup>
        <Kernel />
      </Popup>
  );
}