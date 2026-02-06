export const Card = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
    <div className="flex items-center justify-between gap-2 mb-4 md:mb-6">
      <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#1D1D1F] whitespace-nowrap">
        {title}
      </h3>

      {action && action}
    </div>
    {children}
  </div>
);
