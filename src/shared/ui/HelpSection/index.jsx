import Title from './components/Title';
import FileCard from './components/FileCard';
import { GoGear } from 'react-icons/go';
import { LuPaperclip } from 'react-icons/lu';

function HelpSection({ 
  sectionTitle,  
  openAddFileModal, 
  openInstructionModal 
}) {
  return (
    <div className="w-full flex flex-col gap-6 bg-white h-full p-4 md:p-6 rounded-2xl justify-end">
      <div className="w-full">
        <Title title={sectionTitle} />
      </div>
      <div className="w-full flex gap-4">
        <div className="w-full cursor-pointer">
          <FileCard
            openAddFileModal={openAddFileModal}
            title="Add Files"
            description="Increase the accuracy for the AI response by adding files"
            Icon={LuPaperclip}
          />
        </div>
        <div className="w-full cursor-pointer" onClick={openInstructionModal}>
          <FileCard
            title="Instructions"
            description="Insert your instructions to refine the AI response"
            Icon={GoGear}
          />
        </div>
      </div>
    </div>
  );
}

export default HelpSection;
