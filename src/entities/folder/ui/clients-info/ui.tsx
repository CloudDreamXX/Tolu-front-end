import { Share } from "entities/coach";
import { Pencil } from "lucide-react";
import { PopoverClient } from "widgets/content-popovers";

interface ClientsInfoProps {
  clients?: Share[];
  documentId?: string;
  refreshSharedClients?: () => Promise<void>;
}

export const ClientsInfo: React.FC<ClientsInfoProps> = ({
  clients,
  documentId,
  refreshSharedClients
}) => {
  return (
    <PopoverClient
      documentId={documentId}
      initialSelectedClientsId={clients?.map((client) => client.client_id)}
      refreshSharedClients={refreshSharedClients}
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <h4 className="text-[18px] font-semibold">
            Clients: {clients?.length ?? "N/A"}
          </h4>
          <div className="text-[12px] font-semibold group-hover:text-[#008FF6]">
            &nbsp;/ Edit
          </div>
        </button>
      }
    />
  );
};
