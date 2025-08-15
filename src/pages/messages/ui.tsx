import { useNavigate, useParams } from "react-router-dom";
import { MessageTabs } from "widgets/message-tabs/ui";

export const ClientMessages = () => {
  const { chatId: routeChatId } = useParams();
  const nav = useNavigate();

  return (
    <MessageTabs
      chatId={routeChatId}
      goBackMobile={() => {
        nav("library");
      }}
    />
  );
};
