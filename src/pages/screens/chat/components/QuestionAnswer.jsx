import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { BsCopy } from "react-icons/bs";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { FaRegShareFromSquare, FaVolumeHigh } from "react-icons/fa6";
import { GrGallery, GrRefresh } from "react-icons/gr";
import { IoVolumeMute } from "react-icons/io5";
import { MdVideoLibrary } from "react-icons/md";
const QuestionAnswer = ({ chat, handleUpdateChatTitle, setIsAdmin, isAdmin }) => {
  const lastItemRef = useRef(null);
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(chat.detailed_answer);

  // const lastItemRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(
    `${chat.question || ""} ${chat.query || ""}`
  );
  const [prevTitle, setPrevTitle] = useState(title); // Store previous title
  const inputRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Handle title update on "Enter" key or blur
  const handleTitleUpdate = async () => {
    setIsEditing(false);
    if (title.trim() !== prevTitle) {
      await handleUpdateChatTitle(chat?.chat_id, title);
      setPrevTitle(title); // Update previous title after successful update
    }
  };

  // Handle cancel update and revert to previous title
  const handleCancelUpdate = () => {
    setTitle(prevTitle);
    setIsEditing(false);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleCopy = () => {
    // Create a temporary element to extract text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = chat.answer || chat.detailed_answer; // Convert HTML to DOM
    const plainText = tempElement.innerText || tempElement.textContent; // Extract only text

    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleSpeak = () => {
    if (!chat.answer && !chat.detailed_answer) return;

    const textToSpeak = chat.answer || chat.detailed_answer;
    const synth = window.speechSynthesis;

    if (!speaking) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setSpeaking(false);
      synth.speak(utterance);
      setSpeaking(true);
    } else {
      synth.cancel();
      setSpeaking(false);
    }
  };

  const icons = [
    { icon: BsCopy, action: handleCopy, isCopyIcon: true },
    {
      icon: FaRegShareFromSquare,
      action: () => alert("Share functionality here"),
    },
    { icon: speaking ? IoVolumeMute : FaVolumeHigh, action: handleSpeak },
    { icon: liked ? AiFillLike : AiOutlineLike, action: handleLike },
    {
      icon: disliked ? AiFillDislike : AiOutlineDislike,
      action: handleDislike,
    },
    { icon: GrRefresh, action: () => alert("Refresh functionality here") },
  ];
  const sanitizedHTML = DOMPurify.sanitize(chat.answer);

  return (
    <section ref={lastItemRef} className="flex flex-col mt-6 gap-6  ">
      <div className="flex w-full items-center space-x-6">
        <div className="w-full pl-14 space-y-6">
         {!isAdmin&& <div className="shadow-md flex items-center justify-between gap-4 rounded-lg h-16 w-full text-start p-4">
            {isEditing ? (
              <div className="flex w-full items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleUpdate()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                <FaTimes
                  onClick={handleCancelUpdate}
                  className="cursor-pointer text-red-500"
                />
              </div>
            ) : (
              <section>{title}</section>
            )}
            <section
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <FaRegEdit />
            </section>
          </div>
}
          <div className="flex w-full relative gap-5 items-center group">
            {/* Floating Icons on Hover */}
            {!isAdmin && (

              <div className="text-2xl absolute flex flex-col gap-2 text-primary left-[-30px] items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {icons.map(({ icon: Icon, action, isCopyIcon }, index) => (
                  <IconWrapper key={index} onClick={action}>
                    <Icon
                      fontSize={12}
                      className={`${isCopyIcon && copied ? "text-[#008FF6]" : "text-[#1B2559]"
                        }`}
                    />
                  </IconWrapper>
                ))}
              </div>
            )}

            {/* Answer Section */}
            <div className="shadow-md text-start p-4 rounded-lg border-primary w-full">
              {chat.answer ? (
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    lineHeight: "1.6",
                    maxWidth: "800px",
                    margin: "0 ",
                    padding: "20px",
                    color: "#333",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                </div>
              ) : containsHtml ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(chat.detailed_answer),
                  }}
                />
              ) : (
                chat.detailed_answer
              )}
            </div>
          </div>
        </div>

        {!isAdmin && (

          <div className="flex flex-col gap-4 text-2xl text-primary">
            <GrGallery />
            <MdVideoLibrary />
          </div>
        )}
      </div>
    </section>
  );
};

const IconWrapper = ({ children, onClick }) => (
  <div
    className="w-[20px] bg-gray-200 h-[20px] shadow-xl rounded-xl flex items-center justify-center"
    onClick={onClick}
  >
    <div className="cursor-pointer">{children}</div>
  </div>
);

export default QuestionAnswer;
