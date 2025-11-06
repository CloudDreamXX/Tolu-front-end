import {
  Client,
  ClientDetails,
  ClientProfile,
  useShareContentMutation,
  useRevokeContentMutation,
  useDeleteClientMutation,
  useEditClientMutation,
  useGetManagedClientsQuery,
  useInviteClientMutation,
  useLazyGetClientInfoQuery,
  useLazyGetClientProfileQuery,
} from "entities/coach";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast } from "shared/lib";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { ScrollArea } from "shared/ui/scroll-area";
import { AddClientModal } from "widgets/AddClientModal/ui";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { ConfirmDiscardModal } from "widgets/ConfirmDiscardModal";
import { EditClientModal } from "widgets/EditClientModal";
import { SelectedClientModal } from "widgets/SelectedClientModal";

interface IPopoverClientProps {
  documentId?: string;
  documentName?: string;
  setClientId?: (clientIds: string | null) => void;
  customTrigger?: React.ReactNode;
  initialSelectedClientsId?: string[] | null;
  refreshSharedClients?: () => Promise<void>;
  multiple?: boolean;
  maxSelections?: number;
  allowSingleDeselect?: boolean;
  smallChat?: boolean;
}

export const PopoverClient: React.FC<IPopoverClientProps> = ({
  documentId,
  setClientId,
  customTrigger,
  refreshSharedClients,
  initialSelectedClientsId,
  multiple = false,
  maxSelections,
  allowSingleDeselect = true,
  smallChat,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>(
    initialSelectedClientsId ?? []
  );
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
  const [tempSelectedClients, setTempSelectedClients] = useState<Set<string>>(
    new Set(initialSelectedClientsId ?? [])
  );
  const [search, setSearch] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientDetails>({
    first_name: "",
    last_name: "",
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
    first_name: "",
    last_name: "",
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
  const [activeTab, setActiveTab] = useState<string>("healthProfile");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const [inviteClient] = useInviteClientMutation();
  const [deleteClient] = useDeleteClientMutation();
  const [editClient] = useEditClientMutation();
  const [getClientInfo] = useLazyGetClientInfoQuery();
  const [getClientProfile] = useLazyGetClientProfileQuery();
  const { data: clientsData, refetch: refetchClients } =
    useGetManagedClientsQuery();
  const [shareContent] = useShareContentMutation();
  const [revokeContent] = useRevokeContentMutation();

  useEffect(() => {
    if (clientsData) {
      const activeClients = clientsData.clients.filter(
        (client) => client.status === "active"
      );
      setClients(activeClients);
    }
  }, [clientsData, setClients]);

  useEffect(() => {
    if (initialSelectedClientsId) {
      setSelectedClients(initialSelectedClientsId);
      setTempSelectedClients(new Set(initialSelectedClientsId));
    }
  }, [initialSelectedClientsId]);

  useEffect(() => {
    if (popoverOpen) {
      setTempSelectedClients(new Set(selectedClients));
    }
  }, [popoverOpen, selectedClients]);

  const areSetsEqual = (a: string[], b: Set<string>) => {
    if (a.length !== b.size) return false;
    return a.every((val) => b.has(val));
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const toggleClient = (clientId: string) => {
    setTempSelectedClients((prev) => {
      const next = new Set(prev);

      if (multiple) {
        const alreadySelected = next.has(clientId);
        if (alreadySelected) {
          next.delete(clientId);
        } else {
          if (typeof maxSelections === "number" && next.size >= maxSelections) {
            return prev;
          }
          next.add(clientId);
        }
      } else {
        const isSame = next.has(clientId);
        next.clear();
        if (!(isSame && allowSingleDeselect)) {
          next.add(clientId);
        }
      }

      return next;
    });
  };

  const handleSave = async () => {
    const tempArray = Array.from(tempSelectedClients);

    if (!multiple) {
      setClientId?.(tempArray[0] ?? null);
    }

    if (!documentId) {
      setSelectedClients(tempArray);
      return;
    }

    try {
      const prevSet = new Set(selectedClients);
      const revokeIds = Array.from(prevSet).filter(
        (id) => !tempSelectedClients.has(id)
      );

      if (revokeIds.length > 0) {
        await Promise.all(
          revokeIds.map((id) =>
            revokeContent({
              content_id: documentId,
              client_id: id,
            }).unwrap()
          )
        );
      }

      const shareIds = tempArray.filter((id) => !prevSet.has(id));
      if (shareIds.length > 0) {
        await Promise.all(
          shareIds.map((clientId) =>
            shareContent({
              content_id: documentId,
              client_id: clientId,
            }).unwrap()
          )
        );
      }

      setSelectedClients(tempArray);
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
      await inviteClient({ payload: newClient });
      setShowAddClientModal(false);
      refetchClients();
    } catch (err) {
      console.error("Error adding new client:", err);
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
      first_name: "",
      last_name: "",
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
      first_name: "",
      last_name: "",
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
      const { data: fullClient } = await getClientProfile(clientId);
      if (fullClient) {
        setSelectedFullClient(fullClient);
      }

      const { data: editClientInfo } = await getClientInfo(clientId);
      if (editClientInfo && editClientInfo.client) {
        setClientInfo(editClientInfo.client);
      }
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
      await deleteClient(selectedFullClient.client_info.id).unwrap();
      refetchClients();
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
            variant={smallChat ? "default" : "secondary"}
            className={`w-12 h-12 p-[10px] rounded-full relative ${smallChat ? "text-[#1C63DB]" : "bg-[#F3F6FB]"}`}
            onClick={() => setPopoverOpen(true)}
          >
            <MaterialIcon iconName="account_circle" size={24} fill={1} />
            {(selectedClients.length > 0 ||
              tempSelectedClients.values.length > 0) && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
                >
                  {selectedClients.length > 0
                    ? selectedClients.length
                    : tempSelectedClients.values.length}
                </Badge>
              )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[358px] md:w-[419px] p-6 flex flex-col z-50">
        <button
          className="absolute top-[24px] right-[24px] z-[999]"
          onClick={handleAddClientModal}
        >
          <MaterialIcon iconName="add" />
        </button>
        <Input
          variant="bottom-border"
          placeholder="Choose a client"
          className="py-1/2 h-[26px] pl-2 bg-transparent mb-6 w-[calc(100%-24px)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className={`${filteredClients.length > 2 ? "h-[139px]" : "h-[79px]"} w-full`}>
          <div className="flex flex-col gap-2 pr-3">
            {filteredClients.map((client) => (
              <div
                key={client.client_id}
                className="flex items-center justify-between"
              >
                <button
                  key={client.client_id}
                  className="flex items-center w-full py-2 px-[14px] gap-2 rounded-md cursor-pointer bg-white"
                  onClick={() => toggleClient(client.client_id)}
                >
                  <Checkbox
                    id={`client-${client.client_id}`}
                    checked={tempSelectedClients.has(client.client_id)}
                    value={client.client_id}
                    className={cn(
                      !multiple && "w-4 h-4 border-gray-300 rounded-full",
                      tempSelectedClients.has(client.client_id) &&
                      "border-gray-600"
                    )}
                    checkClassName={cn(
                      !multiple &&
                      "min-w-2.5 w-2.5 h-2.5 border-gray-300 rounded-full bg-gray-600 text-gray-600"
                    )}
                    customCheck={!multiple}
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
          onClick={() => {
            handleSave();
            setPopoverOpen(false);
          }}
          disabled={
            areSetsEqual(selectedClients, tempSelectedClients) ||
            (!tempSelectedClients && !selectedClients)
          }
        >
          Save
        </Button>
      </PopoverContent>

      {showAddClientModal && (
        <AddClientModal
          client={newClient}
          updateClient={(field, value) => {
            setNewClient((prev) => ({ ...prev, [field]: value }));
          }}
          onCancel={() => setShowAddClientModal(false)}
          onSave={handleClientModalSave}
        />
      )}

      {selectedFullClient.client_info.id !== "" &&
        !confirmDelete &&
        !editModal && (
          <SelectedClientModal
            clientId={selectedFullClient.client_info.id}
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
            await editClient({
              clientId: selectedFullClient.client_info.id,
              payload: clientInfo,
            });
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
