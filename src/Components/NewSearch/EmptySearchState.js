import React, { useState } from 'react';
import './EmptySearchState.css'
import { BsLightbulb } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

const EmptySearchState = ({ onQuestionSelect }) => {
    const [showMore, setShowMore] = useState(false);

    const initialQuestions = [
      "What lifestyle changes can reduce inflammation?",
      "What are the advantages and disadvantages of HRT?",
      "How to balance hormones naturally?",
      "What supplements help with menopause symptoms?"
    ];

    const additionalQuestions = [
      "What are the best exercises during menopause?",
      "How to manage stress?"
    ];

    const displayedQuestions = showMore
      ? [...initialQuestions, ...additionalQuestions]
      : initialQuestions;

    return (
      <div className="empty-search-container">
        <h2 className="questions-title"> <BsLightbulb /> Things to ask</h2>
        <div className="preset-questions-grid">
          {displayedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionSelect(question)}
              className="preset-question-button"
            >
              {question}
            </button>
          ))}
        </div>
        <button
          className="show-more-button"
          onClick={() => setShowMore(!showMore)}
        >
          <span>{showMore ? 'Show Less' : 'Get more ideas\n'}</span>
          <IoIosArrowDown />
        </button>
      </div>
    );
  };

  export default EmptySearchState;
