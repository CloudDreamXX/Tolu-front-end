import React, { useState, useRef, useEffect } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { FaVolumeHigh } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
// import { BiDislike } from "react-icons/bi";
// import { BiSolidDislike } from "react-icons/bi";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { AiOutlineLoading } from 'react-icons/ai';
import { IoVolumeMuteSharp } from "react-icons/io5";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { useDispatch,useSelector} from 'react-redux';
import { AISearch, rateResponse } from "../ReduxToolKit/Slice/userSlice";
import Editor from './Editor';
import SearchHistory from "./SearchHistory";


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [refreshingIndices, setRefreshingIndices] = useState({});
  const [searched, setSearched] = useState(false);
  const [dislikedResults, setDislikedResults] = useState({});
  const [likedResults, setLikedResults] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);  // State to track if it's currently speaking
  const edit_text=useSelector((state)=>state.editable_text.value)

  useEffect(()=>{
    if(edit_text){
      setModels(prevModels => [...prevModels, edit_text]);
    //  setModels([...models,edit_text])
    }
  },[])

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  const [chatId, setChatId] = useState(null);

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



  const handleSubmit = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await dispatch(AISearch({
        user_prompt: searchQuery,
        is_new: !searched,
        chat_id: models.length !== 0 ? chatId : '',
        regenerate_id: ""
      })).unwrap();
      const newEntry = {
        questions: searchQuery,
        answers: response.results.reply,
        result_id: response.searched_result_id,
        chat_id: response.chat_id
      };
      if (models.length === 0){
          setChatId(response.chat_id);
      }

      setModels(prevModels => [...prevModels, newEntry]);
      setSearched(true);
      setSearchQuery("");
    } catch (error) {
      console.error('Failed to fetch AI Search:', error);
    } finally {
      setLoading(false);
    }
  };
  // const handleDislike = async (result_id) => {
  //   console.log(result_id)
  //   const payload = {
  //     result_id: result_id,
  //     vote: true
  //   };
  //   try {
  //     await dispatch(dislikeResponse(payload)).unwrap();
  //     setDislikedResults(prev => ({ ...prev, [result_id]: true }));
  //   } catch (error) {
  //     console.error('Failed to submit dislike:', error);
  //   }
  // };
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
      } else {
        setDislikedResults(prev => ({ ...prev, [result_id]: true }));
        setLikedResults(prev => {
          const newState = { ...prev };
          delete newState[result_id];
          return newState;
        });
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

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

              {models.length === 0 ? (
                <>
                  <div className="headertext">Top 5 searches this week</div>
                  <div className="gen-btn">
                    <button className="generator-button" style={{ backgroundColor: "rgb(254, 226,224)" }}>IBS protocol</button>
                    <button className="generator-button" style={{ backgroundColor: "rgb(234, 254,225)" }}>Eating for hormones</button>
                    <button className="generator-button" style={{ backgroundColor: "rgb(225, 243,254)" }}>Seed rotation</button>
                    <button className="generator-button" style={{ backgroundColor: "rgb(255, 247,225)" }}>Sleep hygiene</button>
                    <button className="generator-button" style={{ backgroundColor: "rgb(240, 225,254)" }}>TBI lifestyle</button>
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
                  <div ref={scrollableDivRef} className='main-div-height'>
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
                          <button className="generator-icon" onClick={() => handleRegenerate(index, model.questions, model.result_id)}>
                            {refreshingIndices[index] ? <FiLoader className="loading-icon" /> : <FaArrowRotateLeft />}
                          </button>
                          {/* {dislikedResults[model.result_id] ?
                            <button className="generator-icon"><BiSolidDislike /></button> :
                            <button className="generator-icon" onClick={() => handleDislike(model.result_id)}><BiDislike /></button>
                          } */}
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
        </button>
      )}

      {dislikedResults[model.result_id] ? (
        <button className="generator-icon disliked">
          <BiSolidDislike />
        </button>
      ) : (
        <button
          className="generator-icon"
          onClick={() => handleRating(model.result_id, 'disliked')}
          disabled={likedResults[model.result_id]}
        >
          <BiDislike />
        </button>
      )}
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


                        </div>
                        <div id="copy-tooltip" className="tooltip">Copied!</div>
                      </>
                    ))}
                  </div>
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
                    {loading ? <AiOutlineLoading size={35} className="loading-icons"/> :  <IoArrowForwardCircleSharp size={35} className="icon-style" />}
                  </button>
                </div>
              </div>


            </div>

          </div>
          <div className="col-md-5">
            <Editor />
          </div>
          <SearchHistory is_new={models.length === 0} setModels={setModels} setChatId={setChatId}/>

        </div>


        // </div>
      )}
    </div>

  );
};

export default Home;
