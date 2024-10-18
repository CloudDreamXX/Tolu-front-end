import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, onSubmit, loading, error }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const feedbackOptions = [
    { id: 'incorrect', label: 'Information was incorrect' },
    { id: 'irrelevant', label: 'Response was irrelevant' },
    { id: 'incomplete', label: 'Response was incomplete' },
    { id: 'unclear', label: 'Response was unclear' },
    { id: 'offensive', label: 'Content was inappropriate or offensive' },
    { id: 'other', label: 'Other issue' }
  ];

  const resetForm = () => {
    setSelectedOptions([]);
    setAdditionalFeedback('');
  };

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = () => {
    const selectedLabels = selectedOptions
      .map(optionId => {
        const option = feedbackOptions.find(opt => opt.id === optionId);
        return option ? option.label : '';
      })
      .filter(label => label);

    let combinedFeedback = '';

    if (selectedLabels.length > 0) {
      combinedFeedback += 'Selected issues:\n' + selectedLabels.join('\n');
    }

    if (additionalFeedback.trim()) {
      if (combinedFeedback) {
        combinedFeedback += '\n\nAdditional feedback:\n';
      }
      combinedFeedback += additionalFeedback.trim();
    }

    // If no feedback was provided, send "Feedback not provided"
    onSubmit(combinedFeedback || 'Feedback not provided');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h3>What was wrong with this response?</h3>
          <button className="close-button" onClick={handleClose}>
            <IoMdClose />
          </button>
        </div>

        <div className="feedback-modal-content">
          <div className="feedback-options">
            {feedbackOptions.map((option) => (
              <button
                key={option.id}
                className={`feedback-option-button ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Please provide additional details about your feedback (optional)..."
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            className="feedback-textarea"
          />

          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>

        <div className="feedback-modal-footer">
          <button
            className="cancel-button"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading className="loading-icons" />
            ) : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
