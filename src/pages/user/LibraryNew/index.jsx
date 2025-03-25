import { useState } from "react";
import { mock } from "./mock";
import { IoBookOutline } from "react-icons/io5";
import { Title } from "../../../shared/ui/Title";
import ListAccordion from "../../../shared/ui/ListAccordion";
import AIInput from "../../../shared/ui/AIInput";
import Modal from "../../../shared/ui/Modal";

function LibraryNew() {
  const sections = [
    { title: "Continue Reading", items: mock.continue },
    { title: "Personalized for you", items: mock.recomendationsPosts },
    { title: "Explore new topics", items: mock.recomendationsTopics },
  ];
	const [expModal, setExpModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <IoBookOutline className="w-9 h-9" />
            <Title title="Library" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        {sections.map((section, index) => (
          <ListAccordion key={index} title={section.title} items={section.items} />
        ))}
				<div className="w-full max-w-screen-xl mx-auto">
					<AIInput
						placeholder="Ask anything..."
						type="user"
						setExpModal={setExpModal}
					/>
				</div>
      </div>
			{ expModal && 
				<Modal
					className="w-full max-w-[993px]"
					isOpen={expModal}
					onClose={() => setExpModal(false)}
				>
					<div>modal</div>
				</Modal>
			}
    </div>
  );
}

export default LibraryNew;