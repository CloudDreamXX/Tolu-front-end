import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { GoSidebarCollapse } from "react-icons/go";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdSupportAgent } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { GetSearchHistory, GetSession, getUserProfile } from "../ReduxToolKit/Slice/userSlice";
import './SideBar.css';

const { Sider } = Layout;

const SideBar = ({ className, setModels, setChatId, latestChat }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [recentHistory, setRecentHistory] = useState([]);
  const [showRecentHistory, setShowRecentHistory] = useState(false);
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

  // Separate useEffect for fetching history
  useEffect(() => {
    // Only fetch history if we have the user profile
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
      setRecentHistory(response.history.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent history:', error);
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
    // Reset any necessary state
    if (setModels) {
      setModels(null);
    }
    if (setChatId) {
      setChatId(null);
    }

    // Navigate to new search page
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

  const groupedHistory = recentHistory.reduce((groups, item) => {
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
      className={`box1 ${className ? className : ''}`}
      trigger={null}
      theme="light"
    >
<div className="sidebar-header">
  {!collapsed ? (
    <>
      <h3 className="vita-heading">VITAI</h3>
      <Button
        type="text"
        icon={ <GoSidebarCollapse size={20} />}
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
          icon={<GoSidebarCollapse size={20} />}
          onClick={() => setCollapsed(!collapsed)}
          className="toggle-btn"
        />
      </div>
    </div>
  )}
</div>
      <div className={`mt-5 ${className ? "sidebar_text" : ''}`}>
        <div
          className={`text-decor side ${isActive('/newsearch') ? 'active' : ''}`}
          onClick={handleNewSearch}
          style={{ cursor: 'pointer' }}
          title="New Search"
        >
          <SlNote />
          {!collapsed && <span className="sidetext">New Search</span>}
        </div>

        <div className="history-section">
          <div className="history-header">
            <Link
              className={`text-decor side ${isActive('/search-history') ? 'active' : ''}`}
              to="/search-history"
              onClick={() => navigate('/search-history')}
            >
              <RxCounterClockwiseClock />
              {!collapsed && <span className="sidetext">Search History</span>}
            </Link>
            {!collapsed && (
              <Button
                type="text"
                icon={showRecentHistory ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                onClick={() => setShowRecentHistory(!showRecentHistory)}
                className="history-toggle-btn"
              />
            )}
          </div>

          {!collapsed && showRecentHistory && (
            <div className="recent-history-list">
              {Object.entries(groupedHistory).map(([category, items]) => (
                <div key={category} className="history-category">
                  <div className="history-date-label">{category}</div>
                  {items.map((item) => (
                    <div
                      key={item.chat_id}
                      className={`recent-history-item ${location.pathname === '/newsearch' && item.chat_id === setChatId ? 'active' : ''}`}
                      onClick={() => handleHistorySelect(item.chat_id)}
                    >
                      {item.chat_title || item.query}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

<div className="bottom-buttons">
  <Dropdown
    menu={{ items: accountItems }}
    placement="bottomCenter"
    arrow={true}
  >
    <Button
    className="account dropdown-toggle"
    type="button"
    style={{ cursor: 'pointer' }}
    title="My Account"
  >
    <FaUserCircle />
    {!collapsed && <span className="sidetext">{userProfile?.name || 'My Account'}</span>}
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
    </Sider>
  );
};

export default SideBar;
