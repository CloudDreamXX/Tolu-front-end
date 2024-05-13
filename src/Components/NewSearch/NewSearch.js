import React from 'react'
import { IoArrowForwardSharp } from "react-icons/io5";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { FaVolumeHigh } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io"
import { LuSearch } from "react-icons/lu";
import { AiOutlineLoading } from 'react-icons/ai';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AISearch, dislikeResponse } from '../../ReduxToolKit/Slice/userSlice';
import './NewSearch.css'
const NewSearch = () => {

    const buttonarray = ["Chronic Symptoms", "Women's Health", "Exercise", "Lifestyle", "Supplements", "Lab Test", "Herbs", "Foods", "and More..."];
    const [searchQuery, setSearchQuery] = useState('');
    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [searched, setSearched] = useState(false);
    const [refreshingIndices, setRefreshingIndices] = useState({});
    const [models, setModels] = useState([]);
    const [dislikedResults, setDislikedResults] = useState({});


    const dispatch = useDispatch();
    const scrollableDivRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [models]);

    const scrollToBottom = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
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

    const msg = new SpeechSynthesisUtterance();
    function speak_text(message) {
      msg.text = message;
      console.log(msg)
      window.speechSynthesis.speak(msg);
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        handleSubmit(event);
      }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery) {
            setLoading(true);
            try {
                const response = await dispatch(AISearch({ user_prompt: searchQuery })).unwrap();
                console.log(response)
                const newEntry = {
                    questions: searchQuery,
                    answers: response.results.reply,
                    result_id: response.searched_result_id
                };
                setModels(prevModels => [...prevModels, newEntry]);
                setSearchHistory(prevHistory => [...prevHistory, searchQuery]);
                setSearchQuery("");
            } catch (error) {
                console.error('Failed to fetch AI Search:', error);
            }
            setLoading(false);
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
        <div className="container-fluid bg-white">
                        {pageLoading ? (
                <div className="loading-overlay">
                    <FiLoader className="loading-icon big-loader" />
                </div>
            ) : (
            <div className='row'>
                <div className='col-lg-1'></div>
                <div className='col-lg-7'>
                    <div className='searchpage-main'>
                        {models.length > 0 ? (
                            <>
                                <div ref={scrollableDivRef} className='main-div-height'>
                                    {models.map((model, index) => (

                                        <React.Fragment key={index}>
                                            <div className='main-div'>
                                                <div className='display'><div className='user circle'></div><span className='text'> You</span></div>
                                                <div className='ques-ans'> {model.questions}</div>
                                            </div>
                                            <div className='main-div'>
                                                <div className='display'><div className='vita circle'></div><span className='text'> Vita Guide</span></div>
                                                <div className='ques-ans'> {model.answers}</div>
                                            </div>
                                            <div className="button-group" style={{ marginLeft: "12px" }}>
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
                                                <button className="generator-icon" onClick={() => speak_text(model.answers)}><FaVolumeHigh /></button>
                                                <button className="generator-icon"><IoMdAddCircleOutline /></button>
                                            </div>
                                            <div id="copy-tooltip" className="tooltip">Copied!</div>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="main-search mainpage-top">
                                    <form onSubmit={handleSubmit} className="d-flex">
                                        {/*<input type="search" className='input-form' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " />*/}
                                        <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                                        <div className="button-container">
                                            <button className="up-icon"><IoArrowForwardSharp /></button>
                                        </div>
                                        <div>
                                            {loading && <AiOutlineLoading className="loading-icon" />}
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className='main'>
                                <div>
                                    {buttonarray.map((button, index) => {
                                        let random = (index % 6) + 1;
                                        let class_name = "col" + random.toString();
                                        return (<button className={`${class_name} main-button`} >{button}</button>)
                                    })}
                                </div>
                                <div className="main-search maintop">
                                    <form onSubmit={handleSubmit} className="d-flex">
                                        {/*<input type="search" className='input-form' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " />*/}
                                        <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                                        <div className="button-container">
                                            <button className="up-icon"><IoArrowForwardSharp /></button>
                                        </div>
                                        <div>

                                            {loading && <AiOutlineLoading className="loading-icon" />}
                                        </div>
                                    </form>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
                <div className='col-md-2'></div>
                <div className='col-md-2 '>
                    <div className='find'>
                        <div className='find-flex'>
                            <span className='findicon'><LuSearch size={18} /></span>
                            <input type='search' placeholder='Find' />
                        </div>
                        <div>
                            {searchHistory.map((item, index) => (
                                <div key={index} className="findhistory">{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
              )}
        </div>
    )
}

export default NewSearch;