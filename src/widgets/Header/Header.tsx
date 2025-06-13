interface HeaderProps {
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({
  description = "COACH ADMIN",
}) => (
  <header className="flex justify-between items-end self-stretch pr-[40px]">
    <div className="flex flex-col items-center p-[40px] justify-center">
      <h2 className="text-[#1D1D1F] text-center text-[40px] font-bold font-open h-[54px]">
        TOLU
      </h2>
      <h4 className="break-all capitalize text-[#1D1D1F] text-center text-[20px] font-medium font-open h-[27px]">
        {description === "COACH ADMIN" ? (
          "COACH ADMIN"
        ) : (
          <span>
            YOUR MENOPAUSE
            <br />
            HEALTH ASSISTANT
          </span>
        )}
      </h4>
    </div>
  </header>
);
