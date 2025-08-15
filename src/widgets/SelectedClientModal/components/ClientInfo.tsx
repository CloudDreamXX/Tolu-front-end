import { PersonalInfo } from "entities/coach";

type Props = {
  client: PersonalInfo;
};

const ClientInfo: React.FC<Props> = ({ client }) => {
  return (
    <div className="bg-white p-[16px] md:p-0 rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-none md:bg-transparent grid grid-cols-1 md:grid-cols-2 gap-[24px] text-[14px]">
      <div className="flex flex-col gap-[24px]">
        <div className="h-[50px]">
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Full name
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.name}</p>
        </div>
        <div className="h-[50px]">
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Email
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.email}</p>
        </div>
        <div className="h-[50px]">
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Date of birth
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.date_of_birth}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[24px] justify-end">
        <div className="h-[50px]">
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Phone number
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.phone}</p>
        </div>
        <div className="h-[50px]">
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Location:
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.location}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
