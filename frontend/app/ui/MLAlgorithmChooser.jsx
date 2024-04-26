import Button from '@mui/material/Button'

const MLAlgorithmChooser = ({onSelectAlgorithm, onClose}) => {
    const handleAlgorithmSelection = (algorithmType) => {
        onSelectAlgorithm(algorithmType);
        onClose(); // This will close the popup
    };
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%', // or a fixed width if you prefer
            height: '300px', // adjust as needed
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            boxSizing: 'border-box',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            {/* Replace with actual names or identifiers for your components */}
            <Button onClick={() => handleAlgorithmSelection('CNN')}>Convolutional Neural Network</Button>
            <Button onClick={() => handleAlgorithmSelection('PCA')}>Principle Component Analysis</Button>
            <Button onClick={() => handleAlgorithmSelection('FF')}>Feed Forward</Button>
        </div>
    );
};

export default MLAlgorithmChooser;