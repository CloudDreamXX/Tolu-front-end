import { Title } from "../Title";
import Breadcrumbs from "../Breadcrumbs";
import { showIcon } from "./utils";
import Button from "../Button";
import Select from "../Select";

function BlogTitle({ title, titleType, description, breadcrumbs }) { 
  console.log(titleType);  
  return (
    <div className="flex flex-col items-start gap-2">
        {breadcrumbs.length > 0 && title !== "Published Content" &&
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        }
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between">
          <div className="flex items-center gap-2">
            {showIcon(titleType)}
            <Title title={title} />
          </div>
          <div className="flex items-center gap-2">
            {titleType === "topic" && <Button name="Unpublish" type="unpublish" />}
            {(titleType === "topic" || titleType === "folder") && (
              <Select 
                text="All users" 
                options={["All users", "Admins", "Editors", "Guests"]} 
                onSelect={(value) => console.log(value)} 
              />
            )}
          </div>
        </div>
        {description && <p className="text-p">{description}</p>}
    </div>
  );
}

export default BlogTitle;
