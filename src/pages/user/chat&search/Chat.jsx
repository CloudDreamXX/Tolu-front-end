
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import MainChat from '../../screens/chat/MainChat';

function Chat() {

    const [chats, setChats] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const newChat = useSelector((state) => state.chat.newChat); // Access newChat state

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
        <div className="h-full flex items-end">
            <MainChat
            // chats={chats}
            // isLoading={isLoading}
            // isRecording={isRecording}
            // setText={setText}
            // startRecording={startRecording}
            // stopRecording={stopRecording}
            // submitHandler={submitHandler}
            // text={text}
            // handleKeyDown={handleKeyDown}
            // isChatHistoryLoading={false}
            />
        </div>
    )
}

export default Chat