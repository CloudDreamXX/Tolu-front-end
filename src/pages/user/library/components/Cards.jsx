import React from "react";

function Cards({ title, relatedBlog, date, readingTime, className }) {
  return (
    <div
      className={` h-[148px] p-4 border border-[#008FF614] bg-white shadow-[#8484850A] rounded-lg flex flex-col ${className}`}
    >
      <div>
        <h2
          className="text-xl truncate h-10 text-wrap font-extrabold text-[#1D1D1F99]"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "250px",
          }}
        >
          {title}
        </h2>
      </div>
      <span className="mb-2 text-[#1D1D1F99]">{relatedBlog}</span>
      <span className="mb-2 text-[#1D1D1F99]">{date}</span>
      <div className="flex gap-1 items-center">
        <svg
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5724 0.945514C7.30383 -0.762194 3.26885 0.503036 1.56053 3.77172C-0.147791 7.0409 1.11805 11.0753 4.38673 12.7836C7.65592 14.4919 11.6903 13.2267 13.3986 9.95739C15.1069 6.68881 13.8417 2.65384 10.5724 0.945514ZM12.6285 9.55502C11.1424 12.3985 7.63308 13.499 4.78956 12.0135C1.94542 10.5274 0.845013 7.01806 2.33108 4.17393C3.81659 1.3304 7.32652 0.229996 10.17 1.71606C13.0136 3.20157 14.114 6.7115 12.6285 9.55502Z"
            fill="#1D1D1F"
            fillOpacity="0.6"
          />
          <path
            d="M10.4106 6.43022H7.91381V2.74963C7.91381 2.50953 7.71922 2.31494 7.47912 2.31494C7.23902 2.31494 7.04443 2.50953 7.04443 2.74963V6.86432C7.04443 7.10442 7.23902 7.29901 7.47912 7.29901H7.91381H10.4106C10.6507 7.29901 10.8453 7.10442 10.8453 6.86432C10.8447 6.62482 10.6507 6.43022 10.4106 6.43022Z"
            fill="#1D1D1F"
            fillOpacity="0.6"
          />
        </svg>

        <span className="text-[#1D1D1F99] text-xs font-medium">
          {readingTime}
        </span>
      </div>
    </div>
  );
}

export default Cards;
