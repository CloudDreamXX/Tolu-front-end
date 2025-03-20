import DocActions from "../../../shared/ui/DocActions";

function Document() {
  return (
    <div className="w-full flex flex-row-reverse gap-6 h-full">
      <DocActions />
      <div className="w-full flex flex-col gap-2">
        <div className="bg-white w-full p-6 h-full">
          text
        </div>
      </div>
    </div>
  );
}

export default Document;
