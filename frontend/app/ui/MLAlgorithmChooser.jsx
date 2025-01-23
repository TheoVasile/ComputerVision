import Button from '@mui/material/Button'

const MLAlgorithmChooser = ({onSelectAlgorithm, onClose, isDecoder = false}) => {
    const handleAlgorithmSelection = (algorithmType) => {
        onSelectAlgorithm(algorithmType);
        onClose();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: isDecoder ? '150px' : '300px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            boxSizing: 'border-box',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            gap: '10px'
        }}>
            {!isDecoder && (
                <>
                    <Button onClick={() => handleAlgorithmSelection('CNN')}>
                        Convolutional Neural Network
                    </Button>
                    <Button onClick={() => handleAlgorithmSelection('PCA')}>
                        Principle Component Analysis
                    </Button>
                </>
            )}
            <Button 
                onClick={() => handleAlgorithmSelection('FF')}
                variant={isDecoder ? "contained" : "text"}
            >
                Feed Forward
            </Button>
        </div>
    );
};

export default MLAlgorithmChooser;