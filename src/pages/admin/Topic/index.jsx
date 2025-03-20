import { useParams } from 'react-router-dom';
import { useGetFolderStructureQuery } from '../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../utils/excludePublishedContent';
import { findTopicById } from '../../../utils/findById';
import { mock } from '../Library/mock';
import EmptyBlock from '../../../shared/ui/EmptyBlock';

function Topic() {
    const { topicId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders || mock);
    const topic = findTopicById(publishedContent, topicId);   

    if (!topic) {
        return <EmptyBlock />;
    }

    return (
        <div className="p-6 flex flex-col gap-6 bg-white shadow rounded-md">
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <p className="text-sm text-gray-500">Created: {new Date(topic.created_at).toLocaleDateString()}</p>
            <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: topic.content }} />
        </div>
    );
}

export default Topic;
