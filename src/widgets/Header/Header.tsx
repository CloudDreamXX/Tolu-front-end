interface HeaderProps {
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ description }) => (
  <header className="w-full flex justify-center items-center md:justify-between md:items-end self-stretch md:pr-[40px]">
    <div className="flex flex-col items-center py-[84px] px-[13px] md:p-[40px] lg:py-[25px] lg:pl-[90px] lg:pr-[0px]  justify-center">
      <h2 className="text-[#1D1D1F] text-center text-[64px] md:text-[44.444px] font-bold font-open h-[88px] md:h-[54px]">
        TOLU
      </h2>
      <h4 className="capitalize break-all">
        {description === "COACH ADMIN" ? (
          <span className="text-[#1D1D1F] text-center text-[17.733px] font-semibold font-open md:h-[27px] leading-[normal]">
            COACH ADMIN
          </span>
        ) : (
          <div className="flex flex-col text-center">
            <span className="text-[#1D1D1F] text-[11.429px] font-semibold font-open leading-[normal]">
              YOUR MENOPAUSE
            </span>
            <span className="text-[#1D1D1F] text-[11.429px] font-semibold font-open leading-[normal]">
              HEALTH ASSISTANT
            </span>
          </div>
        )}
      </h4>
    </div>
  </header>
);
