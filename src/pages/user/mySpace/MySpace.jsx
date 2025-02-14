import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Cards from "../library/components/Cards";
import LibraryInput from "../library/components/LibraryInput";
import ModalManager from "../library/components/ModalManager";
import { useNavigate } from "react-router-dom";
import SingUpModal1 from "../../../components/modals/SingUpModal1";


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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [dropdownData, setDropdownData] = useState([]);
    const closeModal = () => {
        setModalOpen(false);
    };
    const navigate = useNavigate()
    const chatHandle = () => {
        navigate("/user/chat")
    }
    const handleCategoryClick = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    useEffect(() => {
        // setModalOpen(true)
        setIsModalOpen(true)
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const diseases = [
        { id: 1, name: "Diabetes" },
        { id: 2, name: "Hypertension (High Blood Pressure)" },
        { id: 3, name: "Asthma" },
        { id: 4, name: "Tuberculosis (TB)" },
        { id: 5, name: "Pneumonia" },
        { id: 6, name: "Arthritis" },
        { id: 7, name: "Dengue Fever" },
        { id: 8, name: "Hepatitis B" },
        { id: 9, name: "Malaria" },
        { id: 10, name: "COVID-19" },
        { id: 11, name: "Cancer" },
        { id: 12, name: "Heart Disease" },
        { id: 13, name: "Chronic Kidney Disease (CKD)" },
        { id: 14, name: "Alzheimer’s Disease" },
        { id: 15, name: "Migraine" }
    ];

const onCloseHandle =()=>{
    setIsModalOpen(false)
    setModalOpen(true)
}


    return (
        <>
            {modalOpen && (
                <ModalManager
                    setModalOpen={setModalOpen}
                    setDropdownData={setDropdownData}
                    closeModal={closeModal}
                    categories={diseases}

                />
            )}

            {isModalOpen && (
                <SingUpModal1
                    isModalOpen={isModalOpen}
                    categories={diseases} // Pass categories (diseases)
                    selectedCategories={selectedCategories}
                    onCategoryClick={handleCategoryClick}
                    onClose={onCloseHandle}
                />
            )}
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
            <div className="mt-[50px] flex justify-center max-w-[1000px] mx-auto pb-5" onClick={chatHandle}>
                <a href="/user/chat" className=""></a>
                <LibraryInput />
            </div>
        </>
    );
}

export default MySpace;
