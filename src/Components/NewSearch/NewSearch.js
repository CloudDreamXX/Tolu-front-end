import React, { useState, useEffect, useRef } from 'react';
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { FaVolumeHigh } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { useLocation } from 'react-router-dom';
import { IoVolumeMuteSharp } from "react-icons/io5";
import { AiOutlineLoading } from 'react-icons/ai';
import { RiDeleteBin2Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import SearchHistory from "../SearchHistory";
import { AISearch, rateResponse, reportResponse, deleteChat } from '../../ReduxToolKit/Slice/userSlice';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import './NewSearch.css'
import { Info } from "../Signup/SignupComponents/Info";
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import FeedbackModal from '../FeedbackModal';
import EmptySearchState from './EmptySearchState';
import { CiImageOn } from "react-icons/ci";
import { MdFeaturedVideo } from "react-icons/md";
import { LuArrowRightFromLine } from "react-icons/lu";
import { IoMdAttach } from "react-icons/io";
import { PostSearchBar, PreSearchBar } from './SearchComponents';
import { MdOutlineMessage } from "react-icons/md";

const baseURL = process.env.REACT_APP_BASE_URL;

const NewSearch = () => {
    // const buttonarray = ["Chronic Symptoms", "Women's Health", "Exercise", "Lifestyle", "Supplements", "Lab Test", "Herbs", "Foods", "and More..."];
    const [searchQuery, setSearchQuery] = useState('');
    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshingIndices, setRefreshingIndices] = useState({});
    const location = useLocation();
    const [showInfo, setShowInfo] = useState(location.state?.showInfo || false);
    const [models, setModels] = useState([]);
    const [speaking, setSpeaking] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scrollableDivRef = useRef(null);
    const [chatId, setChatId] = useState(null);
    const [setCopied] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [likedResults, setLikedResults] = useState({});
    const [dislikedResults, setDislikedResults] = useState({});
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState(null);
    const [feedbackError, setFeedbackError] = useState(null);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [latestChat, setLatestChat] = useState(null);
    const [isDeletingChat, setIsDeletingChat] = useState(false);
    const shouldShowWelcome = showWelcome && models.length === 0;


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



    // clicking the search result in sidebar or search history page will open in new search page
    useEffect(() => {
        if (location.state?.searchResults) {
            setModels(location.state.searchResults);
            setChatId(location.state.selectedChatId);
            // Clear the location state to prevent re-loading on refresh
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);


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

    const handleDeleteChat = async () => {
        if (!chatId || isDeletingChat) return;

        if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
            setIsDeletingChat(true);
            try {
                await dispatch(deleteChat(chatId)).unwrap();
                navigate('/newsearch', { replace: true });
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete chat:', error);
                alert('Failed to delete chat. Please try again.');
            } finally {
                setIsDeletingChat(false);
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

    const handleNewSearch = () => {
        setModels([]);
        setChatId(null);
        setSearchQuery('');
        setSelectedFile(null);
        setShowWelcome(true);
        navigate('/newsearch', { replace: true });
    };

    const renderDeleteButton = () => {
        if (chatId && models.length > 0) {
            return (
                <div className="action-buttons-group">
                    <button
                        onClick={handleNewSearch}
                        className="new-search-button"
                        title="New search"
                    >
                        <SlNote size={15} />
                        {'New Search'}
                    </button>
                    <button
                        onClick={handleDeleteChat}
                        disabled={isDeletingChat}
                        className="delete-chat-button"
                        title="Delete this chat"
                    >
                        <RiDeleteBin2Line size={15} />
                        {isDeletingChat ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            );
        }
        return null;
    };

    const renderQuestion = (question, file) => {
        return (
            <div>
                <div>{question}</div>
                {file && (
                    <div className="file-attachment">
                        <IoMdAttach />
                        <span>{file.name}</span>
                    </div>
                )}
            </div>
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery) {
            setLoading(true);

            let newEntry = {
                questions: searchQuery,
                answers: '',
                result_id: '',
                chat_id: models.length === 0 ? null : chatId, // Set chatId to null for the first query
                attachedFile: selectedFile
            };

            setModels(prevModels => [...prevModels, newEntry]);

            try {
                const formData = new FormData();
                formData.append('chat_message', JSON.stringify({
                    user_prompt: searchQuery,
                    is_new: models.length === 0, // Indicate if it's a new chat
                    chat_id: models.length !== 0 ? chatId : '', // Pass an empty string for the first query
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
                    openWhenHidden: true,
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
                            if (data.searched_result_id) {
                                newEntry.result_id = data.searched_result_id;
                            }
                            newEntry = {
                                ...newEntry,
                                answers: newEntry.answers + (data.reply || ''),
                                result_id: data.searched_result_id || newEntry.searched_result_id,
                                chat_id: data.chat_id || chatId,
                            };
                            if (data.chat_id && !chatId) {
                                setLatestChat({
                                    chat_id: data.chat_id,
                                    query: searchQuery,
                                    chat_title: searchQuery
                                });
                                setChatId(data.chat_id);
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

        // Create a copy of the existing entry
        let regeneratedEntry = {
            questions: originalQuery,
            answers: '',
            result_id: '',
            chat_id: chatId
        };

        // Update the models array immediately with the empty response
        setModels(prevModels => prevModels.map((model, idx) =>
            idx === index ? regeneratedEntry : model
        ));

        try {
            const formData = new FormData();
            formData.append('chat_message', JSON.stringify({
                user_prompt: originalQuery,
                is_new: false,
                chat_id: chatId,
                regenerate_id: result_id
            }));

            await fetchEventSource(`${baseURL}ai-search/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'text/event-stream',
                },
                body: formData,
                onopen(response) {
                    if (response.ok && response.status === 200) {
                        console.log("Regeneration connection made ", response);
                    } else if (
                        response.status >= 400 &&
                        response.status < 500 &&
                        response.status !== 429
                    ) {
                        console.log("Client-side error during regeneration ", response);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                },
                onmessage(event) {
                    try {
                        const data = JSON.parse(event.data);
                        regeneratedEntry = {
                            ...regeneratedEntry,
                            answers: regeneratedEntry.answers + (data.reply || ''),
                            result_id: data.searched_result_id || regeneratedEntry.result_id,
                            chat_id: data.chat_id || chatId,
                        };

                        setModels(prevModels => prevModels.map((model, idx) =>
                            idx === index ? regeneratedEntry : model
                        ));
                    } catch (error) {
                        console.error('Error parsing regeneration event data:', error);
                    }
                },
                onclose() {
                    console.log("Regeneration connection closed by the server");
                    setPageLoading(false);
                    setRefreshingIndices(prev => ({ ...prev, [index]: false }));
                },
                onerror(err) {
                    console.log("There was an error during regeneration", err);
                    setPageLoading(false);
                    setRefreshingIndices(prev => ({ ...prev, [index]: false }));
                },
            });

        } catch (error) {
            console.error('Failed to regenerate response:', error);
            setPageLoading(false);
            setRefreshingIndices(prev => ({ ...prev, [index]: false }));
        }
    };


    const handlePresetQuestion = (question) => {
        setSearchQuery(question);
        handleSubmit({ preventDefault: () => { } });
    };

    const handleRating = async (result_id, rating) => {
        const payload = {
            result_id: result_id,
            vote: rating
        };

        try {
            await dispatch(rateResponse(payload)).unwrap();
            if (rating === 'liked') {
                setLikedResults(prev => ({ ...prev, [result_id]: true }));
                setDislikedResults(prev => {
                    const newState = { ...prev };
                    delete newState[result_id];
                    return newState;
                });
            }
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    };

    const handleDislike = (result_id) => {
        setSelectedResultId(result_id);
        setShowFeedbackModal(true);
        setFeedbackError(null);
    };

    const handleFeedbackSubmit = async (feedback) => {
        setIsSubmittingFeedback(true);
        setFeedbackError(null);

        try {
            // First submit the report
            await dispatch(reportResponse({
                result_id: selectedResultId,
                feedback: feedback
            })).unwrap();

            // Then submit the dislike
            await dispatch(rateResponse({
                result_id: selectedResultId,
                vote: 'disliked'
            })).unwrap();

            // Update local state
            setDislikedResults(prev => ({ ...prev, [selectedResultId]: true }));
            setLikedResults(prev => {
                const newState = { ...prev };
                delete newState[selectedResultId];
                return newState;
            });

            // Close modal and clean up
            setShowFeedbackModal(false);
            setSelectedResultId(null);
        } catch (error) {
            setFeedbackError(error.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleFeedbackModalClose = () => {
        setShowFeedbackModal(false);
        setSelectedResultId(null);
        setFeedbackError(null);
    };


    const renderSearchBar = () => {
        const props = {
            searchQuery,
            setSearchQuery,
            loading,
            handleSubmit,
            selectedFile,
            handleFileUpload,
            handleRemoveFile,
            fileInputRef
        };

        return models.length > 0 ? (
            <PostSearchBar {...props} />
        ) : (
            <PreSearchBar {...props} />
        );
    };

    return (
        <>
            {showInfo && <Info showInfo={showInfo} setShowInfo={setShowInfo} />}
            {renderDeleteButton()}
            {shouldShowWelcome && renderWelcomeMessage()}
            <div id="wrapper">
                <div className="container-fluid bg-white">
                    {pageLoading ? (
                        <div className="loading-overlay">
                            <FiLoader className="loading-icon big-loader" />
                        </div>
                    ) : (
                        <div className='row'>
                            <div className='col-lg-3'></div>
                            <div className='col-lg-7'>
                            <div className='searchpage-main'>
                            <div></div>
                                    {models.length > 0 ? (
                                        <>
                                            <div ref={scrollableDivRef} className='main-div-height'>
                                                {models.map((model, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className='main-div'>
                                                            <div className='display'><MdOutlineMessage size={18}/><span className='text'>&nbsp; Question</span></div>
                                                            <div className='ques-ans'> {renderQuestion(model.questions, model.attachedFile)}</div>
                                                        </div>
                                                        <div className='main-div'>
                                                            <div className='display'><MdOutlineMessage size={18}/><span className='text'>&nbsp; Answer</span></div>
                                                            <div className='ques-ans' dangerouslySetInnerHTML={{ __html: model.answers }} />
                                                        </div>
                                                        <div className="button-group" style={{ }}>
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
                                                                <span STYLE="font-size:4mm">Copy</span>
                                                            </button>
                                                            {
                                                                speaking ? (
                                                                    <button className="generator-icon" onClick={stopSpeaking}>
                                                                        <IoVolumeMuteSharp className="loading-icon" />
                                                                    </button>
                                                                ) : (
                                                                    <button className="generator-icon" onClick={() => startSpeaking(model.answers)}>
                                                                        <FaVolumeHigh />
                                                                        <span STYLE="font-size:4mm">      Read</span>
                                                                    </button>
                                                                )
                                                            }

                                                            {likedResults[model.result_id] ? (
                                                                <button className="generator-icon liked">
                                                                    <BiSolidLike />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="generator-icon"
                                                                    onClick={() => handleRating(model.result_id, 'liked')}
                                                                    disabled={dislikedResults[model.result_id]}
                                                                >
                                                                    <BiLike />
                                                                    <span STYLE="font-size:4mm">      Like</span>
                                                                </button>
                                                            )}

                                                            {dislikedResults[model.result_id] ? (
                                                                <button className="generator-icon disliked">
                                                                    <BiSolidDislike />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="generator-icon"
                                                                    onClick={() => handleDislike(model.result_id)}
                                                                    disabled={likedResults[model.result_id]}
                                                                >
                                                                    <BiDislike />
                                                                    <span STYLE="font-size:4mm">      Dislike</span>
                                                                </button>
                                                            )}


                                                            <button className="generator-icon" onClick={() => handleRegenerate(index, model.questions, model.result_id)}>
                                                                {refreshingIndices[index] ? <AiOutlineLoading className="loading-icons" /> : <FaArrowRotateLeft />}
                                                                <span STYLE="font-size:4mm">      Redo</span>
                                                            </button>
                                                            {/* <button className="generator-icon" onClick={(event) => {
                                                            dispatch(edit_text(model));
                                                            navigate('/handouts')
                                                        }}><IoMdAddCircleOutline /></button> */}
                                                        </div>
                                                        <div id="copy-tooltip" className="tooltip">Copied!</div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <div className="main-search mainpage-top">
                                                {renderSearchBar()}
                                            </div>

                                        </>
                                    ) : (
                                        <div className='main'>
                                            {/* <div>
                                            {buttonarray.map((button, index) => {
                                                let random = (index % 6) + 1;
                                                let class_name = "col" + random.toString();
                                                return (<button key={index} className={`${class_name} main-button`} >{button}</button>)
                                            })}
                                        </div> */}
                                            <div className="main-search maintop">
                                                {renderSearchBar()}
                                            </div>
                                            <EmptySearchState onQuestionSelect={handlePresetQuestion} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* <SearchHistory is_new={models.length === 0} setModels={setModels} setChatId={setChatId} latestChat={latestChat} /> */}
                        </div>
                    )}
                </div>
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={handleFeedbackModalClose}
                    onSubmit={handleFeedbackSubmit}
                    loading={isSubmittingFeedback}
                    error={feedbackError}
                />
                    {models.length > 0 && (
                        <div className='action-buttons-group'>
                        <button
                            className="show-images-button"
                            onClick={() => {
                                const lastQuery = models[models.length - 1].questions.trim();
                                if (lastQuery) {
                                    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(lastQuery)}`, '_blank');
                                }
                            }}
                        >
                            <CiImageOn size={15} />
                            {'Related images\n'}
                            <LuArrowRightFromLine size={15} />
                        </button>
                        </div>
                    )}

                    {models.length > 0 && (
                        <div className='action-buttons-group'>
                        <button
                            className="show-videos-button"
                            onClick={() => {
                                const lastQuery = models[models.length - 1].questions.trim();
                                if (lastQuery) {
                                    window.open(`https://www.google.com/search?${encodeURIComponent(lastQuery)}=en&q=${encodeURIComponent(lastQuery)}&tbm=vid`, '_blank');
                                }
                            }}
                        >
                            <MdFeaturedVideo size={15} />
                            {'Related Videos\n'}
                            <LuArrowRightFromLine size={15} />
                        </button>
                        </div>
                    )}
                    </div>
        </>
    );
}

export default NewSearch;
