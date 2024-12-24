// eslint-disable-next-line react/prop-types
const Button = ({ width, text, bg, ...rest }) => {
  return (
    <button
      {...rest}
      className={`${width ? width : "w-full sm:w-auto"} ${
        bg ? bg : "bg-primary text-white"
      } h-[50px] px-4 rounded-lg text-sm font-semibold border border-primary hover:bg-blue-500 hover:text-white transition-all duration-100`}
    >
      {text}
    </button>
  );
};

export default Button;
