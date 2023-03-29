export default function Input({
  label,
  name,
  value,
  placeholder,
  type,
  onChange,
}) {
  return (
    <div className="form-control w-full max-w-xl">
      <label htmlFor={name} className="label form__label">
        <span className="label-text">{label}</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered input-info max-w-xl py-3 m-1"
      />
    </div>
  );
}
