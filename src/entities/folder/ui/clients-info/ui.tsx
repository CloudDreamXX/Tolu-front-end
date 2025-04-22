import { Pencil } from "lucide-react";
import { PopoverClient } from "widgets/content-popovers";

interface ClientsInfoProps {
  client?: string[];
}

export const ClientsInfo: React.FC<ClientsInfoProps> = ({ client }) => {
  return (
    <PopoverClient
      customTrigger={
        <button className="flex flex-row items-center group">
          <h4 className="text-lg font-semibold">
            Clients: {client?.length ?? "N/A"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            <Pencil width={16} height={16} />
          </div>
        </button>
      }
    />
  );
};
