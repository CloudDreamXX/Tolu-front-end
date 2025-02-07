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
    // { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    // { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    // { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    // { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
    // { title: "Serverless Applications", date: "2025-03-10", topics: 5 },
  ];
  useEffect(() => {
    setModalOpen(true)
  }, [])

  const closeModal = () => {
    setModalOpen(false);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('File selected:', file);
  };

  const handleFileCardClick = () => {
    document.getElementById('file-input').click();
  };


  const handleSubmitValue = (value) => {
    alert(`Submitted Value: ${value}`);
  };

  const handleFileUpload = (file) => {
    console.log("Uploaded File:", file.name);
    alert(`File Uploaded: ${file.name}`);
  };




  return (

    <div className='w-full h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] p-2'>

      {modalOpen && (
        <ModalManager
          setModalOpen={setModalOpen}
          setDropdownData={setDropdownData}
          closeModal={closeModal}

        />
      )}
      <div className='h-[450px] overflow-auto'>

        {/* <div className='w-full h-[calc(100vh-200px)] sm:h-[calc(100vh-150px)] overflow-auto p-2'> */}
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

        <div className="grid gap-4 gap-y-10 mt-8 h-[250px] overflow-y-auto xs:grid-cols-1 xs:p-16 md:p-0  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 ">
          {webinars.map((webinar, index) => (
            <AnimationCard
              key={`webinar-${index}`}
              title={webinar.title}
              date={webinar.date}
              topics={webinar.topics}
            />
          ))}
        </div>
      </div>

      {/* </div> */}
      <section className='w-full pt-4 flex items-center justify-center '>
        <div className='"w-[90%] sm:w-[85%] md:w-[75%] lg:w-[80%]"'>
          <LibraryInput
            placeholder="Ask anything..."
            onChangeValue={handleInputChange}
            onSubmitValue={handleSubmitValue}
            onFileUpload={handleFileUpload}
          />
        </div>
      </section>
    </div>



  )
}

export default Library