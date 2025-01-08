import { useEffect, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";

import MainChat from "./MainChat";
import ChatHistory from "./ChatHistory";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const startRecording = () => {
    console.log("Recording started");
    setIsRecording(true);
  };

  const stopRecording = () => {
    console.log("Recording stopped");
    setIsRecording(false);
  };

  const submitHandler = (textToSubmit) => {
    setIsLoading(true);
    console.log("Submitting text:", textToSubmit);
    setTimeout(() => {
      const fakeResponse = {
        question: textToSubmit,
        summary: "This is a fake response for the submitted query.",
        detailed_answer: "Here is a more detailed answer for the query.",
        chart_data: null,
      };
      setChats((prevChats) => [...prevChats, fakeResponse]);
      setText("");
      setIsLoading(false);
    }, 1000);
  };

  const newChatHandler = () => {
    if (chats.length > 0) {
      setChats([]);
      setChartData([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading) {
      event.preventDefault();
      submitHandler(text);
    }
  };

  useEffect(() => {
    setChats([]);
    setChartData([]);
  }, []);

  return (
    <div className="w-full flex h-[calc(100vh-54px)] md:h-[calc(100vh-88px)] relative p-2 sm:p-4 xl:p-0">
      <div
        className={`shadow-chatAsideShadow bg-white xl:basis-[20%] xl:static absolute z-[99] top-0 h-screen transform xl:transform-none transition-all duration-500 border ${
          isChatHistoryOpen ? "translate-x-0 w-[280px]" : "-translate-x-[19rem]"
        }`}
      >
        <div className="absolute top-3 right-0 text-primary">
          <button
            className="block xl:hidden"
            onClick={() => setIsChatHistoryOpen(false)}
          >
            <IoIosArrowDropleftCircle fontSize={24} />
          </button>
        </div>
        <ChatHistory
          newChatHandler={newChatHandler}
          chatHistory={[]}
          historyClickHandler={() => {}}
        />
      </div>
      <div className="basis-[60%] flex items-start justify-between grow lg:px-40 mx-auto">
        <div
          className="cursor-pointer absolute sm:static top-2 left-2 block xl:hidden "
          onClick={() => {
            setIsChatHistoryOpen(true);
          }}
        >
          left
        </div>
        <MainChat
          chats={chats}
          isLoading={isLoading}
          isRecording={isRecording}
          setText={setText}
          startRecording={startRecording}
          stopRecording={stopRecording}
          submitHandler={submitHandler}
          text={text}
          handleKeyDown={handleKeyDown}
          isChatHistoryLoading={false}
        />
      </div>
    </div>
  );
};

export default Chat;
