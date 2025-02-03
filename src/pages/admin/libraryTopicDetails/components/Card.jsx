import React from "react";

const data = [
    { id: 1, title: "Breaking Down Barriers to Mental Wellness", description: "This is the first card description.", author: "John Doe" },
    { id: 2, title: "Card 2", description: "This is the second card description.", author: "Jane Smith" },
    { id: 3, title: "Card 3", description: "This is the third card description.", author: "Alice Brown" },
    { id: 4, title: "Card 4", description: "This is the fourth card description.", author: "Robert Wilson" },
    { id: 5, title: "Card 5", description: "This is the fifth card description.", author: "Emma Johnson" },
];

function CardList({ title, description, author }) {
    return (
        <div className="bg-white p-4  border  shadow-[#8484850A] rounded-lg">
            <h2 className="font-bold text-base text-[#1D1D1F99]">{title}</h2>
            <p className="mt-2 text-gray-500 text-sm">By: {author}</p>
            <p className="mt-2 text-gray-500 text-sm">{description}</p>
        </div>
    );
}

function Card() {
    return (
        <div className="grid  gap-4">
            {data.map((item) => (
                <CardList key={item.id} title={item.title} description={item.description} author={item.author} />
            ))}
        </div>
    );
}

export default Card;
