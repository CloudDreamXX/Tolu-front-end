// eslint-disable-next-line react/prop-types
const Input = ({ style, type = "text", label, ...rest }) => {
  return (
    <div>
      <label
        className={`${
          style ? style : "text-base md:text-lg text-textColor/80 pb-1 block"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        {...rest}
        className="border border-primary/10 w-full outline-none h-[50px] px-3 bg-transparent rounded-[10px]"
      />
    </div>
  );
};

export default Input;
