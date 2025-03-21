import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

function Breadcrumbs({ breadcrumbs }) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-2">
                            {crumb.path ? (
                                <Link to={crumb.path} className={`text-p ${isLast ? 'text-gray-500' : 'text-black'}`}>
                                    {crumb.name}
                                </Link>
                            ) : (
                                <span className={`text-p ${isLast ? 'text-gray-500' : 'text-black'}`}>
                                    {crumb.name}
                                </span>
                            )}
                            {!isLast && <span className='text-gray-500'> <IoIosArrowForward /> </span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;