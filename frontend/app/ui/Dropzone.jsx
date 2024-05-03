"use client"
import React, { useCallback, useState, useEffect } from 'react'
import ImageCard from './Imagecard'
import {useDropzone} from 'react-dropzone'


const Dropzone = ({src, setSrc, file, setFile, ...props}) => {
    
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0])
    }, []);

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop, accept: {'image/*': []}});

    useEffect(() => {
        // This code runs when `files` array changes.
        if (file) {
            // Creating an object URL for the last file added
            const newSrc = URL.createObjectURL(file);
            setSrc(newSrc);

            // Optional: Clean up function to revoke URL when component unmounts or files update
            return () => {
                URL.revokeObjectURL(newSrc);
            };
        }
    }, [file]);

    return (
        <form>
            <div {...getRootProps({className: props.className})}>
                <input {...getInputProps()} />
                <ImageCard width='150px' text={ props.text } height='150px' src={ src }/>
            </div>
        </form>
    )
}

export default Dropzone;