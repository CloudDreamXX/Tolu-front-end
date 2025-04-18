import { PopoverClient } from "widgets/content-popovers";

interface DocumentClientInfoProps {
  client?: string[];
}

export const DocumentClientInfo: React.FC<DocumentClientInfoProps> = ({
  client,
}) => {
  return (
    <PopoverClient
      customTrigger={
        <button className="flex flex-row items-end group">
          <h4 className="text-lg font-semibold">
            Clients: {client?.length ?? "N/A"}
          </h4>
          <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
            / Edit
          </div>
        </button>
      }
    />
  );
};
