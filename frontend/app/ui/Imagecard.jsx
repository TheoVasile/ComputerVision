import * as React from 'react';

const ImageCard = ({ width, height, src, text }) => {
    const style = {
        width,
        height,
        backgroundColor: '#eaeded',
        border: '2px dotted #bfc9ca',
        borderRadius: '15px',
        backgroundImage: src ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#666',
        fontSize: '14px',
        textAlign: 'center',
        padding: '10px'
    };

    const handleContextMenu = (e) => {
        if (!src) return;
        e.preventDefault();
        
        const imageWindow = window.open('', '_blank');
        imageWindow.document.write(`
            <html>
                <head>
                    <title>Image View</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background: #1a1a1a;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100vh;
                            object-fit: contain;
                        }
                    </style>
                </head>
                <body>
                    <img src="${src}" alt="Full size image"/>
                </body>
            </html>
        `);
        imageWindow.document.close();
    };

    return (
        <div 
            style={style}
            onContextMenu={handleContextMenu}
            title={src ? "Right-click to open in new tab" : ""}
        >
            {text}
        </div>
    );
};

export default ImageCard;