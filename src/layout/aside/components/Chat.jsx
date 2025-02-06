import React, { useState } from 'react'
import ChatHistory from '../../../pages/screens/chat/ChatHistory'
import { useGetSearchHistoryQuery } from '../../../redux/apis/apiSlice';

function Chat() {
    const [chats, setChats] = useState([]);

    const { data } = useGetSearchHistoryQuery()

    const newChatHandler = () => {
        if (chats.length > 0) {
            setChats([]);
            setChartData([]);
        }
    };
    return (
        <div className='flex  flex-col w-full'>

            <ChatHistory
                newChatHandler={newChatHandler}
                chatHistory={data}
                historyClickHandler={() => { }}
            />
        </div>
    )
}

export default Chat