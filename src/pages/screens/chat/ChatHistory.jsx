import { useState } from "react";
import { useDispatch } from "react-redux";
import { BiSolidEdit } from "react-icons/bi";
import { MdHistory } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { setNewChat } from "../../../redux/slice/chatSlice";
import { dummyChatHistory } from "../../../assets/data";

const ChatHistory = ({ chatHistory, historyClickHandler }) => {
  const dispatch = useDispatch();
  const [showHistory, setShowHistory] = useState(false);

  const newChatHandler = () => {
    dispatch(setNewChat(true)); // Set newChat to true in Redux
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const categorizeChats = (chats) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000);
    const lastWeek = new Date(today - 7 * 86400000);

    return {
      todayChats: chats.filter(chat => new Date(chat.timestamp) >= today),
      yesterdayChats: chats.filter(chat => new Date(chat.timestamp) >= yesterday && new Date(chat.timestamp) < today),
      last7DaysChats: chats.filter(chat => new Date(chat.timestamp) >= lastWeek && new Date(chat.timestamp) < yesterday),
      earlierChats: chats.filter(chat => new Date(chat.timestamp) < lastWeek),
    };
  };

  const categorizedChats = categorizeChats(dummyChatHistory);

  return (
    <div className="space-y-2">
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
      {showHistory && (
        <div className="space-y-2 mt-2">
          {/* Today */}
          {categorizedChats.todayChats.length > 0 && (
            <>
              <h3 className="text-gray-600 font-medium">Today</h3>
              {categorizedChats.todayChats.map(chat => (
                <p
                  key={chat.thread_id}
                  onClick={() => historyClickHandler(chat.thread_id)}
                  className="px-4 py-2 bg-[#769CAA1A] text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                     hover:bg-[#769caa18] cursor-pointer"
                >
                  {chat.title}
                </p>
              ))}
            </>
          )}

          {/* Yesterday */}
          {categorizedChats.yesterdayChats.length > 0 && (
            <>
              <h3 className="text-gray-600 font-medium">Yesterday</h3>
              {categorizedChats.yesterdayChats.map(chat => (
                <p
                  key={chat.thread_id}
                  onClick={() => historyClickHandler(chat.thread_id)}
                  className="px-4 py-2 bg-[#769CAA1A] text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                     hover:bg-[#769caa18] cursor-pointer"
                >
                  {chat.title}
                </p>
              ))}
            </>
          )}

          {/* Last 7 Days */}
          {categorizedChats.last7DaysChats.length > 0 && (
            <>
              <h3 className="text-gray-600 font-medium">Last 7 Days</h3>
              {categorizedChats.last7DaysChats.map(chat => (
                <p
                  key={chat.thread_id}
                  onClick={() => historyClickHandler(chat.thread_id)}
                  className="px-4 py-2 bg-[#769CAA1A] text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                     hover:bg-[#769caa18] cursor-pointer"
                >
                  {chat.title}
                </p>
              ))}
            </>
          )}

          {/* Earlier */}
          {categorizedChats.earlierChats.length > 0 && (
            <>
              <h3 className="text-gray-600 font-medium">Earlier</h3>
              {categorizedChats.earlierChats.map(chat => (
                <p
                  key={chat.thread_id}
                  onClick={() => historyClickHandler(chat.thread_id)}
                  className="px-4 py-2 bg-[#769CAA1A] text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                     hover:bg-[#769caa18] cursor-pointer"
                >
                  {chat.title}
                </p>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
