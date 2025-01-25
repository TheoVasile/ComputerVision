"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import { useDropzone } from 'react-dropzone';
import ImageCard from './Imagecard';
import HorizontalImageList from './HorizontalImageList'
import FormatImagesPopup from './FormatImagesPopup';

export default function Sidebar({images, setFiles}) {
    const [open, setOpen] = React.useState(false);
    const [isFormatPopupOpen, setIsFormatPopupOpen] = React.useState(false);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(previousFiles => [
            ...previousFiles,
            ...acceptedFiles.map(file => ({
                file: file,
                src: URL.createObjectURL(file)
            }))
        ]);
    }, []);

    const handleFormatImages = async (width, height) => {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img.file));
        formData.append('width', width);
        formData.append('height', height);

        try {
            const response = await fetch('http://127.0.0.1:5000/format_images', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to format images');
            }

            const data = await response.json();
            
            // Update images with formatted versions
            setFiles(data.images.map(base64Image => ({
                file: base64ToFile(base64Image),
                src: `data:image/jpeg;base64,${base64Image}`
            })));

            setIsFormatPopupOpen(false);
        } catch (error) {
            console.error('Error formatting images:', error);
            // You might want to show an error message to the user here
        }
    };

    const base64ToFile = (base64String) => {
        const byteString = atob(base64String);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new File([ab], 'formatted-image.jpg', { type: 'image/jpeg' });
    };

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
            <div className="format-button-container" style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)'
            }}>
                <Button 
                    variant="contained" 
                    onClick={() => setIsFormatPopupOpen(true)}
                    disabled={images.length === 0}
                >
                    Format Images
                </Button>
            </div>
            <FormatImagesPopup
                open={isFormatPopupOpen}
                onClose={() => setIsFormatPopupOpen(false)}
                onFormat={handleFormatImages}
            />
        </div>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Open Dataset</Button>
            <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
}
