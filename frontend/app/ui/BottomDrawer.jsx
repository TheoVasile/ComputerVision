import React, {useState} from 'react';


const BottomDrawer = ({children, ...props}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => setIsOpen(!isOpen);

    const peekHeight = 30;
    const drawerHeight = 150;

    const drawerStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: isOpen ? `calc(${drawerHeight}px + ${peekHeight}px)` : `${peekHeight}px`, // Adjust '50%' to whatever height you want when open
        transition: 'height 0.3s',
        overflow: 'hidden', // Prevent content from overflowing
      };
    
      const peekStyle = {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: `${peekHeight}px`,
        backgroundColor: 'white',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.2)',
      };

    return (
        <div style={drawerStyle}>
            <div style={peekStyle} onClick={handleToggle}>
                {isOpen ? 'Close' : 'Open'}
            </div>
            <div style={{zIndex: 10, backgroundColor: 'white', height: '100%', position: 'relative', bottom: -peekHeight, padding: '1rem', display: isOpen ? 'block' : 'hidden'}}>
                {children}
            </div>
        </div>
    );

}

export default BottomDrawer;