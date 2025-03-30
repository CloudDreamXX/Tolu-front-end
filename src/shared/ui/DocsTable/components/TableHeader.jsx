import { useRef } from 'react';
import Button from '../../Button';
import Search from '../../Search';
import { Link, useLocation, useParams } from 'react-router-dom';

function TableHeader({ onUpload }) {
  const { folderId, topicId } = useParams();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const createContentLink =
    location.pathname.includes('/folder') &&
    location.pathname.includes('/topic')
      ? `/admin2/folder/${folderId}/topic/${topicId}/newdoc`
      : '/admin2/library/new-doc';

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full justify-between flex flex-col sm:flex-row sm:items-center">
      <h2 className="text-h2">Documents</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={onUpload}
        />
        <Button name="Upload" type="upload" onClick={triggerFileInput} />

        <Link to={createContentLink}>
          <Button name="Create Content" type="create" />
        </Link>

        <Search />
      </div>
    </div>
  );
}

export default TableHeader;
