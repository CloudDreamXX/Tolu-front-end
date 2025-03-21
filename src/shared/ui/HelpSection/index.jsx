import Tips from "./components/Tips";
import Title from "./components/Title";

function HelpSection({ sectionTitle, tips}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full">
        <Title title={sectionTitle} />
      </div>
      <div className="w-full flex gap-4">
        {tips?.map((tip, index) => (
        <Tips key={index} title={tip.title} icon={tip.icon} text={tip.text} />
        ))}
      </div>
    </div>
  );
}

export default HelpSection;