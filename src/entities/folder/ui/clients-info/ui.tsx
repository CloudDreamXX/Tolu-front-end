import { Share } from "entities/coach";
import { PopoverClient } from "widgets/content-popovers";

interface ClientsInfoProps {
  clients?: Share[];
  documentId?: string;
  documentTitle?: string;
  refreshSharedClients?: () => Promise<void>;
}

export const ClientsInfo: React.FC<ClientsInfoProps> = ({
  clients,
  documentId,
  documentTitle,
  refreshSharedClients,
}) => {
  return (
    <PopoverClient
      documentId={documentId}
      documentName={documentTitle}
      initialSelectedClientsId={clients?.map((client) => client.client_id)}
      refreshSharedClients={refreshSharedClients}
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
            Clients
          </div>
        </button>
      }
    />
  );
};
