import React, { useEffect, useState } from 'react'
import ChatHistory from '../../../pages/screens/chat/ChatHistory'
import { useGetSearchHistoryQuery } from '../../../redux/apis/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setNewChat, setRefetchHistory, setSelectedChatId } from '../../../redux/slice/chatSlice';
import toast from 'react-hot-toast';

function Chat({ isAsideOpen }) {
    const [chats, setChats] = useState([]);
    const selectedChatId = useSelector((state) => state.chat.selectedChatId);
    // console.log("selectedChatId", selectedChatId);
    const { data, error, isLoading, refetch } = useGetSearchHistoryQuery();
    const refetchHistory = useSelector((state) => state.chat.refetchHistory);
    // console.log(`Refetching`, refetchHistory)
    console.log("isLoading", data);

    const dispatch = useDispatch()
    const newChatHandler = () => {
        if (chats.length > 0) {
            setChats([]);
            setChartData([]);
        }
    };
    const chatIdHandler = (value) => {
        dispatch(setSelectedChatId(value))
        // console.log("value: " + value);
    }

    useEffect(() => {
        toast.error(error)
    }, [error])
    useEffect(() => {
        refetch()
        dispatch(setRefetchHistory(false));
    }, [refetchHistory])
    return (
        <div className='flex  flex-col w-full'>

            <ChatHistory
                isAsideOpen={isAsideOpen}
                newChatHandler={newChatHandler}
                chatHistory={data}
                isLoading={isLoading}
                chatIdHandler={chatIdHandler}
            />
        </div>
    )
}

export default Chat