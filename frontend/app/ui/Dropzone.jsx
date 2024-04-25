"use client"
import Image from 'next/image'
import React, {useCallback, useState, useMemo} from 'react'
import {useDropzone} from 'react-dropzone'

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const Dropzone = ({className, onDrop}) => {
    const [files, setFiles] = useState([])

    /*
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file =>
                Object.assign(file, {preview: URL.createObjectURL(file)}))
            ])
        }
    }, [])*/

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop, accept: {'image/*': []}});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <form>
            <div {...getRootProps({className: className})} >
            <input {...getInputProps()} />
            {
                files.length ?
                <Image src={files.at(-1).preview} alt='' width={100} height={100}/> : 
                <p>Drop the files here ...</p>
            }
            </div>
        </form>
    )
}

export default Dropzone;