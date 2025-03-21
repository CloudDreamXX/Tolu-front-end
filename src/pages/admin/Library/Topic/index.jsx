import { useParams } from 'react-router-dom';
import { useGetFolderStructureQuery } from '../../../../redux/apis/apiSlice';
import { findPublishedContent } from '../../../../utils/excludePublishedContent';
import { findTopicById } from '../../../../utils/findById';
import { mock } from '../../Library/mock';
import EmptyBlock from '../../../../shared/ui/EmptyBlock';
import TopicMetric from '../../../../shared/ui/TopicMetric';
import DocsTable from '../../../../shared/ui/DocsTable';

function Topic() {
    const { topicId } = useParams();
    const { data: allFolders } = useGetFolderStructureQuery();
    const publishedContent = findPublishedContent(allFolders || mock);
    const topic = findTopicById(publishedContent, topicId);   

    if (!topic) {
        return <EmptyBlock />;
    } 

    return (
        <div className='flex flex-col gap-4'>
            <TopicMetric date={topic.created_at} author={topic.creator_id} />
            {/* {topic?.files?.lenght > 0 &&
                <DocsTable />
            } */}
            <DocsTable />
        </div>
    );
}

export default Topic;
