"use client"

import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import Dropzone from './Dropzone';

export default function Sidebar() {
    const [open, setOpen] = React.useState(false);
    const [images, setFiles] = React.useState([])

    const onDrop = React.useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file =>
                Object.assign(file, {src: URL.createObjectURL(file)}))
            ])
        }
    }, [])

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Stack direction="row" spacing={2} style={{overflowX: 'scroll'}}>
                <Dropzone className="flex bg-gray-100 w-40 h-40 border-2 border-dashed items-center rounded" onDrop={onDrop}/>
                {images.map((image, index) => (
                    <div key={index} className="w-40 h-40" style={{ marginRight: '10px', display: 'inline-block' }}>
                        <img src={image.src} className="w-40 h-40"/>
                    </div>
                ))}
        </Stack>
    );
    return (
        <>
            <Button onClick={toggleDrawer(true)}>Open drawer</Button>
            <Drawer anchor='top' open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
            </Drawer>
        </>
    )
}
