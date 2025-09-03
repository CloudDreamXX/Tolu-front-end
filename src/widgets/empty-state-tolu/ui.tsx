import EmptyTolu from "shared/assets/icons/empty-tolu";

interface EmptyStateToluProps {
  text: string;
  footer: React.ReactNode;
}

export const EmptyStateTolu = ({ text, footer }: EmptyStateToluProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full">
      <EmptyTolu width={150} height={150} />
      <p className="text-[20px] font-[500] text-[#1D1D1F] max-w-[500px] mb-8 mt-4 text-center">
        {text}
      </p>
      {footer}
    </div>
  );
};
