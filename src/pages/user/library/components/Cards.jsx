import React from 'react'

function Cards({ title, relatedBlog, date, readingTime, className }) {


    const cardsData = [
        {
            title: 'Title 1',
            relatedBlog: 'Blog 1',
            date: '22-02-2025',
            readingTime: '10 mins reading left',
        },
        {
            title: 'Title 2',
            relatedBlog: 'Blog 2',
            date: '23-02-2025',
            readingTime: '5 mins reading left',
        },
        {
            title: 'Title 3',
            relatedBlog: 'Blog 3',
            date: '24-02-2025',
            readingTime: '8 mins reading left',
        },
    ];


    return (
        <div
            className={`w-full sm:w-[200px] h-[148px] p-4 border border-[#008FF614] bg-white shadow-[#8484850A] rounded-r-lg flex flex-col ${className}`}
        >
            <div>
                <span className="text-2xl mb-4 font-bold text-[#1D1D1F99]">{title}</span>
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



