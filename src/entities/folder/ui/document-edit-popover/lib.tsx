import Expert from "shared/assets/icons/expert";
import Eye from "shared/assets/icons/eye";
import Edit from "shared/assets/icons/edit";
import { Archive, ArrowRight, Trash2 } from "lucide-react";
import Duplicate from "shared/assets/icons/duplicate";
import Box from "shared/assets/icons/box";
import { Button } from "shared/ui";

export const renderContent = (tab: string) => {
  switch (tab) {
    case "ai-generated":
      return <AiGenerated />;
    case "in-review":
      return "In review";
    case "approved":
      return "Approved";
    case "published":
      return <Published />;
    case "archived":
      return "Archived";
    default:
      return <Published />;
  }
};

const AiGenerated = () => {
  return (
    <>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Edit /> Edit
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <ArrowRight /> Move
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Duplicate /> Duplicate
      </Button>{" "}
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Eye /> Mark as ready for review
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Expert className="h-6 min-w-6" /> Mark as approved
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Box /> Mark as ready to publish
      </Button>{" "}
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Archive /> Archive
      </Button>{" "}
      <Button
        variant={"ghost"}
        className="justify-start h-6 p-0 font-medium text-destructive"
      >
        <Trash2 /> Delete
      </Button>
    </>
  );
};

const Published = () => {
  return (
    <>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <ArrowRight /> Move
      </Button>
      <Button variant={"ghost"} className="justify-start h-6 p-0 font-medium">
        <Archive /> Archive
      </Button>{" "}
    </>
  );
};
