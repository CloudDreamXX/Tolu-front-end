import { Title } from "../Title";
import { TbEdit } from "react-icons/tb";

function BlogTitle({ title }) {
  return (
    <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
            <TbEdit className="w-9 h-9 cursor-pointer" />
            <Title title={title} />
        </div>
        <p className="text-p">
            {title === 'Published Content'
                ? "All content moved to this folder will be published in the library and visible to all or selected readers. You cannot edit your content once it is moved to this folder."
                : "This folder contains specific categorized content. You can browse subfolders or view individual files."}
        </p>
    </div>
  );
}

export default BlogTitle;
