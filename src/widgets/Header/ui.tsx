export const AdminHeader: React.FC = () => (
  <header className="w-full flex justify-center items-center">
    <div className="flex flex-col items-center px-[13px] md:p-[40px] lg:py-[25px] justify-center pt-[48px]">
      <img src="/logo.png" className="w-[50px] h-[46px] mx-auto" />
      <p className="cursor-pointer text-[#1D1D1F] text-center text-[27px] md:text-[44px] font-bold">
        Tolu AI
      </p>
      <p className="capitalize text-[#1D1D1F] text-center text-[9.7px] md:text-[17.733px] font-semibold  leading-[normal]">
        Health Educator Admin
      </p>
    </div>
  </header>
);

export const ClientHeader: React.FC = () => (
  <header className="flex items-center justify-center w-full">
    <div className="w-fit flex flex-col py-[21px] px-[13px] md:p-[40px]">
      <h2 className="text-[#1D1D1F] text-center text-[27px] md:text-[44px] font-bold text-transform: uppercase">
        Tolu AI
      </h2>
      <span className="text-[#1D1D1F] text-base md:text-[22px] font-normal  leading-[normal] text-center">
        Knowledge Before Care
      </span>
    </div>
  </header>
);
