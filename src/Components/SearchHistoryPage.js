import React from 'react';
import SearchHistory from "./SearchHistory";
import { useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import SideBar from './SideBar';

const SearchHistoryPage = () => {
    const navigate = useNavigate();

    const handleHistorySelect = (searchResults, selectedChatId) => {
        navigate('/newsearch', {
            state: {
                searchResults,
                selectedChatId
            }
        });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideBar />
            <Layout>
                <div className="bg-white h-full">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Search History</h2>
                        <SearchHistory
                            is_new={false}
                            setModels={(results) => {}}
                            setChatId={() => {}}
                            isStandalone={true}
                            onHistorySelect={handleHistorySelect}
                        />
                    </div>
                </div>
            </Layout>
        </Layout>
    );
};

export default SearchHistoryPage;
