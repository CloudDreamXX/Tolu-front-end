import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

interface ChatActionsProps {
  setStatusPopup: React.Dispatch<
    React.SetStateAction<"unpublish" | "approve" | "reject" | null>
  >;
  status: string;
}

export const ChatActionsAdmin: React.FC<ChatActionsProps> = ({
  setStatusPopup,
  status,
}) => {
  const nav = useNavigate();

  return (
    <div className="flex flex-row gap-2 xl:flex-col w-full xl:w-[32px] h-[32px] xl:h-full">
      <div className="flex flex-row gap-2 xl:hidden">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="w-8 h-8"
          onClick={() => nav(-1)}
        >
          <MaterialIcon
            iconName="arrow_back"
            className="w-4 h-4 m-auto text-black"
          />
        </Button>
        {status === "Live" && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setStatusPopup("unpublish")}
          >
            <MaterialIcon
              iconName="visibility"
              className="text-blue-600"
              fill={1}
            />
          </Button>
        )}
        {(status === "Live" || status === "Waiting") && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setStatusPopup("approve")}
          >
            <MaterialIcon
              iconName="check"
              size={24}
              className="text-[#2DC38F]"
            />
          </Button>
        )}
        {(status === "Live" || status === "Waiting") && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex justify-center items-center"
            onClick={() => setStatusPopup("reject")}
          >
            <MaterialIcon
              iconName="block"
              size={24}
              className="text-[#660000]"
            />
          </Button>
        )}
      </div>
      <div className="flex-col self-start hidden gap-4 xl:flex fixed top-[110px]">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="w-8 h-8"
          onClick={() => nav(-1)}
        >
          <MaterialIcon
            iconName="arrow_back"
            className="w-5 h-5 m-auto text-black"
          />
        </Button>
        {status === "Live" && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex items-center justify-center"
            onClick={() => setStatusPopup("unpublish")}
          >
            <MaterialIcon
              iconName="visibility"
              className="text-blue-600"
              fill={1}
            />
          </Button>
        )}
        {(status === "Live" || status === "Waiting") && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex justify-center items-center"
            onClick={() => setStatusPopup("approve")}
          >
            <MaterialIcon
              iconName="check"
              size={24}
              className="text-[#2DC38F]"
            />
          </Button>
        )}
        {(status === "Live" || status === "Waiting") && (
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="rounded-full h-8 w-8 flex justify-center items-center"
            onClick={() => setStatusPopup("reject")}
          >
            <MaterialIcon
              iconName="block"
              size={24}
              className="text-[#660000]"
            />
          </Button>
        )}
      </div>
    </div>
  );
};
