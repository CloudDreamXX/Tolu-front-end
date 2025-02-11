import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { RiAccountCircleFill } from "react-icons/ri";
import { BsCopy } from "react-icons/bs";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { CiVolumeHigh } from "react-icons/ci";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdVideoLibrary } from "react-icons/md";
import { GrGallery, GrRefresh } from "react-icons/gr";

const QuestionAnswer = ({ chat }) => {
    const lastItemRef = useRef(null);
    const containsHtml = /<\/?[a-z][\s\S]*>/i.test(chat.detailed_answer);
    const icons = [BsCopy, FaRegShareFromSquare, CiVolumeHigh, AiOutlineLike, AiOutlineDislike, GrRefresh];
    const sanitizedHTML = DOMPurify.sanitize(chat.answer);

    return (
        // <section ref={lastItemRef} className="flex flex-col mt-6 gap-6 h-full overflow-y-auto">
        <section ref={lastItemRef} className="flex flex-col mt-6 gap-6  ">
            <div className="flex w-full items-center space-x-6">
                <div className="w-full pl-14 space-y-6">
                    <div className="w-full flex items-center gap-6">
                        <RiAccountCircleFill className="text-5xl" />
                        <div className="shadow-md rounded-lg h-16 w-full text-start p-4">
                            {`${chat.question ? chat.question : ""} ${chat.query ? ` ${chat.query}` : ""}`}

                        </div>
                    </div>

                    <div className="flex w-full relative gap-5 items-center group">
                        {/* Floating Icons on Hover */}
                        <div className="text-2xl absolute flex flex-col gap-2 text-primary left-[-30px] items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {icons.map((Icon, index) => (
                                <IconWrapper key={index}>
                                    <Icon fontSize={12} />
                                </IconWrapper>
                            ))}
                        </div>

                        {/* Answer Section */}
                        <div className="shadow-md text-start p-4 rounded-lg border-primary w-full">
                            {chat.answer ? (
                                <div style={{
                                    fontFamily: "Arial, sans-serif",
                                    lineHeight: "1.6",
                                    maxWidth: "800px",
                                    margin: "0 auto",
                                    padding: "20px",
                                    color: "#333"
                                }}>
                                    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                                </div>
                            ) : (
                                containsHtml ? (
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chat.detailed_answer) }} />
                                ) : (
                                    chat.detailed_answer
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 text-2xl text-primary">
                    <GrGallery />
                    <MdVideoLibrary />
                </div>
            </div>
        </section>
    );
};

const IconWrapper = ({ children }) => (
    <div className="w-[20px] bg-gray-200 h-[20px] shadow-xl rounded-xl flex items-center justify-center">
        {children}
    </div>
);

export default QuestionAnswer;
