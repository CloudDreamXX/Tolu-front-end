export const DaySeparator = ({ label }: { label: string }) => (
  <div className="flex items-center my-3 select-none">
    <div className="flex-1 border-t border-[#E5E7EB]" />
    <span className="mx-3 text-xs text-[#6B7280]px-2 py-0.5 rounded-full">
      {label}
    </span>
    <div className="flex-1 border-t border-[#E5E7EB]" />
  </div>
);
