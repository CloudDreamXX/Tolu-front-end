import { useGetAllChatNotesQuery } from "entities/chat";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toUserTZ } from "widgets/message-tabs/helpers";
import { FileBadge } from "widgets/notes-item/ui";

type Props = {
  chatId: string | null;
  onClose: () => void;
};

export const ChatNotesModal: React.FC<Props> = ({ chatId, onClose }) => {
  const { data, isLoading, isError } = useGetAllChatNotesQuery(chatId!, {
    skip: !chatId,
  });

  let content;

  if (!chatId) {
    content = (
      <p className="text-sm text-[#5F5F65]">
        This client does not have any notes yet.
      </p>
    );
  } else if (isLoading) {
    content = <p className="text-sm text-[#5F5F65]">Loading notes…</p>;
  } else if (isError) {
    content = (
      <p className="text-sm text-red-600">
        Failed to load notes. Please try again.
      </p>
    );
  } else if (!data || data.data?.length === 0) {
    content = (
      <p className="text-sm text-[#5F5F65]">
        This client does not have any notes yet.
      </p>
    );
  } else {
    content = data.data?.map((item) => (
      <div className="flex justify-between gap-3 p-3 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="w-full">
          {item.title && (
            <h4 className="mb-1 text-sm font-semibold text-gray-900 truncate">
              {item.title}
            </h4>
          )}
          {item.content && (
            <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
              {item.content}
            </p>
          )}
          {!!item.file_info?.file_url && (
            <div className="mt-2">
              <FileBadge fi={item.file_info} />
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            • Created: {toUserTZ(item.created_at).toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            • Updated: {toUserTZ(item.updated_at).toLocaleString()}
          </p>
        </div>
      </div>
    ));
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]">
      <div className="bg-white mx-[16px] rounded-[18px] p-[24px] w-full max-w-[800px] max-h-[90vh] flex flex-col relative">
        <span
          className="absolute top-[16px] right-[16px] cursor-pointer"
          onClick={onClose}
        >
          <MaterialIcon iconName="close" />
        </span>

        <h2 className="text-[20px] font-[700] mb-[16px]">Notes</h2>

        <main className="overflow-y-auto grow flex flex-col gap-[16px]">
          {content}
        </main>
      </div>
    </div>
  );
};
