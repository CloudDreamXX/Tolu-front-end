import Button from "../../Button";
import Search from "../../Search";
import { Link, useLocation, useParams } from "react-router-dom";

function TableHeader() {
    const { folderId, topicId } = useParams();
    const location = useLocation();

    const createContentLink = location.pathname.includes('/folder') && location.pathname.includes('/topic')
        ? `/admin2/folder/${folderId}/topic/${topicId}/newdoc`
        : "/admin2/library/new-doc";

    return (
        <div className="w-full justify-between flex items-center">
            <h2 className="text-h2">Documents</h2>
            <div className="flex items-center gap-2">
                <Button name="Upload" type="upload" onClick={() => {}} />
                <Link to={createContentLink}>
                    <Button name="Create Content" type="create" />
                </Link>
                <Search />
            </div>
        </div>
    );
}

export default TableHeader;