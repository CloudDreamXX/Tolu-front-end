import React, { useEffect, useState, useRef } from 'react';
import { LuSearch } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { GetSearchHistory, GetSession, updateChatTitle } from "../ReduxToolKit/Slice/userSlice";

const SearchHistory = ({ is_new, setModels, setChatId, latestChat }) => {
    const dispatch = useDispatch();
    const [searchHistories, setSearchHistories] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });
    const [renamingChatId, setRenamingChatId] = useState(null);
    const renameInputRef = useRef(null);

    const fetchSearchHistory = async () => {
        try {
            const response = await dispatch(GetSearchHistory()).unwrap();
            setSearchHistories(response.history);
        } catch (error) {
            console.error('Error fetching search history:', error);
        }
    };

    useEffect(() => {
        fetchSearchHistory();
    }, [is_new, dispatch]);

    // New useEffect to handle latest chat updates
    useEffect(() => {
        if (latestChat) {
            // Check if the chat already exists in history
            const chatExists = searchHistories.some(hist => hist.chat_id === latestChat.chat_id);

            if (!chatExists) {
                // Add the new chat to the history
                setSearchHistories(prev => [{
                    chat_id: latestChat.chat_id,
                    query: latestChat.query,
                    chat_title: latestChat.chat_title || latestChat.query,
                    created_at: new Date().toISOString()
                }, ...prev]);
            }
        }
    }, [latestChat]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(GetSearchHistory()).unwrap();
                setSearchHistories(response.history);
            } catch (error) {
                console.error('Error fetching search history:', error);
            }
        };
        fetchData();
    }, [is_new, dispatch]);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleHistory = async (chat_id) => {
        try {
            const response = await dispatch(GetSession({ chat_id: chat_id })).unwrap();
            const searchResults = response.search_results.map(result => ({
                questions: result.query,
                answers: result.answer,
                result_id: result.id,
                chat_id: result.chat_id,
            }));
            setModels(searchResults);
            setChatId(chat_id);
            setSelectedChatId(chat_id);
        } catch (error) {
            console.error('Error fetching search history:', error);
        }
    }

    const handleContextMenu = (e, chat_id) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, chatId: chat_id });
    }

    const handleRenameClick = () => {
        setRenamingChatId(contextMenu.chatId);
        setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
        setTimeout(() => renameInputRef.current?.focus(), 0);
    }

    const handleRename = async (chat_id, newTitle) => {
        if (newTitle.trim()) {
            try {
                await dispatch(updateChatTitle({ chat_id, new_title: newTitle })).unwrap();
                setSearchHistories(prev => prev.map(item =>
                    item.chat_id === chat_id ? { ...item, chat_title: newTitle } : item
                ));
            } catch (error) {
                console.error('Error updating chat title:', error);
            }
        }
        setRenamingChatId(null);
    }

    const categorizeDates = (date) => {
        const today = new Date();
        const createdDate = new Date(date);
        if (createdDate.toDateString() === today.toDateString()) {
            return "Today";
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            if (createdDate.toDateString() === yesterday.toDateString()) {
                return "Yesterday";
            } else {
                return createdDate.toLocaleDateString();
            }
        }
    };

    const groupedHistories = {};
    searchHistories.forEach((item) => {
        const category = categorizeDates(item.created_at);
        if (!groupedHistories[category]) {
            groupedHistories[category] = [];
        }
        groupedHistories[category].push(item);
    });

    return (
        <>
            <div className="col-md-2 search-history">
                <div className='col-md-2'></div>
                <div className='find'>
                    <div className='find-flex'>
                        <span className='findicon'><LuSearch size={18} /></span>
                        <input type='search' placeholder='Find' />
                    </div>
                    <div className="find-his" style={{ marginTop: "-10px" }}>
                        {Object.entries(groupedHistories).map(([category, histories]) => (
                            <div key={category}>
                                <div className={`category-title ${category === 0 ? ' first-title' : ''}`}>{category}</div>
                                {histories.map((historyItem, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginLeft: "-8px",
                                            backgroundColor: selectedChatId === historyItem.chat_id ? '#e0e0e0' : 'transparent',
                                            cursor: 'pointer'
                                        }}
                                        className="findhistory"
                                        onClick={() => handleHistory(historyItem.chat_id)}
                                        onContextMenu={(e) => handleContextMenu(e, historyItem.chat_id)}
                                    >
                                        {renamingChatId === historyItem.chat_id ? (
                                            <input
                                                ref={renameInputRef}
                                                defaultValue={historyItem.chat_title || historyItem.query}
                                                onBlur={(e) => handleRename(historyItem.chat_id, e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleRename(historyItem.chat_id, e.target.value)}
                                            />
                                        ) : (
                                            historyItem.chat_title || historyItem.query
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'fixed',
                        // top: contextMenu.y,
                        left: contextMenu.x,
                        background: 'white',
                        border: '1px solid #ccc',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                        zIndex: 1000
                    }}
                >
                    <button
                        onClick={handleRenameClick}
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#ffe2e0',
                            border: '1px solid #ccc',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 1000
                        }}
                    >
                        Rename Chat
                    </button>
                </div>
            )}
        </>
    );
};

export default SearchHistory;
