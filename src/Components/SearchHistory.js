import React, {useEffect, useState} from 'react';
import {LuSearch} from "react-icons/lu";
import {useDispatch} from "react-redux";
import {AISearch, GetSearchHistory, GetSession} from "../ReduxToolKit/Slice/userSlice";

const SearchHistory = ({is_new, setModels, setChatId}) => {
    const dispatch = useDispatch();
    const [searchHistories, setSearchHistories] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await dispatch(GetSearchHistory()).unwrap();
            console.log(response)
            setSearchHistories(response.history);
          } catch (error) {
            console.error('Error fetching search history:', error);
          }
        };
        fetchData();
    }, [is_new]);
    const handleHistory = async (chat_id) => {
        try {
            const response = await dispatch(GetSession({chat_id: chat_id})).unwrap();
            console.log(response)
            const searchResults = response.search_results.map(result => ({
                questions: result.query,
                answers: result.answer,
                result_id: result.id,
                chat_id: result.chat_id,
            }));
            setModels(searchResults);
            setChatId(chat_id);

          } catch (error) {
            console.error('Error fetching search history:', error);
          }

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

  // Group search histories by date categories
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
            {/* <div className='col-md-2 '> */}
            <div className='find'>
              <div className='find-flex'>
                <span className='findicon'><LuSearch size={18} /></span>
                <input type='search' placeholder='Find' />
              </div>
              <div className="find-his" style={{marginTop: "-10px"}}>
                {Object.entries(groupedHistories).map(([category, histories]) => (
                    <div key={category}>
                    <div className={`category-title ${category === 0 ? ' first-title' : ''}`}>{category}</div>
                    {histories.map((historyItem, index) => (
                        <div key={index} style={{marginLeft: "-8px"}} className="findhistory" onClick={() => handleHistory(historyItem.chat_id)}>
                        {historyItem.query}
                        </div>
                    ))}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </>
    );

};

export default SearchHistory;