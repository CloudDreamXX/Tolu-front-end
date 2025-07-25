import { EditClientModal } from "widgets/EditClientModal";
import {
  Client,
  ClientsResponse,
  CoachService,
  ShareContentData,
} from "entities/coach";
import { RootState } from "entities/store";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Personalized from "shared/assets/icons/personalized";
import Plus from "shared/assets/icons/plus";
import { cn } from "shared/lib";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Badge,
  Checkbox,
} from "shared/ui";
import { ScrollArea } from "shared/ui/scroll-area";

interface IPopoverClientProps {
  documentId?: string;
  setClientId?: (clientId: string | null) => void;
  customTrigger?: React.ReactNode;
  initialSelectedClientsId?: string[] | null;
  refreshSharedClients?: () => Promise<void>;
}

export const PopoverClient: React.FC<IPopoverClientProps> = ({
  documentId,
  setClientId,
  customTrigger,
  refreshSharedClients,
}) => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [tempSelectedClient, setTempSelectedClient] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    primary_health_challenge: "",
    connection_source: "",
    working_duration: "",
    is_primary_coach: "",
    focus_areas: [],
    tolu_benefit: "",
    collaborative_usage: "",
    permission_type: "",
  });
  const [activeEditTab, setActiveEditTab] = useState<string>("editClientInfo");

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data: ClientsResponse = await CoachService.getManagedClients();
        const activeClients = data.clients.filter(
          (client) => client.status === "active"
        );
        setClients(activeClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, [token]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const handleSave = async () => {
    setClientId?.(tempSelectedClient);

    if (!documentId) return;

    try {
      if (selectedClient && selectedClient !== tempSelectedClient) {
        const revokeData: ShareContentData = {
          content_id: documentId,
          client_id: selectedClient,
        };
        await CoachService.revokeContent(revokeData);
      }

      if (tempSelectedClient && tempSelectedClient !== selectedClient) {
        const data: ShareContentData = {
          content_id: documentId,
          client_id: tempSelectedClient,
        };
        await CoachService.shareContent(data);
      }

      setSelectedClient(tempSelectedClient);
      await refreshSharedClients?.();
    } catch (err) {
      console.error("Error sharing/revoking content:", err);
    }
  };

  const handleAddClientModal = () => {
    setShowAddClientModal(true);
  };

  const handleClientModalSave = async () => {
    try {
      await CoachService.inviteClient(newClient);
      setShowAddClientModal(false);
      const updatedClients = await CoachService.getManagedClients();
      setClients(updatedClients.clients);
    } catch (err) {
      console.error("Error adding new client:", err);
    }
  };

  const handleNextAddStep = () => {
    const tabs = [
      "editClientInfo",
      "relationshipContext",
      "clientFitTOLU",
      "healthProfilePlan",
    ];
    const nextIndex = tabs.indexOf(activeEditTab) + 1;
    if (nextIndex < tabs.length) {
      setActiveEditTab(tabs[nextIndex]);
    } else {
      handleClientModalSave();
    }
  };

  const handleBackAddStep = () => {
    const tabs = [
      "editClientInfo",
      "relationshipContext",
      "clientFitTOLU",
      "healthProfilePlan",
    ];
    const prevIndex = tabs.indexOf(activeEditTab) - 1;
    if (prevIndex >= 0) {
      setActiveEditTab(tabs[prevIndex]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant="secondary"
            className="w-12 h-12 p-[10px] rounded-full relative bg-[#F3F6FB]"
          >
            <Personalized />
            {selectedClient ||
              (tempSelectedClient && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
                >
                  1
                </Badge>
              ))}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[358px] md:w-[419px] p-6 flex flex-col">
        <button
          className="absolute top-[24px] right-[24px] z-[999]"
          onClick={handleAddClientModal}
        >
          <Plus />
        </button>
        <Input
          variant="bottom-border"
          placeholder="Choose a client"
          className="py-1/2 h-[26px] pl-2 bg-transparent mb-6 w-[calc(100%-24px)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="h-[139px] w-full">
          <div className="flex flex-col gap-2 pr-3">
            {filteredClients.map((client) => (
              <button
                key={client.client_id}
                className="flex items-center w-full py-2 px-[14px] gap-2 rounded-md cursor-pointer bg-white"
                onClick={() =>
                  setTempSelectedClient((prev) =>
                    prev === client.client_id ? null : client.client_id
                  )
                }
              >
                <Checkbox
                  id={`client-${client.client_id}`}
                  checked={tempSelectedClient === client.client_id}
                  value={client.client_id}
                  className={cn(
                    "w-4 h-4 p-0.5 border-gray-300 rounded-full",
                    tempSelectedClient === client.client_id && "border-gray-600"
                  )}
                  checkClassName="min-w-2.5 w-2.5 h-2.5 border-gray-300 rounded-full bg-gray-600 text-gray-600"
                />
                <label
                  htmlFor={`client-${client.client_id}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {client.name}
                </label>
              </button>
            ))}
          </div>
        </ScrollArea>
        <Button
          variant="brightblue"
          className="w-fit px-[40px] ml-auto mt-2"
          onClick={handleSave}
          disabled={
            tempSelectedClient === selectedClient ||
            (!tempSelectedClient && !selectedClient)
          }
        >
          Save
        </Button>
      </PopoverContent>

      {showAddClientModal && (
        <EditClientModal
          client={newClient}
          activeEditTab={activeEditTab}
          setActiveEditTab={setActiveEditTab}
          onCancel={() => setShowAddClientModal(false)}
          onSave={handleClientModalSave}
          isNew={true}
          updateClient={(field, value) => {
            setNewClient((prev) => ({ ...prev, [field]: value }));
          }}
          onNext={handleNextAddStep}
          onBack={handleBackAddStep}
        />
      )}
    </Popover>
  );
};
