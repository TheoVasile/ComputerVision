

const InputField = ({onChange, ...props}) => {
    const inputStyle = {
        width: `${props.width}`,
        padding: '10px',
        margin: '0', // to remove any default margin
        border: 'none', // to remove the default border
        backgroundColor: '#f0f0f0', // light gray background
        borderRadius: '8px', // rounded corners
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)', // indented shadow
        outline: 'none', // to remove the default focus outline
        // add additional styles as needed
    };
    <input
    key={props.key} 
    type={props.type}
    value={props.value} 
    onChange={onChange}
    style={inputStyle} 
    />
};

export default InputField;