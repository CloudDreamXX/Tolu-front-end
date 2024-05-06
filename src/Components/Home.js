import React, { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineEdit } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { GrDislike } from "react-icons/gr";
import { IoArrowForwardSharp } from "react-icons/io5";
import Editor from './Editor';

const Home = () => {
  let buttonarray=["IBS protocol","Eating for hormones","Seed rotation","Sleep hygiene","TBI lifestyle"]
  let searchhistory=[ "Today", "Search History","Search History","Search History","Search History","Search History","Search History","Yesterday","Search History","Search History","Search History","Search History","Search History","April 29",,"Search History","Search History","Search History","Search History"]

  let [editable,setEditable]=useState(false);

  let enable_editor = () => {
    console.log("editable : ",editable);
    setEditable(true);
  }

  
 
  return (
    <div className="container-fluid home">
     
      <div className="row main-box">
        
        <div className="col-md-5">
        <div className="box2">
         {/* { buttonarray.map(button => (<button className="generator-button">{button}</button>))} */}
         <div className="headertext">Top 5 searches this week</div>
          <button className="generator-button">IBS protocol</button>
          <button className="generator-button">Eating for hormones</button>
          <button className="generator-button">Seed rotation</button>
          <button className="generator-button">Sleep hygiene</button>
          <button className="generator-button">TBI lifestyle</button>
          <div class="form-control text-area">
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

          </div>
          <hr className="dashed-line"/>

          <button className="generator-icon" onClick={enable_editor}><MdOutlineEdit /></button>
          <button className="generator-icon"><BiSolidError /></button>
          <button className="generator-icon"><IoReloadSharp /></button>
          <button className="generator-icon"><GrDislike /></button>
        
          <div className="search-anything">
          <input className="search-query" placeholder="Ask anything... " />
          <div className="button-container" > <button className="up-icon" ><IoArrowForwardSharp /></button></div>
          <div><button className="gen-button"><GrAttachment /> Attach</button></div>
          </div>  
        
        </div>
        </div>

        <div className="col-md-5 box3">
          <Editor/>
        </div>

        <div className="col-md-2">
        <input type="search" className="search-container" placeholder="Find" />
        {searchhistory.map( search => <div className="history">{search}</div>)}
        </div>

      </div>
    </div>
  );
};

export default Home;
