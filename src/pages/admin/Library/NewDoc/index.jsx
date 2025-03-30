import { useState } from 'react';
import AIInput from '../../../../shared/ui/AIInput';
import Button from '../../../../shared/ui/Button';
import HelpSection from '../../../../shared/ui/HelpSection';
import Breadcrumbs from '../../../../shared/ui/Breadcrumbs';
import { tips } from './mock';

function NewDoc() {
  const [title, setTitle] = useState('Untitled Content');
  const [messageTrack, setMessageTrack] = useState('');

  return (
    <div className="w-full flex justify-center items-center h-full">
      <div className="w-full h-full max-w-7xl flex flex-col gap-2">
        <div className="w-full flex flex-col rounded-2xl bg-white p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between items-start">
              <Breadcrumbs
                breadcrumbs={[
                  { name: 'Library', path: '/admin/library' },
                  { name: 'Folder', path: '/admin/library/folder' },
                  { name: 'Topic', path: '/admin/library/topic' },
                  { name: title },
                ]}
              />
              <Button name="Move" type="move" />
            </div>
            <h1 className="text-h1">{title}</h1>
          </div>
          <div className="min-h-[40vh]">{messageTrack}</div>
          <HelpSection sectionTitle="Hi, how can I help you?" tips={tips} />
        </div>
        <div className="w-full flex flex-col rounded-2xl bg-white">
          <AIInput placeholder="Ask anything..." type="admin-new-doc" />
        </div>
      </div>
    </div>
  );
}

export default NewDoc;
