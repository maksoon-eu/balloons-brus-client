const TextInput = ({ value, onChange, label, id, classNames, name }) => (
    <div className={classNames}>
        <input 
            className='input-default' 
            type="text" 
            id={id} 
            required 
            value={value} 
            onChange={onChange} 
            name={name}
        />
        <label className="input-label" htmlFor={id}>{label}</label>
    </div>
);

export default TextInput;