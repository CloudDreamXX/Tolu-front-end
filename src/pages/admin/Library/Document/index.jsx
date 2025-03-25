import DocActions from "../../../../shared/ui/DocActions";
import { mock } from "./mock";
import AIInput from '../../../../shared/ui/AIInput';

function Document() {
  return (
    <div className="w-full flex flex-col sm:flex-row-reverse gap-6 h-full">
      <DocActions />
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-6 bg-white p-6 h-full max-h-[80vh] overflow-y-auto rounded-2xl">
          <h1 className="text-h1">Understanding menopause symptoms</h1>
          <div className="" dangerouslySetInnerHTML={{ __html: mock }} />
        </div>
        <AIInput
          placeholder="Ask anything..."
          type="admin-doc-opened"
        />
      </div>
    </div>
  );
}

export default Document;