// // export default InfoCard;
// import React from 'react';

// const InfoCard = ({ Icon, title, handleCardClick, description }) => {
//   return (
//     <section 
//       onClick={() => handleCardClick(description)}  // Trigger the parent's function
//       className="flex items-center gap-2 hover:bg-primary rounded-lg p-3 cursor-pointer"
//     >
//       <section>
//         {Icon && <Icon className="text-xl text-[#393838]" />}
//       </section>
//       <section>
//         <h3 className="text-sm font-semibold text-[#393838]">{title}</h3>
//         {/* Optionally display description if needed */}
//         {/* <p className="text-sm font-medium  text-[#1D1D1F80] mt-1">{description}</p> */}
//       </section>
//     </section>
//   );
// };

// export default InfoCard;
import React from "react";

const InfoCard = ({ Icon, title, handleCardClick, description, contentId }) => {
  return (
    <section
      onClick={() => handleCardClick({ contentId, description, title })} // Pass all data
      className="flex items-center gap-2 hover:bg-primary rounded-lg p-3 cursor-pointer"
    >
      {Icon && <Icon className="text-xl text-[#393838]" />}
      <section>
        <h3 className="text-sm font-semibold text-[#393838]">{title}</h3>
      </section>
    </section>
  );
};

export default InfoCard;
