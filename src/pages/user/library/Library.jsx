import React, { useEffect, useState } from 'react'
import Cards from './components/Cards'
import AnimationCard from './components/AnimationCard';
import { FaArrowUp } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import LibraryInput from './components/LibraryInput';
import ModalManager from './components/ModalManager';

function Library() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  // const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);
  console.log("iou8y7t6utudychg", dropdownData);

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
    {
      title: 'Title 2',
      relatedBlog: 'Blog 2',
      date: '23-02-2025',
      readingTime: '5 mins reading left',
    },
    {
      title: 'Title 2',
      relatedBlog: 'Blog 2',
      date: '23-02-2025',
      readingTime: '5 mins reading left',
    },
    {
      title: 'Title 2 Title 2 Title 2Title 2',
      relatedBlog: 'Blog 2',
      date: '23-02-2025',
      readingTime: '5 mins reading left',
    },



  ];

  const webinars = [
    { title: "Next.js in Action", date: "2025-03-01", topics: 7 },
    { title: "GraphQL for Beginners", date: "2025-03-05", topics: 6 },
    { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
  ];
  useEffect(() => {
    setModalOpen(true)
  }, [])

  return (
    <>
      {modalOpen && (
        <ModalManager
          setModalOpen={setModalOpen}
          setDropdownData={setDropdownData}
        />
      )}
      <div className='w-full h-full p-2'>
        <div className="grid gap-6 h-[400px] overflow-y-auto sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {cardsData.map((card, index) => (
            <Cards
              key={index}
              title={card.title}
              relatedBlog={card.relatedBlog}
              date={card.date}
              readingTime={card.readingTime}
              className="w-full"
            />
          ))}
        </div>



        <div className="grid gap-4 gap-y-8 mt-8 h-[400px] overflow-y-auto  sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 ">
          {/* <AnimationCard title="Neuro System Health" date="22-02-2025" topics={10} /> */}
          {webinars.map((webinar, index) => (
            <AnimationCard
              key={`webinar-${index}`}
              title={webinar.title}
              date={webinar.date}
              topics={webinar.topics}
            />
          ))}
        </div>
        {/* <div className="flex justify-center items-center h-screen bg-gray-100"> */}
        {/* <LibraryInput placeholder="Ask anything..." /> */}
        <section className='w-full flex items-center justify-center '>

          <div className='"w-[90%] sm:w-[85%] md:w-[75%] lg:w-[80%]"'>

            <LibraryInput
              placeholder="Search here..."
            // width="w-[90%] sm:w-[85%] md:w-[75%] lg:w-[80%]"
            // height="h-[125px]"
            />
          </div>
        </section>

        {/* </div> */}
      </div>
    </>

  )
}

export default Library