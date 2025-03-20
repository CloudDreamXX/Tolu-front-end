import { useParams } from 'react-router-dom';
import DynamicList from '../../../shared/ui/DynamicList';
import { useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../utils/excludePublishedContent';
import { findFolderById } from '../../../utils/findById';
import EmptyBlock from '../../../shared/ui/EmptyBlock';
import DocsTable from '../../../shared/ui/DocsTable';
import { mock } from '../Library/mock';

function Folder() {
    const { folderId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders || mock);
    const folder = findFolderById(publishedContent, folderId);
    console.log(folder.file_count);
    

    return (
        <div className="flex flex-col gap-6">
            {folder?.subfolders && folder?.subfolders.length > 0 &&
                <DynamicList 
                    title="Subfolders" 
                    items={folder?.subfolders || []} 
                    initialCount={8} 
                    increment={4}
                    type="inside"
                    linkTo={`/admin2/folder`}
                />
            }
            {folder?.content && folder?.content.length > 0 &&
                <DynamicList 
                    title="Categories" 
                    items={folder?.content || []}
                    initialCount={6} 
                    increment={3}
                    type="inside"
                    linkTo="/admin2/topic"
                />
            }
            {folder.file_count > 0 &&
                <DocsTable />
            }
            {folder?.subfolders.length === 0 && folder?.content.length === 0 &&
                <EmptyBlock />
            }
        </div>
    );
}

export default Folder;
