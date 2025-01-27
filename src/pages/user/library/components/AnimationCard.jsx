import React from 'react'

function AnimationCard({ title, date, topics }) {
    return (
        <div className="relative max-w-sm p-4 bg-white rounded-2xl shadow-md">
          <div className="absolute inset-0 -z-10 rounded-2xl border border-gray-300" />
          <div className="absolute inset-1 -z-20 rounded-2xl border border-gray-200" />
          <div className="absolute inset-2 -z-30 rounded-2xl border border-gray-100" />
          
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-2">{date}</p>
          <p className="text-sm text-gray-600 mt-1">{topics} Topics</p>
        </div>
      );
}

export default AnimationCard






// import React from "react";

// export default function Card({ title, date, topics }) {
//   return (
//     <div className="relative max-w-sm p-4 bg-white rounded-2xl shadow-md">
//       {/* Outer Borders */}
//       <div className="absolute inset-0 -z-10 rounded-2xl border border-gray-300" />
//       <div className="absolute inset-1 -z-20 rounded-2xl border border-gray-200" />
//       <div className="absolute inset-2 -z-30 rounded-2xl border border-gray-100" />
      
//       {/* Content */}
//       <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//       <p className="text-sm text-gray-500 mt-2">{date}</p>
//       <p className="text-sm text-gray-600 mt-1">{topics} Topics</p>
//     </div>
//   );
// }
