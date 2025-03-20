import Button from "../../Button";
import Search from "../../Search";

function TableHeader() {
    return(
        <div className="w-full justify-between flex items-center">
            <h2 className="text-h2">Documents</h2>
            <div className="flex items-center gap-2">
                <Button name="Upload" type="upload" onClick={() => {}} />
                <Button name="Create Content" type="create" onClick={() => {}} />
                <Search />
            </div>
        </div>
    );
}

export default TableHeader;