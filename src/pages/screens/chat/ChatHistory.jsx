import { BiSolidEdit } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";

import logo from "../../../assets/images/black-logo.png";
import { IoIosArrowDropleftCircle } from "react-icons/io";

/* eslint-disable react/prop-types */
const ChatHistory = ({ chatHistory, historyClickHandler, newChatHandler }) => {
  return (
    <div className="flex flex-col justify-between gap-2 p-4 h-screen relative">
      <button className="text-primary absolute -right-3">
        <IoIosArrowDropleftCircle fontSize={26} />
      </button>
      <div className="space-y-2 ">
        <img src={logo} className="w-[80px] mt-5  mb-10 mx-auto" />

        <button
          onClick={newChatHandler}
          className="bg-primary w-full text-start py-3 px-4 rounded-[10px] text-white text-sm font-[500] flex items-center gap-2"
        >
          <BiSolidEdit fontSize={20} /> New Search
        </button>
        <p className="text-sm md:text-base font-bold text-primaryDark">
          History
        </p>
        {chatHistory?.length &&
          chatHistory?.map((history, i) => (
            <p
              key={i}
              onClick={() => historyClickHandler(history?.thread_id)}
              className={`px-4 py-2 bg-[#769CAA1A] text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
           hover:bg-[#769caa18] cursor-pointer`}
            >
              {history?.title}
            </p>
          ))}
      </div>
      <button className="text-primary bg-white rounded-[10px] justify-center font-bold shadow-lg border py-3 px-4 flex items-center gap-2 mb-2">
        <TbLogout2 fontSize={20} /> Log Out
      </button>
    </div>
  );
};

export default ChatHistory;
