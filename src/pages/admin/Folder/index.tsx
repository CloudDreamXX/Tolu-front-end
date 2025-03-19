import { useParams } from 'react-router-dom';
import DynamicList from '../../../shared/ui/DynamicList';
import { useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../utils/excludePublishedContent';
import { findFolderById } from '../../../utils/findFolderById';

function Folder() {
    const { folderId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders);
    const folder = findFolderById(publishedContent, folderId);

    return (
        <div className="flex flex-col gap-6">
            <DynamicList 
                title="Subfolders" 
                items={folder?.subfolders || []} 
                initialCount={8} 
                increment={4}
                type="inside"
                linkTo={`/admin2/folder`}
            />
            <DynamicList 
                title="Content" 
                items={folder?.content || []}
                initialCount={6} 
                increment={3}
                type="inside"
            />
        </div>
    );
}

export default Folder;
