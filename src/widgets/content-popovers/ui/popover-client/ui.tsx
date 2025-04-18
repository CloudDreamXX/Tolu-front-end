import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
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

export const PopoverClient: React.FC = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [clients] = useState<string[]>([
    "Amanda Francis1",
    "Amanda Francis2",
    "Amanda Francis3",
    "Amanda Francis4",
    "Amanda Francis5",
    "Amanda Francis6",
    "Amanda Francis7",
    "Amanda Francis8",
  ]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const toggleClientSelection = (client: string) => {
    console.log("client", client);
    setSelectedClients((prev) =>
      prev.includes(client)
        ? prev.filter((c) => c !== client)
        : [...prev, client]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-12 h-12 p-[10px] rounded-full relative"
        >
          <Personalized />
          {selectedClients.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
            >
              {selectedClients.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-6 flex flex-col gap-6">
        <Input
          variant="bottom-border"
          iconRight={<PlusIcon className="relative left-3" />}
          placeholder="Choose a client"
          className="py-1/2 h-[26px] pl-2 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="h-[139px] w-full">
          <div className="flex flex-col gap-2 pr-3">
            {filteredClients.map((client) => (
              <button
                key={client}
                className={`flex items-center w-full py-2 px-[14px] gap-2 rounded-md cursor-pointer bg-white`}
                onClick={() => toggleClientSelection(client)}
              >
                <Checkbox
                  id={`client-${client}`}
                  checked={selectedClients.includes(client)}
                  onCheckedChange={() => toggleClientSelection(client)}
                  value={client}
                  className={cn(
                    "w-4 h-4 p-0.5 border-gray-300 rounded-full",
                    selectedClients.includes(client) && "border-gray-600"
                  )}
                  checkClassName="min-w-2.5 w-2.5 h-2.5 border-gray-300 rounded-full bg-gray-600 text-gray-600"
                />
                <label
                  htmlFor={`client-${client}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {client}
                </label>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
