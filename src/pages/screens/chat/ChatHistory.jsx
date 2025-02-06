import { BiSolidEdit } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";

import logo from "../../../assets/images/black-logo.png";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";


/* eslint-disable react/prop-types */
const ChatHistory = ({ chatHistory, historyClickHandler, newChatHandler }) => {
  console.log("ChatHistory", chatHistory)
  return (
    <div className="space-y-2 ">
      <button
        onClick={newChatHandler}
        className="bg-primary w-full text-start py-3 px-4 rounded-[10px] text-white text-sm font-[500] flex items-center gap-2"
      >
        <BiSolidEdit fontSize={20} /> New Search
      </button>


      <section className="pt-4 flex items-center justify-between font-medium">
        <section className="flex pl-4 items-center gap-4"><MdHistory />Search history</section>
        {/* <section> </section> */}
        <section><IoIosArrowDown /></section>
      </section>
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
  );
};

export default ChatHistory;
