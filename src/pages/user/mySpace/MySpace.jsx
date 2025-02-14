import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Cards from "../library/components/Cards";
import LibraryInput from "../library/components/LibraryInput";

const blogs = [
  {
    title: "Title",
    related: "Related Blog",
    date: "22-02-2025",
    readingTime: "10 mins reading left",
  },
  {
    title: "Title",
    related: "Related Blog",
    date: "22-02-2025",
    readingTime: "10 mins reading left",
  },
  {
    title: "Title",
    related: "Related Blog",
    date: "22-02-2025",
    readingTime: "10 mins reading left",
  },
  {
    title: "Title",
    related: "Related Blog",
    date: "22-02-2025",
    readingTime: "10 mins reading left",
  },
  {
    title: "Title",
    related: "Related Blog",
    date: "22-02-2025",
    readingTime: "10 mins reading left",
  },
];

function MySpace() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="pt-5"></div>
      <div className="h-full m-6 border p-6 rounded-lg">
        <section
          className="flex justify-between text-2xl font-bold cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Learning</span>
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </section>
        {isOpen && (
          <section className="mt-4">
            <h6 className="text-base lg:text-xl text-[#1D1D1F99] font-bold">
              Continue Reading
            </h6>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
              {blogs.map((item, i) => (
                <Cards
                  key={i}
                  title={item.title}
                  date={item.date}
                  readingTime={item.readingTime}
                  relatedBlog={item.related}
                />
              ))}
            </div>
            {/* Saved Topics  */}
            <h6 className="text-base lg:text-xl text-[#1D1D1F99] font-bold mt-5">
              Saved Topics
            </h6>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
              {blogs.map((item, i) => (
                <Cards
                  key={i}
                  title={item.title}
                  date={item.date}
                  readingTime={item.readingTime}
                  relatedBlog={item.related}
                />
              ))}
            </div>
            {/* Finished Topicse */}
            <h6 className="text-base lg:text-xl text-[#1D1D1F99] font-bold mt-5">
              Finished Topicse
            </h6>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
              {blogs.map((item, i) => (
                <Cards
                  key={i}
                  title={item.title}
                  date={item.date}
                  readingTime={item.readingTime}
                  relatedBlog={item.related}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="mt-[50px] flex justify-center max-w-[1000px] mx-auto pb-5">
        <LibraryInput />
      </div>
    </>
  );
}

export default MySpace;
