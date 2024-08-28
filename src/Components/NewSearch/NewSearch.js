import React, { useState, useEffect, useRef } from 'react';
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { FaVolumeHigh } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { useLocation } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io"
import { IoVolumeMuteSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { AiOutlineLoading } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { AISearch, dislikeResponse } from '../../ReduxToolKit/Slice/userSlice';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import './NewSearch.css'
import SearchHistory from "../SearchHistory";
import { Info } from "../Signup/SignupComponents/Info";
import { edit_text } from '../../ReduxToolKit/Slice/EditedText';
import { useNavigate } from 'react-router-dom';
import { getAISearch } from '../../helpers/API';
import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
// const baseURL = "http://localhost:8000";


const API = axios.create({
  baseURL: baseURL,
});

const NewSearch = () => {
    const buttonarray = ["Chronic Symptoms", "Women's Health", "Exercise", "Lifestyle", "Supplements", "Lab Test", "Herbs", "Foods", "and More..."];
    const [searchQuery, setSearchQuery] = useState('');
    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshingIndices, setRefreshingIndices] = useState({});
    const location = useLocation();
    const [showInfo, setShowInfo] = useState(location.state?.showInfo || false);
    const [models, setModels] = useState([]);
    const [dislikedResults, setDislikedResults] = useState({});
    const [speaking, setSpeaking] = useState(false);  // State to track if it's currently speaking
    const navigate = useNavigate();

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    // Function to handle starting the speech
    const startSpeaking = (message) => {
        if (window.speechSynthesis.speaking) {
            stopSpeaking(); // Optional: stop if already speaking when asked to speak again
        }
        const msg = new SpeechSynthesisUtterance(message);
        msg.onend = () => {
            console.log("Finished speaking...");
            setSpeaking(false);
        };
        msg.onerror = (event) => {
            console.error("SpeechSynthesisUtterance.onerror", event.error);
            setSpeaking(false);
        };
        setSpeaking(true);
        window.speechSynthesis.speak(msg);
    };

    useEffect(() => {
        if (location.state?.showInfo) {
            setShowInfo(true);
            navigate("/newsearch", { state: { showInfo: false } });
        }
    }, [location]);

    const dispatch = useDispatch();
    const scrollableDivRef = useRef(null);
    const [chatId, setChatId] = useState(null);

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

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery) {
            setLoading(true);

            let newEntry = {
                questions: searchQuery,
                answers: '',
                result_id: '',
                chat_id: ''
            };

            setModels(prevModels => [...prevModels, newEntry]);

            try {
                await fetchEventSource(`${baseURL}ai-search/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Accept': 'text/event-stream',
                    },
                    body: JSON.stringify({
                        user_prompt: searchQuery,
                        is_new: models.length === 0,
                        chat_id: models.length !== 0 ? chatId : '',
                        regenerate_id: ''
                    }),
                    onopen(response) {
                        if (response.ok && response.status === 200) {
                            console.log("Connection made ", response);
                        } else if (
                            response.status >= 400 &&
                            response.status < 500 &&
                            response.status !== 429
                        ) {
                            console.log("Client-side error ", response);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    },
                    onmessage(event) {
                        try {
                            const data = JSON.parse(event.data);
                            newEntry = {
                                ...newEntry,
                                answers: newEntry.answers + (data.reply || ''),
                                result_id: data.result_id || newEntry.result_id,
                                chat_id: data.chat_id || newEntry.chat_id
                            };

                            setModels(prevModels => {
                                const updatedModels = [...prevModels];
                                updatedModels[updatedModels.length - 1] = newEntry;
                                return updatedModels;
                            });
                        } catch (error) {
                            console.error('Error parsing event data:', error);
                        }
                    },
                    onclose() {
                        console.log("Connection closed by the server");
                        setLoading(false);
                    },
                    onerror(err) {
                        console.log("There was an error from server", err);
                        setLoading(false);
                    },
                });

                setSearchQuery('');
            } catch (error) {
                console.error('Failed to fetch AI Search:', error);
                setLoading(false);
            }
        }
    };
    const [copied, setCopied] = useState(false);

    function handleCopyResponse(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            })
            .catch((error) => {
                console.error('Error copying text: ', error);
            });
    }

    const handleRegenerate = async (index, originalQuery, result_id) => {
        setPageLoading(true);
        setRefreshingIndices(prev => ({ ...prev, [index]: true }));
        try {
            const response = await dispatch(AISearch({
                user_prompt: originalQuery,
                is_new: false,
                chat_id: chatId,
                regenerate_id: result_id
            })).unwrap();
            const updatedEntry = {
                questions: originalQuery,
                answers: response.results.reply,
                result_id: response.searched_result_id,
                chat_id: chatId
            };
            setModels(models => models.map((model, idx) => idx === index ? updatedEntry : model));
        } catch (error) {
            console.error('Failed to regenerate AI Search:', error);
        }
        setPageLoading(false);
        setRefreshingIndices(prev => ({ ...prev, [index]: false }));
    };

    return (<>
        {showInfo && <Info showInfo={showInfo} setShowInfo={setShowInfo} />}
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
                                                    <div className='ques-ans' dangerouslySetInnerHTML={{ __html: model.answers }} />
                                                </div>
                                                <div className="button-group" style={{ marginLeft: "12px" }}>
                                                    <button className="generator-icon" onClick={() => handleRegenerate(index, model.questions, model.result_id)}>
                                                        {refreshingIndices[index] ? <AiOutlineLoading className="loading-icons" /> : <FaArrowRotateLeft />}
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
                                                        }, 2000);
                                                    }}>
                                                        <IoCopyOutline />
                                                    </button>
                                                    {
                                                        speaking ? (
                                                            <button className="generator-icon" onClick={stopSpeaking}>
                                                                <IoVolumeMuteSharp className="loading-icon" />
                                                            </button>
                                                        ) : (
                                                            <button className="generator-icon" onClick={() => startSpeaking(model.answers)}>
                                                                <FaVolumeHigh />
                                                            </button>
                                                        )
                                                    }
                                                    <button className="generator-icon" onClick={(event) => {
                                                        dispatch(edit_text(model));
                                                        navigate('/handouts')
                                                    }}><IoMdAddCircleOutline /></button>
                                                </div>
                                                <div id="copy-tooltip" className="tooltip">Copied!</div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="main-search mainpage-top">
                                        <form onSubmit={handleSubmit} className="d-flex">
                                            <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                                            <div className="button-container">
                                                <button onClick={handleSubmit} className="up-icon">
                                                    {loading ? <AiOutlineLoading className="loading-icons" size={35} /> : <IoArrowForwardCircleSharp size={35} className="icon-style" />}
                                                </button>
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
                                            <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                                            <div className="button-container">
                                                <button onClick={handleSubmit} className="up-icon">
                                                    {loading ? <AiOutlineLoading className="loading-icons" size={35} /> : <IoArrowForwardCircleSharp size={35} className="icon-style" />}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='col-md-2'></div>
                    <SearchHistory is_new={models.length === 0} setModels={setModels} setChatId={setChatId} />
                </div>
            )}
        </div>
    </>)
}

export default NewSearch;
