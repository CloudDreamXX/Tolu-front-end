
import { useEffect, useRef, useState } from "react";
import LibraryInput from "../../user/library/components/LibraryInput";
import Button from "../../../components/small/Button";
import { GrSearchAdvanced } from "react-icons/gr";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { useDeleteChatMutation, useGetAISearchMutation, useGetSearchHistoryQuery } from "../../../redux/apis/apiSlice";
import toast from "react-hot-toast";
import QuestionAnswer from "./components/QuestionAnswer";
import { useDispatch, useSelector } from "react-redux";
import { setNewChat, setRefetchHistory } from "../../../redux/slice/chatSlice";

const MainChat = () => {
  const lastItemRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getAISearch, { error: aiSearchError }] = useGetAISearchMutation();
  const [deleteChat, { isError }] = useDeleteChatMutation();

  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const newChatPage = useSelector((state) => state.chat.newChat);
  const { data, error: historyError } = useGetSearchHistoryQuery()
  const filteredData = data?.history?.filter((item) => item.chat_id === selectedChatId) || [];
  const dispatch = useDispatch()
  const [chatId, setChatId] = useState()
  const [inputValue, setInputValue] = useState("");
  const [lastChat, setLatestChat] = useState()

  
  
  const newChat = () => {
    setChats([]);
    setText()
    // setSelectedFile()
    dispatch(setNewChat(false))
  }
  // console.log("New chat", newChatPage)
  useEffect(() => {
    if (newChatPage) {
      newChat()
      setChatId('')
      setIsLoading(false)
      setText("")
      // setSelectedFile(null)
      toast.success("New Chat Started")
    }
  }, [newChatPage])
  
  useEffect(() => {
    setChats(filteredData)
  }, [selectedChatId])

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chats]);

  const handleDelete = async () => {
    const chatToDelete = chatId?.chat_id || selectedChatId;

    if (!chatToDelete) {
      console.error("Chat ID is required to delete a chat.");
      return;
    }
    try {
      const responses = await deleteChat(chatToDelete).unwrap();
      console.log("responses", responses)
      toast.success(responses?.message)
      dispatch(setRefetchHistory(true));
      dispatch(setNewChat(true));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat. Please try again later.", error);
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    console.log("Input Value:", value);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); 
    fileInputRef.current.value = ""; 
  };

 
  const handleFileUpload = (file) => {
    setSelectedFile(file);
    console.log("Selected File:", file);
  };




  const handleInputSubmit = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }
    if (selectedFile && !["application/pdf", "image"].some(type => selectedFile.type.startsWith(type))) {
      toast.error("Invalid file type. Only PDFs and images are allowed.");
      return;
    }
    setIsLoading(true);
    let newEntry = {
      question: inputValue,
      detailed_answer: "",
      summary: "Streaming...",
      source: "Streaming...",
      audio: null,
      result_id: "",
      chat_id: chatId?.chat_id || "", // Maintain chat ID if available
      attachedFile: selectedFile
    };
    // Add the new chat entry to the state
    setChats((prevChats) => [...prevChats, newEntry]);
    try {
      const response = await getAISearch({
        chat_message: {
          user_prompt: inputValue,
          is_new: !chatId, // If there's no chat ID, it's a new chat
          chat_id: chatId?.chat_id || "", // Use existing chat ID if available
          regenerate_id: "",
        },
        file: selectedFile || null,
        onMessage: (streamingText) => {
          // Update the last chat entry with streaming data
          setChats((prevChats) => {
            const updatedChats = [...prevChats];
            updatedChats[updatedChats.length - 1].detailed_answer = streamingText;
            return updatedChats;
          });
        },
      });

      if (response?.data?.chat_id) {
        setChatId(response.data);
        setLatestChat({
          chat_id: response.data.chat_id,
          query: text,
          chat_title: text
        });
      }

      // Update the chat entry with result_id and chat_id if available
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChats.length - 1] = {
          ...updatedChats[updatedChats.length - 1],
          result_id: response.data.result_id || updatedChats[updatedChats.length - 1].result_id,
          chat_id: response.data.chat_id || updatedChats[updatedChats.length - 1].chat_id,
        };
        return updatedChats;
      });

      dispatch(setRefetchHistory(true));
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Failed to fetch response.");
    } finally {
      setIsLoading(false);
      setText("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
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
                    <Button
                      onClick={handleDelete}
                      text="Deleted Search" className="border text-xs font-normal !h-9">
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
              placeholder="Enter text or upload a file"
              onChangeValue={handleInputChange}
              onSubmitValue={handleInputSubmit}
              onFileUpload={handleFileUpload}
              handleRemoveFile={handleRemoveFile}
              setSelectedFile={setSelectedFile}
              selectedFile={selectedFile}
              isLoading={isLoading} // Can be set to `true` when processing
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
