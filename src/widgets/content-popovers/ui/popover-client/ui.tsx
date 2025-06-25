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
  refreshSharedClients?: () => Promise<void>
}

export const PopoverClient: React.FC<IPopoverClientProps> = ({
  documentId,
  setClientId,
  customTrigger,
  initialSelectedClientsId,
  refreshSharedClients
}) => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
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

  const toggleClientSelection = async (client_id: string) => {
    const isAlreadySelected =
      selectedClient === client_id ||
      initialSelectedClientsId?.includes(client_id);

    setSelectedClient(isAlreadySelected ? null : client_id);

    if (documentId) {
      const data: ShareContentData = {
        content_id: documentId,
        client_id: client_id,
      };
      if (isAlreadySelected) {
        await CoachService.revokeContent(data);
      } else {
        await CoachService.shareContent(data);
      }

      await refreshSharedClients?.();
    }

    setClientId?.(isAlreadySelected ? null : client_id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant="secondary"
            className="w-12 h-12 p-[10px] rounded-full relative"
          >
            <Personalized />
            {selectedClient && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
              >
                1
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[358px] md:w-[419px] p-6 flex flex-col gap-6">
        <Input
          variant="bottom-border"
          placeholder="Choose a client"
          className="py-1/2 h-[26px] pl-2 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="h-[139px] w-full">
          <div className="flex flex-col gap-2 pr-3">
            {filteredClients.map((client) => (
              <button
                key={client.client_id}
                className={`flex items-center w-full py-2 px-[14px] gap-2 rounded-md cursor-pointer bg-white`}
                onClick={() => toggleClientSelection(client.client_id)}
              >
                <Checkbox
                  id={`client-${client.client_id}`}
                  checked={
                    selectedClient === client.client_id ||
                    initialSelectedClientsId?.includes(client.client_id)
                  }
                  onCheckedChange={() =>
                    toggleClientSelection(client.client_id)
                  }
                  value={client.client_id}
                  className={cn(
                    "w-4 h-4 p-0.5 border-gray-300 rounded-full",
                    selectedClient === client.client_id && "border-gray-600"
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
      </PopoverContent>
    </Popover>
  );
};
