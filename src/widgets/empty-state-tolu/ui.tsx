import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface EmptyStateToluProps {
  text: string;
  footer: React.ReactNode;
}

export const EmptyStateTolu = ({ text, footer }: EmptyStateToluProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full">
      <MaterialIcon
        iconName="category"
        size={80}
        fill={1}
        className="text-[#bbccee]"
      />
      <p className="text-[20px] font-[500] text-[#1D1D1F] max-w-[500px] mb-8 mt-4 text-center">
        {text}
      </p>
      {footer}
    </div>
  );
};
