import React from 'react'

function Cards({ title, relatedBlog, date, readingTime, className }) {




    return (
        <div
            className={` h-[148px] p-4 border border-[#008FF614] bg-white shadow-[#8484850A] rounded-lg flex flex-col ${className}`}
        >
            <div>

                <h2 className="text-xl truncate h-10 text-wrap font-extrabold text-[#1D1D1F99]"

                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "250px",
                    }}


                >{title}</h2>
            </div>
            <div>
                <span className="mb-4 text-[#1D1D1F99]">{relatedBlog}</span>
            </div>
            <div>
                <span className="mb-4 text-[#1D1D1F99]">{date}</span>
            </div>
            <div>
                <span className="text-[#1D1D1F99]">{readingTime}</span>
            </div>
        </div>
    );
}

export default Cards



