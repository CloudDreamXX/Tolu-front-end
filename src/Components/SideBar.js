import React, { useState, useEffect, useRef } from "react";
import { Layout, Dropdown, Button, Input, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft, FaSearch, FaRegUserCircle } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { GetSearchHistory, GetSession, getUserProfile, updateChatTitle } from "../ReduxToolKit/Slice/userSlice";
import './SideBar.css';

const { Sider } = Layout;

const SideBar = ({ className, setModels, setChatId, latestChat }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [recentHistory, setRecentHistory] = useState([]);
  const [showRecentHistory, setShowRecentHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });
  const renameInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userProfile, profileLoading, profileError } = useSelector((state) => ({
    userProfile: state.user?.userProfile,
    profileLoading: state.user?.profileLoading,
    profileError: state.user?.profileError
  }));

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

  useEffect(() => {
    if (!userProfile && !profileLoading && !profileError) {
      dispatch(getUserProfile());
    }
  }, [userProfile, profileLoading, profileError, dispatch]);

  useEffect(() => {
    if (userProfile && !recentHistory.length) {
      fetchRecentHistory();
    }
  }, [userProfile]);

  useEffect(() => {
    if (latestChat) {
      const chatExists = recentHistory.some(hist => hist.chat_id === latestChat.chat_id);
      if (!chatExists) {
        const newChat = {
          ...latestChat,
          created_at: new Date().toISOString()
        };
        setRecentHistory(prev => [newChat, ...prev].slice(0, 10));
      }
    }
  }, [latestChat]);

  const fetchRecentHistory = async () => {
    try {
      const response = await dispatch(GetSearchHistory()).unwrap();
      setRecentHistory(response.history);
    } catch (error) {
      console.error('Error fetching recent history:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    // Automatically show history when user starts typing
    if (value.trim() !== '') {
      setShowRecentHistory(true);
    }
  };

  const filterHistories = (histories) => {
    if (!searchTerm) return histories;
    return histories.filter(item =>
      (item.chat_title?.toLowerCase().includes(searchTerm) ||
       item.query.toLowerCase().includes(searchTerm))
    );
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e, chatId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      chatId: chatId
    });
  };

  const handleRenameClick = (chatId, currentTitle) => {
    setRenamingChatId(chatId);
    setNewTitle(currentTitle);
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
    setTimeout(() => renameInputRef.current?.focus(), 0);
  };

  const handleRename = async (chatId) => {
    if (newTitle.trim()) {
      try {
        await dispatch(updateChatTitle({ chat_id: chatId, new_title: newTitle })).unwrap();
        setRecentHistory(prev => prev.map(item =>
          item.chat_id === chatId ? { ...item, chat_title: newTitle } : item
        ));
      } catch (error) {
        console.error('Error updating chat title:', error);
      }
    }
    setRenamingChatId(null);
    setNewTitle('');
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === 'Enter') {
      handleRename(chatId);
    } else if (e.key === 'Escape') {
      setRenamingChatId(null);
      setNewTitle('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNewSearch = () => {
    if (setModels) {
      setModels(null);
    }
    if (setChatId) {
      setChatId(null);
    }
    navigate('/newsearch', { replace: true });
    window.location.reload();
  };

  const handleHistorySelect = async (chatId) => {
    try {
      const response = await dispatch(GetSession({ chat_id: chatId })).unwrap();
      const searchResults = response.search_results.map(result => ({
        questions: result.query,
        answers: result.answer,
        result_id: result.id,
        chat_id: result.chat_id,
      }));

      navigate('/newsearch', {
        state: {
          searchResults: searchResults,
          selectedChatId: chatId
        }
      });
    } catch (error) {
      console.error('Error fetching chat session:', error);
    }
  };

  const toggleHistory = (e) => {
    e.preventDefault();
    setShowRecentHistory(!showRecentHistory);
  };

  const accountItems = [
    {
      key: "1",
      label: "Edit Profile",
      style: { borderRadius: "0px" },
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const groupedHistory = filterHistories(recentHistory).reduce((groups, item) => {
    const category = categorizeDates(item.created_at);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={230}
      collapsedWidth={60}
      className={`box1 fixed-sidebar ${className ? className : ''}`}
      trigger={null}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'hidden',
        zIndex: 1000
      }}
    >
      <div className="sidebar-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header">
          {!collapsed ? (
            <>
              <h3 className="vita-heading">VITAI</h3>
              <Button
                type="text"
                icon={<FaRegArrowAltCircleLeft size={20} />}
                onClick={() => setCollapsed(!collapsed)}
                className="toggle-btn"
              />
            </>
          ) : (
            <div className="collapsed-header">
              <div className="collapsed-content">
                <h3 className="v-heading">V</h3>
                <Button
                  type="text"
                  icon={<FaRegArrowAltCircleRight size={20} />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="toggle-btn"
                />
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="history-search-container">
            <input
              type="text"
              placeholder="Chat Search"
              className="history-search"
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowRecentHistory(true)}
            />
          </div>
        )}

        <div className={`mt-4 ${className ? "sidebar_text" : ''}`}>
          <div
            className={`side ${isActive('/newsearch') ? 'active' : ''}`}
            onClick={handleNewSearch}
            style={{ cursor: 'pointer' }}
            title="New Search"
          >
            <SlNote />
            {!collapsed && <span className="sidetext">New Search</span>}
          </div>
        </div>

        <div className="history-section" style={{ flex: 1, overflowY: 'auto' }}>
          <div
            className={`side ${isActive('/search-history') ? 'active' : ''}`}
            onClick={toggleHistory}
            style={{ cursor: 'pointer' }}
          >
            <RxCounterClockwiseClock />
            {!collapsed && <span className="sidetext">Search History</span>}
          </div>

          {!collapsed && showRecentHistory && (
            <div className="recent-history-list custom-scrollbar">
              {Object.entries(groupedHistory).map(([category, items]) => (
                <div key={category} className="history-category">
                  <div className="history-date-label">{category}</div>
                  {items.map((item) => (
                    <div
                      key={item.chat_id}
                      className="recent-history-item-container"
                      onContextMenu={(e) => handleContextMenu(e, item.chat_id)}
                    >
                      {renamingChatId === item.chat_id ? (
                        <Input
                          ref={renameInputRef}
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => handleRename(item.chat_id)}
                          onKeyDown={(e) => handleKeyPress(e, item.chat_id)}
                          className="rename-input"
                        />
                      ) : (
                        <div
                          className={`recent-history-item ${location.pathname === '/newsearch' && item.chat_id === setChatId ? 'active' : ''}`}
                          onClick={() => handleHistorySelect(item.chat_id)}
                        >
                          {item.chat_title || item.query}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bottom-buttons" style={{ marginTop: 'auto' }}>
          <Dropdown
            menu={{ items: accountItems }}
            placement="bottomCenter"
            arrow={true}
          >
            <Button
              className="account-dropdown-toggle"
              type="button"
              style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
              title="My Account"
            >
              <FaRegUserCircle size={25} />
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="account-text">{userProfile?.name || 'My Account'}</span>
                  <div style={{
                    border: '1px solid #666',
                    padding: '2px 6px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    color: '#666',
                    lineHeight: '1',
                    textTransform: 'uppercase'
                  }}>
                    Free
                  </div>
                </div>
              )}
            </Button>
          </Dropdown>

          <Button
            className="contact-support dropdown-toggle"
            type="button"
            style={{ cursor: 'pointer' }}
            title="Contact Support"
          >
            <MdSupportAgent />
            {!collapsed && <span className="sidetext">Contact Support</span>}
          </Button>
        </div>
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
        >
          <Menu>
            <Menu.Item
              key="rename"
              onClick={() => {
                const item = recentHistory.find(h => h.chat_id === contextMenu.chatId);
                if (item) {
                  handleRenameClick(contextMenu.chatId, item.chat_title || item.query);
                }
              }}
            >
              Rename Chat
            </Menu.Item>
          </Menu>
        </div>
      )}
    </Sider>
  );
};

export default SideBar;

