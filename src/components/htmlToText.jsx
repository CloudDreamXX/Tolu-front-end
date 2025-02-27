import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import './HtmlContent.css';


const HtmlContent = ({contents}) => {
  const sanitizedHtml = DOMPurify.sanitize(contents);
  const content = parse(sanitizedHtml);

  return (
    <div className="html-content">
      {content}
    </div>
  );
};

export default HtmlContent;








// <HtmlContent contents={editData.content} />


// const navigate =useNavigate();

// const DashBoardHandle=()=>{
//   navigate('/admin')
// }



// <section onClick={DashBoardHandle} className='text-[#393838] w-full flex items-center justify-center bg-primary hover:bg-gray-500 cursor-pointer mb-2 p-2 rounded-lg text-sm font-semibold'>
// New Chat
// </section>