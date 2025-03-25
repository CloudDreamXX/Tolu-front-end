import { useState } from "react";
import classNames from 'classnames';
import { IoChevronDown } from "react-icons/io5";
import DynamicList from "../DynamicList";

function ListAccordion({ title, items }) {
	const [isOpen, setIsOpen] = useState(true);
	const countConditionMap = {
    "Continue Reading": 8,
    "Personalized for you": 4,
    "Explore new topics": 3,
  };
	const countCondition = countConditionMap[title] || items?.length;

	const handleToggle = () => {
		setIsOpen(prev => !prev);
	}

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between" onClick={handleToggle}>
				<h2 className="text-2xl font-bold mb-4">{title}</h2>
				<IoChevronDown 
					className={classNames(
						"transition-transform duration-300 cursor-pointer",
						{ "rotate-180": isOpen }
					)}
				/>
			</div>
			{isOpen && 
				<DynamicList 
					items={items || []}
					initialCount={countCondition} 
					type={title === "Continue Reading" || title === "Personalized for you" ? "library" : ""}
					linkTo='/librarynew}'
				/>
			}
    </div>
  );
}

export default ListAccordion;