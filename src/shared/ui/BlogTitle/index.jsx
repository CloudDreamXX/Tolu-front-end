import { Link } from 'react-router-dom';
import { Title } from "../Title";
import { TbEdit } from "react-icons/tb";

function BlogTitle({ title, description, breadcrumbs }) {
  return (
    <div className="flex flex-col items-start gap-2">
        {breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb">
                <ol className="flex items-center gap-2">
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {crumb.path ? (
                                <Link to={crumb.path} className="text-blue-500">{crumb.name}</Link>
                            ) : (
                                <span>{crumb.name}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span>/</span>}
                        </li>
                    ))}
                </ol>
            </nav>
        )}
        <div className="flex items-center gap-2">
            <TbEdit className="w-9 h-9 cursor-pointer" />
            <Title title={title} />
        </div>
        {description && <p className="text-p">{description}</p>}
    </div>
  );
}

export default BlogTitle;
