import DynamicList from '../../../shared/ui/DynamicList';
import { useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../utils/excludePublishedContent';
import { mock } from './mock';

function Library() {
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders || mock);
    const { subfolders, content } = publishedContent || {};

    return (
        <div className="flex flex-col gap-6">
            <DynamicList 
                title="Subfolders" 
                items={subfolders || []} 
                initialCount={8} 
                increment={4}
                type="main"
                linkTo={(item) => `/admin2/folder/${item.id}`}
            />
            <DynamicList 
                title="Content Category" 
                items={content || []}
                initialCount={6} 
                increment={3}
                type="main"
                linkTo={(item) => `/admin2/folder/${item.folderId}/topic/${item.id}`}
            />
        </div>
    );
}

export default Library;
