import { possibleClientNames } from "pages/content-manager";
import { useEffect, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "shared/ui";

interface FolderClientsInfoProps {
  client?: string[];
}

export const FolderClientsInfo: React.FC<FolderClientsInfoProps> = ({
  client,
}) => {
  const [isOpenAddClient, setIsOpenAddClient] = useState(false);
  const [clients, setClients] = useState<string[]>(client ?? []);
  const [choosedClients, setChoosedClients] = useState<string[]>(client ?? []);

  const toggleClientSelection = (client: string) => {
    setChoosedClients((prev) =>
      prev.includes(client)
        ? prev.filter((c) => c !== client)
        : [...prev, client]
    );
  };

  useEffect(() => {
    setChoosedClients(clients);
  }, [clients]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-row items-center group">
          <h4 className="text-lg font-semibold">
            Clients: {clients?.length ?? "N/A"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            <MaterialIcon iconName="edit" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <h4 className="flex flex-row gap-2 text-xl font-bold">
          <MaterialIcon iconName="emoji_people" />
          Clients
        </h4>
        <p className="text-sm text-[#5F5F65]">
          Manage client access to this folder
        </p>
        <div className="flex flex-col gap-1 mt-3">
          {!isOpenAddClient ? (
            <>
              <ScrollArea className="h-[256px] w-full flex flex-col gap-1 pr-1">
                <div className="flex flex-col w-full gap-1 pr-1">
                  {clients.map((client, index) => (
                    <div
                      key={client}
                      className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white rounded-lg"
                    >
                      <div className="flex flex-row items-center w-full gap-2">
                        <img
                          src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/32.jpg`}
                          alt="Client Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col w-full gap-1">
                          <span className="text-sm font-medium">{client}</span>
                        </div>
                        <button
                          onClick={() => {
                            setClients((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <MaterialIcon
                            iconName="delete"
                            className="text-red-600"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex flex-row justify-between mt-5">
                <Button
                  variant={"light-blue"}
                  className="w-[128px]"
                  onClick={() => {}}
                >
                  Cancel
                </Button>
                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-white text-[#008FF6]"
                    onClick={() => setIsOpenAddClient(true)}
                  >
                    <MaterialIcon iconName="add" />
                    Add clients{" "}
                  </Button>
                  <Button
                    variant={"blue"}
                    className="w-[128px]"
                    onClick={() => {}}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <ScrollArea className="h-[256px] w-full">
                <div className="flex flex-col w-full gap-1 pr-1">
                  {[...clients, ...possibleClientNames].map((client) => (
                    <button
                      key={client}
                      className={cn(
                        `flex items-center w-full py-3 px-3 gap-2 rounded-md cursor-pointer bg-white border-white border`,
                        choosedClients.includes(client) && "border-[#1D1D1F]"
                      )}
                      onClick={() => toggleClientSelection(client)}
                    >
                      <Checkbox
                        id={`client-${client}`}
                        checked={choosedClients.includes(client)}
                        onCheckedChange={() => toggleClientSelection(client)}
                        value={client}
                        className={cn(
                          "w-5 h-5 p-0.5 border-gray-300 rounded-full",
                          choosedClients.includes(client) && "border-gray-600"
                        )}
                        checkClassName="min-w-3 w-3 h-3 border-gray-300 rounded-full bg-gray-600 text-gray-600"
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
              <div className="flex flex-row justify-between mt-5">
                <Button
                  variant={"light-blue"}
                  className="w-[128px]"
                  onClick={() => {
                    setChoosedClients(clients);
                    setIsOpenAddClient(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={"blue"}
                  className="w-[128px]"
                  onClick={() => {
                    setClients(choosedClients);
                    setChoosedClients([]);
                    setIsOpenAddClient(false);
                  }}
                >
                  Add {choosedClients.length} clients
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
