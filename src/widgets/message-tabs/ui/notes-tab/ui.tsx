import Plus from "shared/assets/icons/plus";
import { MessageBubble } from "widgets/message-bubble";
import { notes } from "./mock";

import { Send } from "lucide-react";
import Smiley from "shared/assets/icons/smiley";
import { usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";

interface NotesTabProps {
  chatId?: string;
}

export const NotesTab: React.FC<NotesTabProps> = () => {
  const { isMobileOrTablet } = usePageWidth();

  return (
    <>
      <div className="pr-3 overflow-auto custom-message-scroll h-[calc(100vh-360px)] md:h-[calc(100vh-388px)] lg:h-[calc(100vh-372px)] ">
        <div className="flex flex-col justify-end min-h-full gap-2 pb-4 mt-auto ">
          {notes.map((nt) => <MessageBubble {...nt} />).reverse()}
        </div>
      </div>

      <div className="pt-2">
        <Textarea
          placeholder="Input message"
          className="resize-none min-h-[60px]"
          containerClassName="px-4 py-3"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Plus />
                <Smiley />
              </div>
              <Button
                variant={isMobileOrTablet ? "brightblue" : "blue"}
                className="rounded-full flex justify-center items-center
             w-[42px] h-[42px] lg:w-[128px] lg:rounded-none"
              >
                {isMobileOrTablet ? <Send width={23} height={23} /> : "Send"}
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
};
