interface CardProps {
  title: string;
  description: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  active,
  onClick,
}) => {
  return (
    <>
      {active ? (
        <button
          onClick={onClick}
          style={{ border: "1px solid rgba(28, 99, 219, 0.50)" }}
          className="bg-[#F6F9FE] p-4 flex flex-col gap-3 items-start rounded-[8px]"
        >
          <h3 className=" text-start text-lg text-[#1C63DB] font-bold">
            {title}
          </h3>
          <p className="text-[#5F5F65] text-start  text-base font-normal">
            {description}
          </p>
        </button>
      ) : (
        <button
          onClick={onClick}
          className="p-4 text-start flex flex-col gap-3 items-start rounded-[8px]"
        >
          <h3 className=" text-blac text-startk text-lg font-bold">{title}</h3>
          <p className="text-[#5F5F65]  text-start text-base font-normal">
            {description}
          </p>
        </button>
      )}
    </>
  );
};
