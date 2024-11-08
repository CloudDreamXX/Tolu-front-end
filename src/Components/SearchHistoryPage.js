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
                <div style={{ backgroundColor: 'white', height: '100%' }}>
                    <div style={{ padding: '1.5rem', width: '50%' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Search History</h2>
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
