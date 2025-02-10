
import { useEffect, useRef, useState } from "react";
import LibraryInput from "../../user/library/components/LibraryInput";
import Button from "../../../components/small/Button";
import { GrSearchAdvanced } from "react-icons/gr";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { useGetAISearchMutation, useGetSearchHistoryQuery } from "../../../redux/apis/apiSlice";
import toast from "react-hot-toast";
import QuestionAnswer from "./components/QuestionAnswer";
import { useDispatch, useSelector } from "react-redux";
import { setNewChat } from "../../../redux/slice/chatSlice";

const MainChat = () => {
  const lastItemRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getAISearch] = useGetAISearchMutation();
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const newChatPage = useSelector((state) => state.chat.newChat);
  const { data } = useGetSearchHistoryQuery()
  const filteredData = data?.history?.filter((item) => item.chat_id === selectedChatId) || [];
  const dispatch = useDispatch()

  useEffect(() => {
    setChats(filteredData)
  }, [selectedChatId])
  
  const newChat = () => {
    setChats([]);
    setText()
    setSelectedFile()
    dispatch(setNewChat(false))
  }
  
  useEffect(() => {
    if (newChatPage) {
      newChat()
      setIsLoading(false)
      setText("")
      setSelectedFile(null)
      toast.success("New Chat Started")
    }
  }, [newChatPage])


  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chats]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File Uploaded: ${file.name}`);
    }
  };

  const handleSubmitValue = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    if (selectedFile && !["application/pdf", "image"].some(type => selectedFile.type.startsWith(type))) {
      toast.error("Invalid file type. Only PDFs and images are allowed.");
      return;
    }

    const newChat = { question: text, detailed_answer: "", summary: "Streaming...", source: "Streaming...", audio: null };
    setChats((prevChats) => [...prevChats, newChat]);
    setIsLoading(true);

    try {
      await getAISearch({
        chat_message: { user_prompt: text, is_new: true, regenerate_id: null, instructions: "Write random responses." },
        file: selectedFile || null,
        onMessage: (streamingText) => {
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            updatedChats[updatedChats.length - 1].detailed_answer = streamingText;
            return updatedChats;
          });
        },
      });
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Failed to fetch response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 grow p-0 sm:p-2 md:p-4 lg:p-6 mt-12 sm:mt-0">
      <div className="flex items-end w-full">
        <div className="text-center flex flex-col h-[75vh] gap-7 items-center w-full">
          <div className={`my-2 p-2 w-full flex-1 overflow-y-auto ${chats.length ? "h-[400px]" : "h-0"}`}>
            {
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
            }
          </div>
          {!chats.length && (
            <section>
              <div className="lg:col-span-12 flex justify-center">
                <h5 className="text-xl md:text-[32px] text-primary font-extrabold ">
                  Hi Coach! How can I help you today?
                </h5>
              </div>
            </section>
          )}
          <div className="w-full">
            <LibraryInput
              placeholder="Enter Prompt..."
              onChangeValue={setText}
              onSubmitValue={handleSubmitValue}
              onFileUpload={handleFileChange}
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

export default MainChat;
