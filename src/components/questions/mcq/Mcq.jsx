/* eslint-disable react/prop-types */

const Mcq = ({
  question,
  options,
  isRequired = false,
  name,
  selectedValue,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label className="block font-bold text-lg leading-5 sm:leading-7 mb-2">
        {question}{" "}
        {isRequired ? (
          <span className="text-red-500 text-lg font-[600]">*</span>
        ) : (
          <span className="text-[#00000090] text-xs font-[600]">Optional</span>
        )}
      </label>
      {options.map((option, index) => (
        <div key={index} className="mb-2">
          <input
            type="radio"
            id={`${name}-${index}`}
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={() => onChange(option)}
            required={isRequired}
          />
          <label
            htmlFor={`${name}-${index}`}
            className="ml-[8px] text-sm cursor-pointer select-none capitalize"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Mcq;
