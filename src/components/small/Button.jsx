// eslint-disable-next-line react/prop-types
const Button = ({ disabled, width, text, bg, ...rest }) => {
  return (
    <button
      disabled={false}
      {...rest}
      className={`${width ? width : "w-full sm:w-auto"} ${
        bg ? bg : "bg-primary text-white"
      } 
          h-[40px]  md:h-[50px] px-4 rounded-lg text-sm font-semibold border border-primary  hover:text-white transition-all duration-100 ${
            disabled ? "opacity-[50%] cursor-not-allowed" : "cursor-pointer"
          }`}
    >
      {text}
    </button>
  );
};

export default Button;
