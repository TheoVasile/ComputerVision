"use client"
import React, {useCallback, useState, useMemo} from 'react'
import ImageCard from './Imagecard'
import {useDropzone} from 'react-dropzone'


const Dropzone = ({...props}) => {
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

    return (
        <form>
            <div {...getRootProps({className: props.className})}>
                <input {...getInputProps()} />
                <ImageCard width='150px' text={props.text} height='150px' src = {(files.length > 0) ? files.at(-1).preview : ""}/>
            </div>
        </form>
    )

    /*
    return (
        <form>
            <div {...getRootProps({className: props.className})} style={buttonStyle}>
            <input {...getInputProps()} />
            {
                files.length ?
                <Image src={files.at(-1).preview} alt='' width={100} height={100}/> : 
                <p>Drop the files here ...</p>
            }
            </div>
        </form>
    )
    */
}

export default Dropzone;