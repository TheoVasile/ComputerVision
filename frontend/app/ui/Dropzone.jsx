"use client"
import React, { useCallback, useState, useEffect } from 'react'
import ImageCard from './Imagecard'
import {useDropzone} from 'react-dropzone'


const Dropzone = ({src, setSrc, ...props}) => {
    const [files, setFiles] = useState([])
    
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file =>
                Object.assign(file, {preview: URL.createObjectURL(file)}))
            ])
        }
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
        if (files.length > 0) {
            // Creating an object URL for the last file added
            const newSrc = URL.createObjectURL(files[files.length - 1]);
            setSrc(newSrc);

            // Optional: Clean up function to revoke URL when component unmounts or files update
            return () => {
                URL.revokeObjectURL(newSrc);
            };
        }
    }, [files]);

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