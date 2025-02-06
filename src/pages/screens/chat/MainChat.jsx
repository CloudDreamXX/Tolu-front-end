import { useEffect, useRef, useState } from "react";
import LibraryInput from "../../user/library/components/LibraryInput";
import Button from "../../../components/small/Button";
import { GrSearchAdvanced, GrRefresh, GrGallery } from "react-icons/gr";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { RiAccountCircleFill } from "react-icons/ri";
import { BsCopy } from "react-icons/bs";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { CiVolumeHigh } from "react-icons/ci";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdVideoLibrary } from "react-icons/md";

const MainChat = () => {
  const lastItemRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const handleSubmitValue = (inputText) => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      setChats((prevChats) => [
        ...prevChats,
        {
          question: inputText,
          summary: "This is a mocked summary of the answer.",
          detailed_answer: "This is a mocked detailed answer to the question. ",
          source: "Mocked Source",
          audio: null,
        },
      ]);
      setText("");
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading) {
      event.preventDefault();
      handleSubmitValue(text);
    }
  };

  const handleInputChange = (value) => {
    setText(value);
  };

  return (
    <div className="flex gap-2 grow p-0 sm:p-2 md:p-4 lg:p-6 mt-12 sm:mt-0">
      <div className="flex items-end w-full">
        <div className="text-center flex flex-col h-[75vh] gap-7 items-center w-full">
          <div className={`my-2 p-2 w-full flex-1 overflow-y-auto ${chats.length ? "h-[400px]" : "h-0"}`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-[380px]">Loading...</div>
            ) : (
              chats.length > 0 && (
                <>
                  <section className="flex gap-8 ">
                    <h2 className="font-bold text-4xl">Chat</h2>
                    <Button text="New Search" className="text-xs font-normal !h-9">
                      <GrSearchAdvanced />
                    </Button>
                    <Button text="Deleted Search" className="border text-xs font-normal !h-9">
                      <HiOutlineChatBubbleOvalLeftEllipsis />
                    </Button>
                  </section>

                  <div className="flex flex-col">
                    {chats.map((chat, i) => (
                      <QuestionAnswer key={i} chat={chat} lastItemRef={i === chats.length - 1 ? lastItemRef : null} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
          {!chats.length && (

            <section>
              <div className="lg:col-span-12 flex justify-center">
                <h5 className="text-xl md:text-[32px] text-primary font-extrabold ">
                  Hi Coach! How can i help you today?
                </h5>
              </div>
            </section>
          )}
          <div className="w-full">
            <LibraryInput
              placeholder="Enter Prompt..."
              onChangeValue={handleInputChange}
              onSubmitValue={handleSubmitValue}
              isLoading={isLoading}
            />
            {!chats.length && (
              <div className="hidden flex-col justify-center lg:flex-row gap-2 mt-8 lg:flex">
                {["Customized Intake Form", "Customize Client Handout", "Create Client’s Timeline", "Map Client’s Symptoms", "Compare Supplements"].map((detail) => (
                  <ChatFeature key={detail} detail={detail} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatFeature = ({ detail }) => (
  <button className="flex gap-1 items-center border-[1px] border-primaryLight py-2 px-3 rounded-md shadow-md shadow-[#008ff630]">
    <p className="text-xs text-secondaryGray text-start">{detail}</p>
  </button>
);
const QuestionAnswer = ({ chat, lastItemRef }) => (
  <section ref={lastItemRef} className="flex flex-col mt-6 gap-6 h-full">
    <section className="flex w-full  items-center space-x-6">
      <section className="w-full pl-14  space-y-6">
        <div className="w-full flex items-center gap-6">
          <RiAccountCircleFill className="text-5xl" />
          <div className="shadow-md rounded-lg h-16 w-full text-start p-4">{chat.question}</div>
        </div>

        <div className="flex w-full relative gap-5 items-center group">
          {/* Left side icons, hidden by default and shown on hover */}
          <div className="text-2xl absolute flex flex-col gap-2 text-primary  left-[-30px]  items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[BsCopy, FaRegShareFromSquare, CiVolumeHigh, AiOutlineLike, AiOutlineDislike, GrRefresh].map((Icon, index) => (
              <IconWrapper key={index}>
                <Icon fontSize={12} />
              </IconWrapper>
            ))}
          </div>

          {/* Answer Section */}
          <div className=" shadow-md text-start p-4 rounded-lg border-primary w-full">
            {chat.detailed_answer}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 text-2xl text-primary">
        <GrGallery />
        <MdVideoLibrary />
      </div>
    </section>
  </section>
);

const IconWrapper = ({ children }) => (
  <div className="w-[20px] bg-gray-200 h-[20px] shadow-xl rounded-xl flex items-center justify-center">
    {children}
  </div>
);

export default MainChat;
