import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowIcon } from '../../assets/svgs/Icon';
import AsideDropDown from '../../components/ContentItem';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import MySpaceSideBar from './components/MySpaceSideBar';
import AdminAside from './components/AdminAside';
import UserAside from './components/UserAside';

const Aside = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const { pathname } = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [chats, setChats] = useState([]);

  const asideToggleHandler = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  const renderComponentBasedOnRoute = () => {
    if (pathname.startsWith('/admin2new')) {
      return <AdminAside />;
    }

    switch (pathname) {
      case '/user':
        return <MySpaceSideBar isAsideOpen={isAsideOpen} />;
      case '/librarynew':
        return <UserAside />;
      case '/admin2new':
        return <AdminAside />;
      case '/user/library':
        return <Dashboard />;
      case '/user/chat':
        return <Chat isAsideOpen={isAsideOpen} />;
      case '/user/profile':
        return <Chat />;
      case '/settings':
        return (
          <AsideDropDown
            name="Account Settings"
            options={[]}
            onCheckedChange={() => {}}
          />
        );
      case '/notifications':
        return (
          <AsideDropDown
            name="Notification Settings"
            options={[]}
            onCheckedChange={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full border-[#008FF614] border-r-2 shadow-[#8484850A] bg-white py-8 relative transition-all duration-500 rounded-lg xl:rounded-[0] ${isAsideOpen ? 'w-[90px]' : 'w-[316px]'}`}
    >
      <div className="flex items-center gap-1 justify-center overflow-hidden px-4">
        <h6 className="text-3xl font-bold text-black">VITAI</h6>
      </div>
      <div
        className={`hidden xl:block absolute top-18 cursor-pointer transition-all text-primary duration-300 ${isAsideOpen ? 'rotate-180 right-[-13%]' : 'rotate-0 right-[-5%]'} `}
        onClick={asideToggleHandler}
      >
        <ArrowIcon />
      </div>
      {!isAsideOpen && (
        <div className="h-full py-8 flex px-2 flex-col items-center justify-between transition-all duration-700 overflow-y-auto">
          {renderComponentBasedOnRoute()}
        </div>
      )}
    </div>
  );
};

export default Aside;
