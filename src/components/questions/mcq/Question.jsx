// eslint-disable-next-line react/prop-types
const Question = ({ style, type = "text", isRequired, label, ...rest }) => {
  return (
    <div>
      <label className="block font-bold text-lg leading-5 sm:leading-7 mb-2">
        {label}{" "}
        {isRequired ? (
          <span className="text-red-500 text-lg font-[600]">*</span>
        ) : (
          <span className="text-[#00000090] text-xs font-[600]">Optional</span>
        )}
      </label>
      <input
        type={type}
        {...rest}
        className="border-b border-primary w-full outline-none h-[50px] px-3 bg-transparent "
      />
    </div>
  );
};

export default Question;
