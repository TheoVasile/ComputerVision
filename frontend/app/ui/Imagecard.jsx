import * as React from 'react';

const ImageCard = (props) => {
    const style = {
        width: props.width,
        height: props.height,
        backgroundColor: props.src ? 'transparent' : '#eaeded',
        border: '2px dotted #bfc9ca',
        borderRadius: '15px',
        backgroundImage: props.src ? `url(${props.src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div style={style}>
            {props.text}
        </div>
    );
};

export default ImageCard;