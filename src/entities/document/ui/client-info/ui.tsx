import { NavLink } from "react-router-dom";

interface DocumentClientInfoProps {
  client?: string[];
}

export const DocumentClientInfo: React.FC<DocumentClientInfoProps> = ({
  client,
}) => {
  return (
    <NavLink className="flex flex-row items-end group" to={`/content-manager`}>
      <h4 className="text-lg font-semibold">
        Clients: {client?.length ?? "N/A"}
      </h4>
      <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
        / Edit
      </div>
    </NavLink>
  );
};
