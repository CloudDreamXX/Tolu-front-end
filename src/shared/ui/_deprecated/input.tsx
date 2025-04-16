interface InputProps {
  type?: string;
  label?: string;
  style?: string;
  [x: string]: any;
}

export const Input: React.FC<InputProps> = ({
  style,
  type = 'text',
  label,
  ...rest
}) => {
  return (
    <div className="flex-1">
      <label
        className={`${
          style ?? 'text-base md:text-lg text-textColor/80 pb-1 block'
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
