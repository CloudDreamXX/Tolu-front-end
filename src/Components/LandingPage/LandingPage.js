import React from 'react'
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { useState,useEffect,useRef } from 'react';
import { Link } from "react-router-dom";
import './LandingPage.css'
import '../NewSearch/NewSearch.css'

let LandingPage = () => {
    let buttonarray=["Chronic Symptoms","Women's Health","Exercise","Lifestyle","Supplements","Lab Test","Herbs","Foods","and More..."]
    const [searchQuery, setSearchQuery] = useState('');
    const [searched,setSearched]=useState(false);

    let answer="Vita Guide When explaining the benefits of vinegar water for better digestion to someone who might not be familiar with it, it's helpful to keep things simple and relatable. Here's how you could approach it: Start with the Basics: Begin by mentioning that vinegar water is a simple mixture of vinegar and water. It's easy to make at home and doesn't require any special ingredients. Digestive Aid: Explain that vinegar water can help with digestion. Vinegar, especially apple cider vinegar, contains acetic acid, which can aid in breaking down food in the stomach, making it easier for the body to digest. Balancing pH: Mention that vinegar is acidic, but when consumed in diluted form with water, it can actually help balance the body's pH levels. This balance is important for optimal digestion and overall health. Reducing Bloating and Gas: Suggest that regularly drinking vinegar water may help reduce bloating and gas after meals. This is because it can support the natural digestive processes, preventing discomfort. Stimulating Digestive Enzymes: Explain that vinegar water may also stimulate the production of digestive enzymes in the stomach, which are essential for breaking down food and absorbing nutrients. Managing Blood Sugar Levels: Share that some studies suggest vinegar water may help manage blood sugar levels after meals, which can indirectly support digestive health by preventing spikes and crashes in energy levels. Cautions and Precautions: Lastly, remind them that while vinegar water can offer benefits, it's essential to consume it in moderation and to dilute it properly with water to avoid any potential side effects, such as irritation to the throat or stomach lining. By keeping the explanation straightforward and focusing on practical benefits, you can help your friend understand the advantages of incorporating vinegar water into her routine for better digestion."

    const [models,setModels]=useState([{
        questions:"",
        answers:""
    }])
    const scrollableDivRef = useRef(null);      

    useEffect(() => {
        scrollToBottom();
    }, [models]);


    const scrollToBottom = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if(searchQuery){
            setSearched(true);
            let tempmodel={
                questions:searchQuery,
                answers:answer
            }
            setModels([...models,tempmodel])
            setSearchQuery("");
        }
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        handleSubmit(event);
      }
    }

  return (
    <div className='container-fluid Landing-container'>
    <div className='row Landing-row'>
    <div className='col-lg-2'>
        <div className='Landing-signup'>
            <Link className='btn btn-dark' to="/signup">Sign Up</Link>
          <div className='Landing-signup-text-margin' ><Link className='Landing-signup-text' to="/auth"> Have an account ? Sign in</Link></div>
        </div>
    </div>
    <div className='col-lg-1'></div>
    { (searched) ? (<>
            <div className='col-lg-6'>
            <div className='searchpage-main'>
                <div  ref={scrollableDivRef} className='main-div-height'>
            {
                models.map((model,index)=>{
                    if(model.questions!== ""){
                        return(
                            <>
                            <React.Fragment key={index}>
                                        <div className='main-div'>
                                            <div className='display'><div className='user circle'></div><span className='text'> You</span></div>
                                            <div className='ques-ans'> {model.questions}</div>
                                        </div>
                                        <div className='main-div'>
                                            <div className='display'><div className='vita circle'></div><span className='text'> Vita Guide </span></div>
                                            <div className='ques-ans'> {model.answers}</div>
                                        </div>
                                    </React.Fragment>
                            </>
                        )
                    }
                })

            }
            </div>
                <div className="main-search maintop">
                    <form onSubmit={handleSubmit} className="d-flex">
                        {/*<input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " />*/}
                        <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                        <div className="button-container" > <button type="submit" className="up-icon" ><IoArrowForwardCircleSharp size={35} className="icon-style" /></button></div>
                        {/*<div><button className="gen-button"><GrAttachment /> Attach</button></div>*/}
                    </form>
                </div> 
            </div>
            </div>
           </>) : (<>
            <div className='col-lg-6'>
                <div className='landingmain'>
                    <div>
                    { buttonarray.map((button,index) => 
                        {
                            let random=(index%6)+1;
                            let class_name="col"+random.toString();
                            return(<button className={`${class_name} main-button`} >{button}</button>)
                        })}
                    </div>
                <div className="main-search  mainpage-top">
                   <form onSubmit={handleSubmit} className="d-flex">
                     {/*<input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " />*/}
                     <textarea className="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask anything... " rows={3} onKeyDown={(e) => handleKeyPress(e)} />
                     <div className="button-container" > <button className="up-icon" > <IoArrowForwardCircleSharp size={35} className="icon-style" /></button></div>
                     {/*<div><button type="submit" className="gen-button"><GrAttachment /> Attach</button></div>*/}
                   </form>
                    </div> 
                </div>
            </div>
           </>
            )}
        <div className='col-lg-3'></div>
    </div>
</div>

  )
}

export default LandingPage