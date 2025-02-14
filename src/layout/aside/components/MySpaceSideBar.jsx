import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useGetSearchHistoryQuery } from '../../../redux/apis/apiSlice';
import { setNewChat, setRefetchHistory, setSelectedChatId } from '../../../redux/slice/chatSlice';
import { BiSolidEdit } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import Input from '../../../components/small/Input';
import {  IoIosSearch } from "react-icons/io";
import toast from 'react-hot-toast';

// import { useDispatch } from "react-redux";
function MySpaceSideBar({ isAsideOpen }) {




    const { data: chatHistory, error, isLoading, refetch } = useGetSearchHistoryQuery();
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
    // const dispatch = useDispatch();
    const [showHistory, setShowHistory] = useState(true);
    // console.log("isAsideOpen", !isAsideOpen)
    const newChatHandler = () => {
        dispatch(setNewChat(true));
    };
    useEffect(() => {
        setShowHistory(false)
        // console.log("history toggled", !isAsideOpen)
    }, [isAsideOpen])

    const toggleHistory = () => {
        setShowHistory((prev) => !prev);
    };

    const categorizeChats = (chats = []) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today - 86400000);
        const lastWeek = new Date(today - 7 * 86400000);

        return {
            todayChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= today) : [],
            yesterdayChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= yesterday && new Date(chat.created_at) < today) : [],
            last7DaysChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) >= lastWeek && new Date(chat.created_at) < yesterday) : [],
            earlierChats: Array.isArray(chats) ? chats.filter(chat => new Date(chat.created_at) < lastWeek) : [],
        };
    };

    const categorizedChats = categorizeChats(chatHistory?.history || []);




    return (
        <div className="space-y-2 flex flex-col w-full items-center text-nowrap overflow-hidden">
            {/* New Search Button */}
            <button
                onClick={newChatHandler}
                className="bg-primary w-full text-start py-3 px-4 rounded-lg  text-sm font-[500] flex items-center gap-2"
            >
                <CiUser fontSize={20} /> Health Profile
            </button>

            {/* Search History Section */}
            <section
                className="p-2 flex w-full items-center hover:bg-primary rounded-lg justify-between font-medium cursor-pointer"
                onClick={toggleHistory}
            >
                <section className="flex  items-center gap-4">
                    <MdHistory /> Search history
                </section>
                <section>{showHistory ? <IoIosArrowUp /> : <IoIosArrowDown />}</section>
            </section>

            {/* Show history only if toggled */}
            <section className="h-screen custom-scroll overflow-auto">
                {showHistory && (
                    <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full pl-10 pr-4 py-2 shadow-[#7090B014] border border-[#ACACAC] rounded-lg "
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D1D1F99]">
                                    <IoIosSearch className="text-2xl font-bold" />
                                </span>
                            </div>
                        </div>
                        {Object.entries(categorizedChats).map(([key, chats]) => (
                            <div key={key} className=" p-2 rounded-lg">
                                <h3 className="text-gray-600 font-medium">
                                    {key === "todayChats"
                                        ? "Today"
                                        : key === "yesterdayChats"
                                            ? "Yesterday"
                                            : key === "last7DaysChats"
                                                ? "Last 7 Days"
                                                : "Earlier"}
                                </h3>

                                {isLoading ? (
                                    <p className="px-4 py-2 text-gray-500 text-xs italic">Loading...</p>
                                ) : chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <p
                                            key={chat.chat_id}
                                            onClick={() => chatIdHandler(chat.chat_id)}
                                            className="px-4 py-2 bg-transparent mt-2 text-primaryDark rounded-md text-xs md:text-sm truncate w-[246px] xl:w-full
                         hover:bg-[#17171718] cursor-pointer"
                                        >
                                            {chat.query}
                                        </p>
                                    ))
                                ) : (
                                    <p className="px-4 py-2 text-gray-500 text-xs italic">No history available</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default MySpaceSideBar