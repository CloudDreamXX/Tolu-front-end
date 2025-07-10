import { Share } from "entities/coach";
import { PopoverClient } from "widgets/content-popovers";

interface ClientsInfoProps {
  clients?: Share[];
  documentId?: string;
  refreshSharedClients?: () => Promise<void>;
}

export const ClientsInfo: React.FC<ClientsInfoProps> = ({
  clients,
  documentId,
  refreshSharedClients,
}) => {
  return (
    <PopoverClient
      documentId={documentId}
      initialSelectedClientsId={clients?.map((client) => client.client_id)}
      refreshSharedClients={refreshSharedClients}
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <h4 className="text-sm font-semibold md:text-base lg:text-lg">
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
