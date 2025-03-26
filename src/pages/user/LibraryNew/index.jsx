import { useState } from "react";
import { mock, topics } from "./mock";
import { IoBookOutline } from "react-icons/io5";
import { Title } from "../../../shared/ui/Title";
import ListAccordion from "../../../shared/ui/ListAccordion";
import AIInput from "../../../shared/ui/AIInput";
import Modal from "../../../shared/ui/Modal";
import BadgeTopic from "../../../shared/ui/BadgeTopic";
import Button from "../../../shared/ui/Button";
import StatusForm from "../../../shared/ui/StatusForm";

function LibraryNew() {
  const sections = [
    { title: "Continue Reading", items: mock.continue, type: 'post' },
    { title: "Personalized for you", items: mock.recomendationsPosts, type: 'post' },
    { title: "Explore new topics", items: mock.recomendationsTopics, type: 'topic' },
  ];
	const [expModal, setExpModal] = useState(false);
	const [statusModal, setStatusModal] = useState(false);
	const [activeTopics, setActiveTopics] = useState([]);
	const toggleTopic = (topic) => {
    setActiveTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between">
          <div className="flex items-center gap-2" onClick={() => setStatusModal(true)}>
            <IoBookOutline className="w-9 h-9" />
            <Title title="Library" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-12">
        {sections.map((section, index) => (
          <ListAccordion key={index} title={section.title} items={section.items} type={section.type} />
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
					title="Personalize Your Experience"
					description="Choose at least 2 topics that interest you to receive tailored content."
				>
					{topics.map((topic, index) => (
						<BadgeTopic 
							key={index} 
							topic={topic} 
							active={activeTopics.includes(topic)}
							onClick={() => toggleTopic(topic)}
						/>
					))}
					{activeTopics.length >= 2 &&
						<div className="w-full flex max-w-48 justify-center">
							<Button
								name="Apply"
								type="default"
								onClick={() => setExpModal(false)}
							/>
						</div>
					}
				</Modal>
			}
			{ statusModal && 
				<Modal
					className="w-full max-w-[993px]"
					isOpen={statusModal}
					onClose={() => setStatusModal(false)}
				>
					<StatusForm />
				</Modal>
			}
    </div>
  );
}

export default LibraryNew;