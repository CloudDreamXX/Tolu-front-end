import { HealthSummary } from "entities/coach";

type Props = {
  client: HealthSummary;
};

const HealthProfile: React.FC<Props> = ({ client }) => {
  return (
    <div className="bg-white p-[16px] md:p-0 rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-none md:bg-transparent grid grid-cols-1 md:grid-cols-3 gap-[24px] text-[14px]">
      <div className="flex flex-col gap-[24px]">
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Primary complaint
          </p>
          <p className="text-[16px] text-[#1D1D1F]">
            {client.primary_complaint}
          </p>
        </div>
        <div className="flex items-center gap-[24px]">
          <div>
            <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
              Cycle status
            </p>
            {client.menopause_cycle_status && (
              <span className="inline-flex items-center gap-[4px] bg-[#E0F5FF] px-[12px] py-[4px] rounded-full">
                <span className="w-[6px] h-[6px] bg-[#1C63DB] rounded-full"></span>
                <span className="text-[#000000] text-[16px]">
                  {client.menopause_cycle_status}
                </span>
              </span>
            )}
          </div>
          <div>
            <p className="md:hidden text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
              Client age
            </p>
            <p className="text-[16px] text-[#1D1D1F]">{client.client_age}</p>
          </div>
        </div>
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Learning now
          </p>
          {client.learning_now.length > 0 && (
            <p className="text-[16px] text-[#1D1D1F]">
              <span className="underline">{client.learning_now[0]}</span>
              <span> and </span>
              <span className="text-[#1C63D8] underline cursor-pointer">
                {client.learning_now.length > 1 &&
                  `${client.learning_now.length - 1} more`}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Working with this client since
          </p>
          <p className="text-[16px] text-[#1D1D1F]">
            {client.working_with_client_since}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Working on now
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.working_on_now}</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Tracking
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.tracking}</p>
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div>
          <p className="hidden md:block text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Client age
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.client_age}</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Recent Labs
          </p>
          <p className="text-[16px] text-[#1D1D1F]">{client.recent_labs}</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
            Personal insight
          </p>
          <p className="text-[16px] text-[#1D1D1F]">
            {client.personal_insights}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
