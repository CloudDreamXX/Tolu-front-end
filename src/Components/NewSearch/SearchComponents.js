import React, { useRef } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { IoMdAttach, IoMdClose } from "react-icons/io";
import './SearchComponents.css'
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const PostSearchBar = ({
  searchQuery,
  setSearchQuery,
  loading,
  handleSubmit,
  selectedFile,
  handleFileUpload,
  handleRemoveFile,
  fileInputRef
}) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    // <div className="main-search mainpage-top">
      <form onSubmit={handleSubmit} className="d-flex search-form-container-post">
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
                <IoMdAttach style={{ color: 'blue' }} />
                <span
                  className="file-remove-indicator"
                  onClick={handleRemoveFile}
                >
                  <IoMdClose />
                </span>
              </>
            ) : (
              <IoMdAttach />
            )}
          </button>
        </div>
        <textarea
          className="search-query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask followup..."
          rows={3}
          onKeyDown={handleKeyPress}
        />
        <div className="button-container">
          <button
            type="submit"
            className={`up-icon ${searchQuery.trim() ? 'active' : ''}`}
            disabled={!searchQuery.trim()}
          >
            {loading ? (
              <AiOutlineLoading className="loading-icons" size={35} />
            ) : (
              <FaRegArrowAltCircleUp color='black' size={25} />
            )}
          </button>
        </div>
      </form>
    // </div>
  );
};

const PreSearchBar = ({
  searchQuery,
  setSearchQuery,
  loading,
  handleSubmit,
  selectedFile,
  handleFileUpload,
  handleRemoveFile,
  fileInputRef
}) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    // <div className="main-search mainpage-top">
      <form onSubmit={handleSubmit} className="d-flex search-form-container">
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
                <IoMdAttach style={{ color: 'blue' }} />
                <span
                  className="file-remove-indicator"
                  onClick={handleRemoveFile}
                >
                  <IoMdClose />
                </span>
              </>
            ) : (
              <IoMdAttach />
            )}
          </button>
        </div>
        <textarea
          className="search-query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask anything..."
          rows={3}
          onKeyDown={handleKeyPress}
        />
        <div className="button-container">
          <button
            type="submit"
            className={`up-icon ${searchQuery.trim() ? 'active' : ''}`}
            disabled={!searchQuery.trim()}
          >
            {loading ? (
              <AiOutlineLoading className="loading-icons" size={35} />
            ) : (
              <FaRegArrowAltCircleUp color='black' size={25} />
            )}
          </button>
        </div>
      </form>
    // </div>
  );
};

export {PostSearchBar, PreSearchBar };
