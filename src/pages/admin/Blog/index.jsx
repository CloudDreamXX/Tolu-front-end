import DynamicList from '../../../shared/ui/DynamicList';
import { useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../utils/excludePublishedContent';

function Blog() {
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders);
    const { subfolders, content } = publishedContent || {};

    return (
        <div className="flex flex-col gap-6">
            <DynamicList 
                title="Subfolders" 
                items={subfolders || []} 
                initialCount={8} 
                increment={4}
                type="main"
                linkTo="/admin2/folder"
            />
            <DynamicList 
                title="Content" 
                items={content || []}
                initialCount={6} 
                increment={3}
                type="main"
            />
        </div>
    );
}

export default Blog;
