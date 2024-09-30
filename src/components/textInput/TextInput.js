const TextInput = ({ value, onChange, label, id, classNames, name, typeInput = 'text' }) => (
    <div className={classNames}>
        <input
            className="input-default"
            type={typeInput}
            id={id}
            required
            value={value}
            onChange={onChange}
            name={name}
        />
        <label className="input-label" htmlFor={id}>
            {label}
        </label>
    </div>
);

export default TextInput;
