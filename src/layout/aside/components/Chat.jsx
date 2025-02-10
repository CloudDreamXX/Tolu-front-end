import React, { useState } from 'react'
import ChatHistory from '../../../pages/screens/chat/ChatHistory'
import { useGetSearchHistoryQuery } from '../../../redux/apis/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChatId } from '../../../redux/slice/chatSlice';

function Chat({ isAsideOpen }) {
    const [chats, setChats] = useState([]);
    const selectedChatId = useSelector((state) => state.chat.selectedChatId);
    console.log("selectedChatId", selectedChatId);
    const { data, error, isLoading } = useGetSearchHistoryQuery(selectedChatId);

    const dispatch = useDispatch()
    const newChatHandler = () => {
        if (chats.length > 0) {
            setChats([]);
            setChartData([]);
        }
    };
    const selectedChatIdHandler = (value) => {
        dispatch(setSelectedChatId(value))
        console.log("value: " + value);
    }


    return (
        <div className='flex  flex-col w-full'>

            <ChatHistory
                isAsideOpen={isAsideOpen}
                newChatHandler={newChatHandler}
                chatHistory={data}
                isLoading={isLoading}
                historyClickHandler={selectedChatIdHandler}
            />
        </div>
    )
}

export default Chat