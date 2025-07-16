import Plus from "shared/assets/icons/plus";
import { MessageBubble } from "widgets/message-bubble";
// import { messages } from "./mock";

import { Send } from "lucide-react";
import EmptyChat from "shared/assets/images/EmptyChat.png";
import Smiley from "shared/assets/icons/smiley";
import { usePageWidth } from "shared/lib";
import { Button, Textarea } from "shared/ui";
import { ChatItemModel } from "pages/content-manager";

interface MessagesTabProps {
  chat?: ChatItemModel;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ chat }) => {
  const { isMobileOrTablet } = usePageWidth();
  const messages: any[] = [];

  return (
    <>
      <div className="pr-3 overflow-auto custom-message-scroll h-[calc(100vh-360px)] md:h-[calc(100vh-388px)] lg:h-[calc(100vh-372px)] ">
        {messages.length > 0 ? (
          <div className="flex flex-col justify-end min-h-full gap-2 pb-4 mt-auto">
            {messages &&
              messages
                .map((msg) => <MessageBubble key={msg.id} {...msg} />)
                .reverse()}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center mt-[200px]">
            <img src={EmptyChat} alt="" className="mb-[16px] w-[163px]" />
            <p className="text-[32px] font-[700] text-[#1D1D1F]">
              There are no messages ...
            </p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Textarea
          placeholder={`Message ${chat?.name}`}
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
