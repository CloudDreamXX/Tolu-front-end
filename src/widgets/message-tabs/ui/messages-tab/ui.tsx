import { MessageBubble } from "widgets/message-bubble";
import { messages } from "./mock";
import Plus from "shared/assets/icons/plus";

import Smiley from "shared/assets/icons/smiley";
import { Button, ScrollArea, Textarea } from "shared/ui";

interface MessagesTabProps {
  chatId?: string;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ chatId }) => {
  return (
    <>
      <div className="h-[calc(100vh-400px)] pr-3 overflow-auto custom-message-scroll">
        <div className="flex flex-col justify-end min-h-full gap-2 pb-4 mt-auto ">
          {messages
            .map((msg) => <MessageBubble key={msg.id} {...msg} />)
            .reverse()}
        </div>
      </div>

      <div className="pt-2">
        <Textarea
          placeholder="Input message"
          className="resize-none"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Plus />
                <Smiley />
              </div>
              <Button variant="blue" className="w-[128px]">
                Send
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
};
