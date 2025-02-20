
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GrSearchAdvanced } from "react-icons/gr";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/small/Button";
import { useDeleteChatMutation, useGetAISearchMutation, useGetSearchHistoryQuery, useGetSessionResultQuery, useUpdateChatTitleMutation } from "../../../redux/apis/apiSlice";
import { setNewChat, setRefetchHistory } from "../../../redux/slice/chatSlice";
import LibraryInput from "../../user/library/components/LibraryInput";
import QuestionAnswer from "./components/QuestionAnswer";

const MainChat = () => {
  const lastItemRef = useRef(null);
  // const lastItemRef = useRef(null);
  const fileInputRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getAISearch, { error: aiSearchError }] = useGetAISearchMutation();
  const [deleteChat, { isError }] = useDeleteChatMutation();


  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const { data: session, error } = useGetSessionResultQuery(selectedChatId, {
    skip: !selectedChatId,  // Skip API call if selectedChatId is null or undefined
  });
  const newChatPage = useSelector((state) => state.chat.newChat);
  const { data, error: historyError } = useGetSearchHistoryQuery()
  const filteredData = data?.history?.filter((item) => item.chat_id === selectedChatId) || [];
  const dispatch = useDispatch()
  const [chatId, setChatId] = useState()
  const [inputValue, setInputValue] = useState("");
  const [lastChat, setLatestChat] = useState()

  const sessionData = session?.search_results || []


  const newChat = () => {
    setChats([]);
    setText()
    dispatch(setNewChat(false))
  }
  useEffect(() => {
    if (newChatPage) {
      newChat()
      setChatId('')
      setIsLoading(false)
      setText("")
      toast.success("New Chat Started")
    }
  }, [newChatPage])

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
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };


  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleInputSubmit = async () => {
    const input = inputValue.trim() || inputValueRef.current.trim();
    if (!input.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }
    if (selectedFile && !["application/pdf", "image"].some(type => selectedFile.type.startsWith(type))) {
      toast.error("Invalid file type. Only PDFs and images are allowed.");
      return;
    }
    setIsLoading(true);
    let newEntry = {
      question: input,
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
          user_prompt: input,
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
          result_id: response?.data?.result_id || updatedChats[updatedChats.length - 1]?.result_id,
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
      setInputValue("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };
  const inputValueRef = useRef(inputValue);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);
  const [updateChatTitle, { isLoading: titleLoading }] = useUpdateChatTitleMutation();
  const handleUpdateChatTitle = async (chatId, newTitle) => {
    try {
      const response = await updateChatTitle({ chat_id: chatId, new_title: newTitle }).unwrap();
      const editChatTitle = chatId || selectedChatId;
      console.log("editChatTitle", editChatTitle)
      setChatId(editChatTitle)
      setInputValue(newTitle);
      inputValueRef.current = newTitle; // Also update ref
      toast.success(response.message)// // Call handleInputSubmit after updating title
      setInputValue(newTitle); // Ensure inputValue is set for handleInputSubmit
      setChats([])
      handleInputSubmit();
    } catch (err) {
      console.error("Error updating chat title:", err);
    }
  };

  // Run when session data is available
  useEffect(() => {
    if (session?.search_results?.length > 0) {
      setChats(session.search_results); // Set chats when session has data
    }
  }, [session]); // Depend on session


  return (
    <div className="flex gap-2 grow ">
      <div className="flex items-end w-full">
        <div className="text-center flex flex-col h-[90vh] gap-7 items-center w-full">
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
                      <QuestionAnswer handleUpdateChatTitle={handleUpdateChatTitle} key={i} chat={chat} lastItemRef={i === chats.length - 1 ? lastItemRef : null} />
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
                  Hi! How can I help you today?
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
