import { CommunityItem } from "./components/CommunityItem";

const communityChats = [
    {
        id: "1",
        first_name: "Ivy",
        last_name: "Acosta",
        topic: "Weight Loss",
        message: "Hi everyone, I need help with a severe case of Histamine intolerance. It’s a complex case with a history of cancer. Click hand shake if interested to work together. Find the case brief here. "
    },
    {
        id: "2",
        first_name: "Heather",
        last_name: "Johnson",
        topic: "Metabolic, Sleep",
        message: "Hi everyone, I’m looking for collaboration on  a case with a recent cardiovascular diagnoses. Please LMK if interested in hearing more. "
    }
]

export const CommunityTab: React.FC = () => {
    return (
        <ul className="flex flex-col gap-[32px] py-[24px]">
            {communityChats.map((item) => (
                <CommunityItem
                    key={item.id}
                    first_name={item.first_name}
                    last_name={item.last_name}
                    topic={item.topic}
                    message={item.message}
                />
            ))}
        </ul>
    );
}