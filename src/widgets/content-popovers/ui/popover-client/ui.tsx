import { EditClientModal } from "widgets/EditClientModal";
import {
  Client,
  ClientDetails,
  ClientProfile,
  ClientsResponse,
  CoachService,
  ShareContentData,
} from "entities/coach";
import { RootState } from "entities/store";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Personalized from "shared/assets/icons/personalized";
import Plus from "shared/assets/icons/plus";
import { cn, toast } from "shared/lib";
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
import { SelectedClientModal } from "widgets/SelectedClientModal";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { ConfirmDiscardModal } from "widgets/ConfirmDiscardModal";

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
  const [selectedFullClient, setSelectedFullClient] = useState<ClientProfile>({
    client_info: {
      id: "",
      name: "",
      gender: "",
      last_activity: "",
      chief_concerns: "",
      recent_updates: "",
      cycle_status: "",
      menopause_status: "",
      learning_now: {
        total_shared: 0,
        recent_items: [],
      },
      recent_interventions: "",
      recent_labs: "",
    },
    health_profile: {
      intakes: {
        challenges: "",
        symptoms: "",
      },
      health_timeline: {
        diagnosis: "",
        medication: "",
      },
    },
    personal_insights: {},
    labs: {},
  });
  const [tempSelectedClient, setTempSelectedClient] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientDetails>({
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
    created_at: "",
    permission_type: "",
  });
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("clientInfo");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

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

  const cleanState = () => {
    setSelectedFullClient({
      client_info: {
        id: "",
        name: "",
        gender: "",
        last_activity: "",
        chief_concerns: "",
        recent_updates: "",
        cycle_status: "",
        menopause_status: "",
        learning_now: {
          total_shared: 0,
          recent_items: [],
        },
        recent_interventions: "",
        recent_labs: "",
      },
      health_profile: {
        intakes: {
          challenges: "",
          symptoms: "",
        },
        health_timeline: {
          diagnosis: "",
          medication: "",
        },
      },
      personal_insights: {},
      labs: {},
    });
    setClientInfo({
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
      created_at: "",
      permission_type: "",
    });
    setNewClient({
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
  };

  const handleSelectClient = async (clientId: string) => {
    try {
      const fullClient = await CoachService.getClientProfile(clientId, token);
      setSelectedFullClient(fullClient);

      const editClientInfo = await CoachService.getClientInfo(clientId, token);
      setClientInfo(editClientInfo.client);
    } catch (e) {
      console.error("Error loading client profile", e);
      toast({
        variant: "destructive",
        title: "Failed to load client profile",
        description: "Failed to load client profile. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedFullClient) return;

    try {
      await CoachService.deleteClient(selectedFullClient.client_info.id, token);
      const updatedClients = await CoachService.getManagedClients();
      setClients(updatedClients.clients);
      toast({ title: "Deleted successfully" });
    } catch (err) {
      console.error("Failed to delete client", err);
      toast({
        variant: "destructive",
        title: "Failed to delete client",
        description: "Failed to delete client. Please try again.",
      });
    } finally {
      setConfirmDelete(false);
      cleanState();
    }
  };

  const discardChanges = () => {
    setEditModal(false);
    cleanState();
    setConfirmDiscard(false);
  };

  const updateClient = (field: string, value: any) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant="secondary"
            className="w-12 h-12 p-[10px] rounded-full relative bg-[#F3F6FB]"
            onClick={() => setPopoverOpen(true)}
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
      <PopoverContent className="w-[358px] md:w-[419px] p-6 flex flex-col z-10">
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
              <div className="flex justify-between items-center">
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
                      tempSelectedClient === client.client_id &&
                        "border-gray-600"
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
                <button
                  onClick={() => handleSelectClient(client.client_id)}
                  className="flex items-center justify-center text-[#1C63DB]"
                >
                  View
                </button>
              </div>
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

      {selectedFullClient.client_info.id !== "" &&
        !confirmDelete &&
        !editModal && (
          <SelectedClientModal
            client={selectedFullClient}
            onClose={() => {
              setConfirmDelete(false);
              cleanState();
            }}
            onEdit={() => setEditModal(true)}
            onDelete={() => setConfirmDelete(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

      {editModal && (
        <EditClientModal
          client={clientInfo}
          activeEditTab={activeEditTab}
          setActiveEditTab={setActiveEditTab}
          onCancel={() => setEditModal(false)}
          onSave={async () => {
            await CoachService.editClient(
              selectedFullClient.client_info.id,
              clientInfo,
              token
            );
            setEditModal(false);
            cleanState();
          }}
          updateClient={updateClient}
        />
      )}

      {confirmDiscard && (
        <ConfirmDiscardModal
          onCancel={() => setConfirmDiscard(false)}
          onDiscard={discardChanges}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          onCancel={() => {
            setConfirmDelete(false);
            cleanState();
          }}
          onDelete={handleDelete}
        />
      )}
    </Popover>
  );
};
