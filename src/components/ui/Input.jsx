export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  className = ''
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};