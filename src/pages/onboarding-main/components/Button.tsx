interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style,
}) => {
  return (
    <button style={style} onClick={onClick} className="flex py-[10px] px-[32px] items-center justify-center gap-[6px] rounded-full border-[1px] border-[#BFBFBF] text-[#2D2D2D] font-[Nunito] text-[16px]/[20px] font-semibold">{children}</button>
  )
}