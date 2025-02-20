import { useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setNewChat } from "../../../redux/slice/chatSlice";

const ChatHistory = ({ chatHistory, isAsideOpen, isLoading, chatIdHandler }) => {
  const dispatch = useDispatch();
  const [showHistory, setShowHistory] = useState(true);
  const newChatHandler = () => {
    dispatch(setNewChat(true));
  };
  useEffect(() => {
    setShowHistory(false)
  }, [isAsideOpen])

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const categorizeChats = (chats = []) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000);
    const lastWeek = new Date(today - 7 * 86400000);

    return {
      todayChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= today) : [],
      yesterdayChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= yesterday && new Date(chat.created_at) < today) : [],
      last7DaysChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= lastWeek && new Date(chat.created_at) < yesterday) : [],
      earlierChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) < lastWeek) : [],
    };
  };

  const categorizedChats = categorizeChats(chatHistory?.history || []);

  return (
    <div className="space-y-2 text-nowrap overflow-hidden">
      {/* New Search Button */}
      <button
        onClick={newChatHandler}
        className="bg-primary w-full text-start py-3 px-4 rounded-lg text-white text-sm font-[500] flex items-center gap-2"
      >
        <BiSolidEdit fontSize={20} /> New Search
      </button>

      {/* Search History Section */}
      <section
        className="p-2 flex items-center hover:bg-primary rounded-lg justify-between font-medium cursor-pointer"
        onClick={toggleHistory}
      >
        <section className="flex pl-4 items-center gap-4">
          <MdHistory /> Search history
        </section>
        <section>{showHistory ? <IoIosArrowUp /> : <IoIosArrowDown />}</section>
      </section>

      {/* Show history only if toggled */}
      <section className="h-screen custom-scroll overflow-auto">
        {showHistory && (
          <div className="space-y-2 mt-2">
            {Object.entries(categorizedChats).map(([key, chats]) => (
              <div key={key} className=" p-2 rounded-lg">
                <h3 className="text-gray-600 font-medium">
                  {key === "todayChats"
                    ? "Today"
                    : key === "yesterdayChats"
                      ? "Yesterday"
                      : key === "last7DaysChats"
                        ? "Last 7 Days"
                        : "Earlier"}
                </h3>

                {isLoading ? (
                  <p className="px-4 py-2 text-gray-500 text-xs italic">Loading...</p>
                ) : chats.length > 0 ? (
                  chats.map((chat) => (
                    <p
                      key={chat.chat_id}
                      onClick={() => chatIdHandler(chat.chat_id)}
                      className="px-4 py-2 bg-transparent mt-2 text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                     hover:bg-[#17171718] cursor-pointer"
                    >
                      {chat.query}
                    </p>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500 text-xs italic">No history available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatHistory;
