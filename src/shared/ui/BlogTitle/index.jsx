import { Title } from "../Title";
import { TbEdit } from "react-icons/tb";
import Breadcrumbs from "./Breadcrumbs";

function BlogTitle({ title, description, breadcrumbs }) { 

  return (
    <div className="flex flex-col items-start gap-2">
        {breadcrumbs.length > 0 && title !== "Published Content" &&
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        }
        <div className="flex items-center gap-2">
            <TbEdit className="w-9 h-9 cursor-pointer" />
            <Title title={title} />
        </div>
        {description && <p className="text-p">{description}</p>}
    </div>
  );
}

export default BlogTitle;
