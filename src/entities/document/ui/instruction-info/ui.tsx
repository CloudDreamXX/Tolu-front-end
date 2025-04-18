import { NavLink } from "react-router-dom";

interface DocumentInstructionInfoProps {
  instructions?: string[];
}

export const DocumentInstructionInfo: React.FC<
  DocumentInstructionInfoProps
> = ({ instructions }) => {
  return (
    <NavLink className="flex flex-row items-end group" to={`/content-manager`}>
      <h4 className="text-lg font-semibold">
        Instructions: {instructions?.length ? "Yes" : "No"}
      </h4>
      <div className="mb-1 ml-1 text-xs font-semibold group-hover:text-[#008FF6]">
        / View
      </div>
    </NavLink>
  );
};
