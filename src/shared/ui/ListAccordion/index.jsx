import { useState } from "react";
import classNames from 'classnames';
import { IoChevronDown } from "react-icons/io5";
import DynamicList from "../DynamicList";
import { getCountCondition, getLinkCondition } from "./utils";

function ListAccordion({ title, items, type }) {
	const [isOpen, setIsOpen] = useState(true);	
	const countCondition = getCountCondition(title, items?.length || 0);
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
					linkTo={(item) => getLinkCondition(item, type)}
				/>
			}
    </div>
  );
}

export default ListAccordion;