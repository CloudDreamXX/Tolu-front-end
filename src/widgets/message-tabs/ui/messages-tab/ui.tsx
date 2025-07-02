import Plus from "shared/assets/icons/plus";
import { MessageBubble } from "widgets/message-bubble";
import { messages } from "./mock";

import { Send } from "lucide-react";
import MessagesIcon from "shared/assets/icons/messages-2";
import Smiley from "shared/assets/icons/smiley";
import { usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";

interface MessagesTabProps {
  chatId?: string;
}

export const MessagesTab: React.FC<MessagesTabProps> = () => {
  const { isMobileOrTablet } = usePageWidth();

  return (
    <>
      <div className="pr-3 overflow-auto custom-message-scroll h-[calc(100vh-360px)] md:h-[calc(100vh-388px)] lg:h-[calc(100vh-372px)] ">
        {messages.length > 0 ? (
          <div className="flex flex-col justify-end min-h-full gap-2 pb-4 mt-auto">
            {messages
              .map((msg) => <MessageBubble key={msg.id} {...msg} />)
              .reverse()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessagesIcon
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[128px] lg:h-[128px] border-blue-500"
              stroke="green"
            />
            <p className="text-[#1D1D1F] font-bold text-[18px] md:text-[24px] lg:text-[32px]">
              There are no messages...
            </p>
          </div>
        )}
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
             w-[42px] h-[42px] lg:w-[128px]"
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
