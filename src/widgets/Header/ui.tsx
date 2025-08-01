export const AdminHeader: React.FC = () => (
  <header className="w-full flex justify-center items-center md:justify-between md:items-end self-stretch md:pr-[40px]">
    <div className="flex flex-col items-center px-[13px] md:p-[40px] lg:py-[25px] lg:pl-[90px] lg:pr-[0px]  justify-center">
      <p className="text-[#1D1D1F] text-center text-[64px] h-[88px] md:h-[64px] md:text-[46px] font-bold font-open">
        Tolu AI
      </p>
      <p className="text-[#1D1D1F] text-center text-[24px] md:text-[17px] font-semibold font-open leading-[normal]">
        COACH ADMIN
      </p>
    </div>
  </header>
);

export const ClientHeader: React.FC = () => (
  <header className="flex self-start md:justify-between md:items-end md:pr-[40px]">
    <div className="w-full flex flex-col items-center py-[21px] px-[13px] md:p-[40px] lg:py-[25px] lg:pl-[90px] lg:pr-[0px] justify-center">
      <h2 className="text-[#1D1D1F] text-center h-[38px] text-[27px] md:text-[44.444px] font-bold font-open md:h-[61px]">
        Tolu AI
      </h2>
      <span className="text-[#1D1D1F] text-[7px] md:text-[11px] font-semibold font-open leading-[normal] text-center">
        Your AI-powered assistant <br /> for your functional and <br /> holistic
        practices
      </span>
    </div>
  </header>
);
