import React from 'react'
import Cards from './components/Cards'
import AnimationCard from './components/AnimationCard';

function Library() {


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
    
  ];



  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {cardsData.map((card, index) => (
          <Cards
            key={index}
            title={card.title}
            relatedBlog={card.relatedBlog}
            date={card.date}
            readingTime={card.readingTime}
            className="sm:w-[250px] lg:w-[300px]" 
          />
        ))}
      </div>



      <div className="flex items-center justify-center  bg-gray-100">
      <AnimationCard title="Neuro System Health" date="22-02-2025" topics={10} />
    </div>
    </div>
  )
}

export default Library