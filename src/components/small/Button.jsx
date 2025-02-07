const Button = ({children, disabled, width, text, bg, className, ...rest }) => {
  return (
    <button
      disabled={disabled}
      {...rest}
      className={`${width ? width : "w-full sm:w-auto"} ${
        bg ? bg : "bg-primary "
      } 
          p-3 px-4 gap-2 rounded-lg text-sm font-semibold  flex items-center justify-center  hover:text-black transition-all duration-100 ${
            disabled ? "opacity-[50%] cursor-not-allowed" : "cursor-pointer"
          } ${className || ""}`}
    >
      {children}
      {text}
    </button>
  );
};

export default Button;
