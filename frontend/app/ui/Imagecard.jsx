import * as React from 'react';

const ImageCard = ({ width, height, src, text }) => {
    const style = {
        width,
        height,
        backgroundColor: src ? 'transparent' : '#eaeded',
        border: '2px dotted #bfc9ca',
        borderRadius: '15px',
        backgroundImage: src ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
    };

    const handleContextMenu = (e) => {
        if (!src) return; // Don't show context menu if there's no image
        e.preventDefault();
        
        // Create a new window/tab with HTML that displays the image
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