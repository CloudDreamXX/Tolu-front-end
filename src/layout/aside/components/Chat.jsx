import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ChatHistory from '../../../pages/screens/chat/ChatHistory';
import { useGetSearchHistoryQuery } from '../../../redux/apis/apiSlice';
import { setRefetchHistory, setSelectedChatId } from '../../../redux/slice/chatSlice';

function Chat({ isAsideOpen }) {
    const { data, error, isLoading, refetch } = useGetSearchHistoryQuery();
    const refetchHistory = useSelector((state) => state.chat.refetchHistory);
    const dispatch = useDispatch();

    // Handle chat selection
    const chatIdHandler = (chatId) => {
        dispatch(setSelectedChatId(chatId));
    };

    // Show error if API fails
    useEffect(() => {
        if (error) {
            toast.error("Failed to load chat history");
        }
    }, [error]);

    // Refetch chat history when `refetchHistory` flag changes
    useEffect(() => {
        if (refetchHistory) {
            refetch();
            dispatch(setRefetchHistory(false));
        }
    }, [refetchHistory, refetch, dispatch]);

    return (
        <div className='flex flex-col w-full'>
            <ChatHistory
                isAsideOpen={isAsideOpen}
                newChatHandler={() => {}} // Removed unnecessary state handling
                chatHistory={data}
                isLoading={isLoading}
                chatIdHandler={chatIdHandler}
            />
        </div>
    );
}

export default Chat;
