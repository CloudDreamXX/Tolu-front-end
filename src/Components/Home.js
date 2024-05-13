import React, { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaArrowRotateLeft } from "react-icons/fa6" ;
import { IoCopyOutline } from "react-icons/io5";
import { FaVolumeHigh} from "react-icons/fa6";
import { GrDislike } from "react-icons/gr";
import { FiLoader } from "react-icons/fi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { AiOutlineLoading } from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdSearch} from "react-icons/io"
import { IoArrowForwardSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { AISearch, dislikeResponse } from "../ReduxToolKit/Slice/userSlice";
import Editor from './Editor';

const Home = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [refreshingIndices, setRefreshingIndices] = useState({});
  const [searched, setSearched] = useState(false);
  const [dislikedResults, setDislikedResults] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
        const response = await dispatch(AISearch({ user_prompt: searchQuery })).unwrap();
        const newEntry = {
            questions: searchQuery,
            answers: response.results.reply,
            result_id: response.searched_result_id
        };
        setModels(prevModels => [...prevModels, newEntry]);
        setSearchHistory(prevHistory => [...prevHistory, searchQuery]);
        setSearched(true);
        setSearchQuery("");
    } catch (error) {
        console.error('Failed to fetch AI Search:', error);
    } finally {
        setLoading(false);
    }
};
const handleDislike = async (result_id) => {
  console.log(result_id)
  const payload = {
      result_id: result_id,
      vote: true
  };
  try {
      await dispatch(dislikeResponse(payload)).unwrap();
      setDislikedResults(prev => ({ ...prev, [result_id]: true }));
  } catch (error) {
      console.error('Failed to submit dislike:', error);
  }
};

const [copied, setCopied] = useState(false);

function handleCopyResponse(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000); // Reset copied state after 2 seconds
        })
        .catch((error) => {
            console.error('Error copying text: ', error);
        });
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSubmit(event);
  }
}

const handleRegenerate = async (index, originalQuery) => {
  setPageLoading(true);
  setRefreshingIndices(prev => ({ ...prev, [index]: true }));
  try {
      const response = await dispatch(AISearch({ user_prompt: originalQuery })).unwrap();
      const updatedEntry = {
          questions: originalQuery,
          answers: response.results.reply,
          result_id: response.searched_result_id
      };
      setModels(models => models.map((model, idx) => idx === index ? updatedEntry : model));
  } catch (error) {
      console.error('Failed to regenerate AI Search:', error);
  }
  setPageLoading(false);
  setRefreshingIndices(prev => ({ ...prev, [index]: false }));
};
  return (

    <div className="container-fluid home">
        {pageLoading ? (
                <div className="loading-overlay">
                    <FiLoader className="loading-icon big-loader" />
                </div>
            ) : (
      <div className="row main-box">
        
        <div className="col-md-5">
        <div className="box2">

        {!searched || models.length === 0 ? (
          <>
         <div className="headertext">Top 5 searches this week</div>
          <div className="gen-btn">
              <button className="generator-button" style={{backgroundColor: "rgb(254, 226,224)"}}>IBS protocol</button>
              <button className="generator-button" style={{backgroundColor: "rgb(234, 254,225)"}}>Eating for hormones</button>
              <button className="generator-button" style={{backgroundColor: "rgb(225, 243,254)"}}>Seed rotation</button>
              <button className="generator-button" style={{backgroundColor: "rgb(255, 247,225)"}}>Sleep hygiene</button>
              <button className="generator-button" style={{backgroundColor: "rgb(240, 225,254)"}}>TBI lifestyle</button>
          </div>
          <div className="handout-search-response text-area">
              <ul className="ul-list">
                  <li>- What is IBS?</li>
                  <li>- What are the typical symptoms of IBS?</li>
                  <li>- What do I need to avoid for my IBS?</li>
                  <li>- What foods can I ear with an IBS?</li>
                  <li>- Is there any food that would help IBS symptoms?</li>
                  <li>- Will my IBS ever cure?</li>
                  <li>- Which supplements are recommended for IBS?</li>
                  <li>- Why did I get IBS?</li>
                  <li>- Why my IBS symptoms are different from my friend's?</li>
                  <li>- Can I get pregnant with IBS?</li>
                  <li>- How does menopause affect IBS?</li>
                  <li>- Compare IBS symptoms to Constipation.</li>
                  <li>- Create a handout for a female IBS client in her 30s.</li>
                  <li>- Write me a collaboration letter to Dr Linda Smith requesting further test orders for the patient.</li>
                  <li>- Which yoga studios are you partnered with in Orlando?</li>
                  <li>- Does Publix carry organic extra virgin olive oil?</li>
                  <li>- Who are your recommended HRT specialists?</li>
                  <li>- I crave sugar all the time. How can I manage it with IBS?</li>
                  <li>- How does menopause affect IBS?</li>
                  <li>- Compare IBS symptoms to Constipation.</li>
                  <li>- Create a handout for a female IBS client in her 30s.</li>
                  <li>- Write me a collaboration letter to Dr Linda Smith requesting further test orders for the patient.</li>
                  <li>- Which yoga studios are you partnered with in Orlando?</li>
                  <li>- Does Publix carry organic extra virgin olive oil?</li>
                  <li>- Who are your recommended HRT specialists?</li>
                  <li>- I crave sugar all the time. How can I manage it with IBS?</li>
              </ul>
              </div><hr className="dashed-line" /><div style={{ marginLeft: "12px" }}>
          </div>
          </>
           ) : (
            <>
              <h3>Search Results:</h3>
                {models.map((model, index) => (
                    <><div key={index}>
                    <div className='main-div'>
                      <div className='display'><div className='user circle'></div><span className='text'> You</span></div>
                      <div className='ques-ans'> {model.questions}</div>
                    </div>
                    <div className='main-div'>
                      <div className='display'><div className='vita circle'></div><span className='text'> Vita Guide</span></div>
                      <div className='ques-ans'> {model.answers}</div>
                    </div>
                  </div><hr className="dashed-line" /><div style={{ marginLeft: "12px" }}>
                  <button className="generator-icon" onClick={() => handleRegenerate(index, model.questions)}>
                                    {refreshingIndices[index] ? <AiOutlineLoading className="loading-icon" /> : <FaArrowRotateLeft />}
                                </button>
                      {dislikedResults[model.result_id] ?
                                    <button className="generator-icon"><BiSolidDislike /></button> :
                                    <button className="generator-icon" onClick={() => handleDislike(model.result_id)}><BiDislike /></button>
                                }
                      <button className="generator-icon" onClick={(event) => {
                            handleCopyResponse(model.answers);
                            const tooltip = document.getElementById('copy-tooltip');
                            const buttonRect = event.target.getBoundingClientRect();
                            tooltip.style.top = `${buttonRect.top + 80}px`;
                            tooltip.style.left = `${buttonRect.left + 20}px`;
                            tooltip.style.opacity = 1;
                            tooltip.style.opacity = 1;
                            setTimeout(() => {
                                tooltip.style.opacity = 0;
                            }, 2000); // Hide tooltip after 2 seconds
                        }}>
                            <IoCopyOutline />
                        </button>
                      <button className="generator-icon"><FaVolumeHigh /></button>
                      <button className="generator-icon"><IoMdAddCircleOutline /></button>
                    </div>
                    <div id="copy-tooltip" className="tooltip">Copied!</div>
                    </>
           ))}
            </>
                        )}
                        
          <div className="search-anything">
          <textarea
            className="search-query"
            placeholder="Ask anything..."
            rows={3}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <div className="button-container">
          <button onClick={handleSubmit} className="up-icon">
                                {loading ? <AiOutlineLoading /> : <IoArrowForwardSharp />}
                            </button>
            </div>
          </div>  
              
        
              </div>
       
        </div>
        <div className="col-md-5 box3">
          <Editor/>
        </div>

        <div className="col-md-2 search-history">
        <div className="search-con">
            <IoMdSearch className="search-icon" />
            <input type="search" className="search-container" placeholder="Find" />

        </div>
        {searchHistory.map((item, index) => (
        <div key={index} className="findhistory">{item}</div>
        ))}
        
        </div>

      </div>
      )}
    </div>
    
  );
};

export default Home;
