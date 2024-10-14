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
import { AiOutlineLoading } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { AISearch, dislikeResponse } from '../../ReduxToolKit/Slice/userSlice';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import './NewSearch.css'
import SearchHistory from "../SearchHistory";
import { Info } from "../Signup/SignupComponents/Info";
import { edit_text } from '../../ReduxToolKit/Slice/EditedText';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { FaFileUpload } from 'react-icons/fa';

const baseURL = process.env.REACT_APP_BASE_URL;

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
    const dispatch = useDispatch();
    const scrollableDivRef = useRef(null);
    const [chatId, setChatId] = useState(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    // Function to handle starting the speech
    const startSpeaking = (message) => {
        if (window.speechSynthesis.speaking) {
            stopSpeaking(); // Optional: stop if already speaking when asked to speak again
        }
        // Remove HTML tags from the message
        const plainTextMessage = message.replace(/<\/?[^>]+(>|$)/g, "");
        const msg = new SpeechSynthesisUtterance(plainTextMessage);
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

    useEffect(() => {
        const handlePaste = (event) => {
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    setSelectedFile(blob);
                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/png") {
                setSelectedFile(file);
            } else {
                alert("Please select a valid PDF or image file (JPEG/PNG).");
            }
        }
    };

    const renderWelcomeMessage = () => (
        <div className="welcome-popup-overlay">
            <div className="welcome-popup">
                <h2>Welcome to VITA AI</h2>
                <p>
                    Where personalized wellness is at the heart of your journey! To help us provide the most accurate insights and support, we encourage you to share critical details like your age, gender, current symptoms, and any diagnosed conditions. The more we know, the more tailored your experience will be. Together, we can create a wellness path that's unique to you.
                </p>
                <p><strong>How can I help you today?</strong></p>
                <button className="close-welcome" onClick={() => setShowWelcome(false)}>
                    Get Started
                </button>
            </div>
        </div>
    );

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


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
                const formData = new FormData();
                formData.append('chat_message', JSON.stringify({
                    user_prompt: searchQuery,
                    is_new: models.length === 0,
                    chat_id: models.length !== 0 ? chatId : '',
                    regenerate_id: ''
                }));

                if (selectedFile) {
                    if (selectedFile.type === "application/pdf") {
                        formData.append('pdf', selectedFile);
                    } else {
                        formData.append('image', selectedFile);
                    }
                    console.log("File appended to form data:", selectedFile.name);
                }


                await fetchEventSource(`${baseURL}ai-search/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Accept': 'text/event-stream',
                    },
                    body: formData,
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
                                chat_id: data.chat_id || chatId
                            };
                            if (!chatId && data.chat_id) {
                                setChatId(data.chat_id);  // Set chatId if it's not set and we receive it
                            }

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
                        setSelectedFile(null);
                    },
                    onerror(err) {
                        console.log("There was an error from server", err);
                        setLoading(false);
                    },
                });

                setSearchQuery('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset file input
                }
            } catch (error) {
                console.error('Failed to fetch AI Search:', error);
                setLoading(false);
            }
        }
    };

    function handleCopyResponse(text) {
        const plainText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
        navigator.clipboard.writeText(plainText)
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

    const renderSearchForm = () => (
        <form onSubmit={handleSubmit} className="d-flex">
            <div className="file-upload-container">
                <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="file-upload-button"
                >
                {selectedFile ? (
                <>
                <FaFileUpload style={{ color: 'blue' }} />
                <span
                className="file-remove-indicator"
                onClick={handleRemoveFile}
                >
                <IoMdClose />
                </span>
                </>
                ) : (
                <FaFileUpload />
                )}
                </button>
            </div>
            <textarea
                className="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything..."
                rows={3}
                onKeyDown={(e) => handleKeyPress(e)}
            />
            <div className="button-container">
                <button type="submit" className="up-icon">
                    {loading ? <AiOutlineLoading className="loading-icons" size={35} /> : <IoArrowForwardCircleSharp size={35} className="icon-style" />}
                </button>
            </div>
        </form>
    );

    return (
        <>
            {showInfo && <Info showInfo={showInfo} setShowInfo={setShowInfo} />}
            {showWelcome && renderWelcomeMessage()}
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
                                            {renderSearchForm()}
                                        </div>
                                    </>
                                ) : (
                                    <div className='main'>
                                        <div>
                                            {buttonarray.map((button, index) => {
                                                let random = (index % 6) + 1;
                                                let class_name = "col" + random.toString();
                                                return (<button key={index} className={`${class_name} main-button`} >{button}</button>)
                                            })}
                                        </div>
                                        <div className="main-search maintop">
                                            {renderSearchForm()}
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
        </>
    );
}

export default NewSearch;
