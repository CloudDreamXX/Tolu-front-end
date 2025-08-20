export const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-[4px]">
    <p className="text-[#5F5F65] text-[12px] md:text-[18px] font-[500]">
      {label}
    </p>
    <p className="text-[#1D1D1F] text-[14px] md:text-[20px] font-[500]">
      {value}
    </p>
  </div>
);
