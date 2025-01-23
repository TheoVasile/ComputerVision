"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
//import Dropzone from './Dropzone';
import { useDropzone } from 'react-dropzone';
import ImageCard from './Imagecard';
import HorizontalImageList from './HorizontalImageList'

export default function Sidebar() {
    const [open, setOpen] = React.useState(false);
    const [images, setFiles] = React.useState([])

    const onDrop = useCallback(acceptedFiles => {
        setFiles(previousFiles => [
            ...previousFiles,
            ...acceptedFiles.map(file =>{
                return {
                    file: file,
                    src: URL.createObjectURL(file)
                };
            })
        ])
        console.log(images)
    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop, accept: {'image/*': []}});

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <div className="drawer-list-container">
            <div className="image-list">
                <form>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <ImageCard width='150px' text="Click to select images" height='150px' src=""/>
                    </div>
                </form>
                <HorizontalImageList images={images}/>
            </div>
        </div>
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
