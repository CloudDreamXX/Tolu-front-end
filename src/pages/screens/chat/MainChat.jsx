/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const MainChat = () => {
  const scrollContainerRef = useRef(null);
  const lastItemRef = useRef(null);
  const [chats, setChats] = useState([]); // Mocked chats array
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (lastItemRef.current)
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chats, lastItemRef]);

  const startRecording = () => {
    setIsRecording(true);
    console.log("Recording started (mocked)");
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log("Recording stopped (mocked)");
  };

  const submitHandler = (inputText) => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    // Mocked chat handling
    setTimeout(() => {
      const newChat = {
        question: inputText,
        summary: "This is a mocked summary of the answer.",
        detailed_answer: "This is a mocked detailed answer to the question.",
        source: "Mocked Source",
        audio: null, // No audio for the mock
      };
      setChats([...chats, newChat]);
      setText("");
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading) {
      event.preventDefault();
      submitHandler(text);
    }
  };

  return (
    <div
      className={`flex gap-2 grow h-full p-0 sm:p-2 md:p-4 lg:p-6 mt-12 sm:mt-0`}
    >
      <div className="flex items-end w-full">
        <div className="text-center flex flex-col gap-7 items-center w-full h-full">
          <div
            className={`my-2 p-2 w-full flex-1 scroll-0 ${
              chats?.length > 0 ? "h-[400px]" : "h-0"
            } overflow-y-auto`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-[380px] object-cover overflow-y-hidden">
                loader
              </div>
            ) : (
              chats?.length > 0 && (
                <div className="flex flex-col">
                  {chats?.map((chat, i) => (
                    <div className="h-full" ref={scrollContainerRef} key={i}>
                      <QuestionAnswer
                        lastItemRef={
                          i === chats.length - 1 ? lastItemRef : null
                        }
                        i={i}
                        length={chats.length - 1}
                        chat={chat}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="w-full">
            {/* TextField Container */}
            <div className="text-secondaryGray w-full flex items-center justify-between p-4 h-[75px] border-[1px] rounded-lg shadow-chatsShadow my-3">
              <input
                value={text}
                onKeyDown={handleKeyDown}
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="Ask anything..."
                className="w-full border-none outline-none"
              />
              <div className="flex items-center gap-3">
                <button
                  className={`disabled:cursor-not-allowed disabled:opacity-20 ${
                    isRecording ? "recording" : ""
                  }`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  mic
                </button>
                <button
                  className="disabled:cursor-not-allowed disabled:opacity-20"
                  disabled={isLoading}
                  type="submit"
                  onClick={() => submitHandler(text)}
                >
                  send arrow
                </button>
              </div>
            </div>
            <div className="hidden flex-col justify-center lg:flex-row gap-2  lg:flex">
              <ChatFeature detail="Customized Intake From" />
              <ChatFeature detail="Customize Client Handout" />
              <ChatFeature detail="Create Client’s Timeline" />
              <ChatFeature detail="Map Client’s Symptoms" />
              <ChatFeature detail="Compare supplements" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;

const ChatFeature = ({ detail }) => {
  return (
    <button className="flex gap-1 items-center border-[1px] border-primaryLight py-2 px-3 rounded-md shadow-md shadow-[#008ff630]">
      <p className="text-xs text-secondaryGray text-start">{detail}</p>
    </button>
  );
};

const QuestionAnswer = ({ chat, i, length, lastItemRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <section
      ref={i === length ? lastItemRef : null}
      className="flex flex-col gap-6 h-full"
    >
      <div className="flex items-center gap-3">
        assisstantuser
        <p className="text-xs md:text-sm text-primaryDark p-2 md:px-4 md:py-3 text-start border-[1px] rounded-md w-full">
          {chat?.question}
        </p>
      </div>
      <div className="flex items-start justify-start gap-3 relative px-0 md:px-7">
        <div className="flex flex-col items-center">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer mt-10"
          >
            citedfileicon
            {isHovered && <HoverInfo data={chat?.source} />}
          </div>
        </div>
        <div className="p-2 md:p-4 text-xs md:text-sm leading-[20px] rounded-3xl text-primaryDark text-justify">
          <h4 className="text-base font-bold text-primaryDark mt-3">
            Summary:
          </h4>
          <p className="p-2 md:p-4 text-xs md:text-sm leading-[20px] rounded-3xl text-primaryDark text-justify">
            {chat?.summary}
          </p>
          <h4 className="text-base font-bold text-primaryDark">
            Detailed Answer:
          </h4>
          <p className="p-2 md:p-4 text-xs md:text-sm leading-[20px] rounded-3xl text-primaryDark text-justify">
            {chat?.detailed_answer}
          </p>
        </div>
      </div>
    </section>
  );
};

const HoverInfo = ({ data }) => {
  return (
    <div className="absolute min-w-max transform p-2 md:p-4 bg-primaryLight text-white border rounded-md shadow-lg z-50 text-justify">
      <h3 className="font-bold text-base">{data}</h3>
    </div>
  );
};
