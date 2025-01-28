import React from "react";

function AnimationCard({ title, date, topics }) {
  return (

    <div className="relative w-full sm:w-[150px] lg:w-[250px] h-[148px] p-2 border-2 border-[#1D1D1F38] bg-white rounded-lg shadow-md">
      <div className="absolute w-full sm:w-[150px] lg:w-[250px] h-[148px] p-2 border-2 border-[#1D1D1F38] bg-white rounded-lg ">
        <div className="absolute w-full sm:w-[150px] lg:w-[250px] h-[148px] p-4 border-2 border-[#1D1D1F38] bg-white rounded-lg ">
          <h2 className="text-xl truncate h-14 text-wrap font-extrabold text-[#1D1D1F99]"
          // className="truncate"
          style={{
              // whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // maxWidth: "250px", // Adjust max width to control truncation
          }}
          
          
          >{title}</h2>
          <p className="text-sm text-[#1D1D1F99] mt-2">{date}</p>
          <p className="text-sm text-[#1D1D1F99] mt-1">{topics} Topics</p>
        </div>
      </div>
    </div>
  );
}

export default AnimationCard;