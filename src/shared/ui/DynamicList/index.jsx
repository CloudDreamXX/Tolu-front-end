import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { loadMoreItems } from '../../../utils/loadMoreItems';
import ListActions from '../ListActions';
import FolderCard from '../FolderCard';
import Card from '../Card';
import classNames from 'classnames';

function DynamicList({ 
    title, 
    items, 
    initialCount, 
    increment, 
    type,
    linkTo
}) {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const visibleItems = loadMoreItems(items, visibleCount, 0);

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center">
                <h2 className="text-h2">{title}</h2>
                <ListActions isSearch={type === 'main'} type={type} />
            </div>
            <div className={classNames(
                "grid gap-4",
                title === "Subfolders" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            )}>
                {visibleItems.map((item) => (
                    <Link key={item.id} to={typeof linkTo === "function" ? linkTo(item) : linkTo}>
                        {title === "Subfolders" ? <FolderCard item={item} /> : <Card item={item} />}
                    </Link>
                ))}
            </div>
            {visibleCount < items.length && (
                <div className='w-full flex justify-end'>
                    <Button name="Load More" type="load" onClick={() => setVisibleCount(prev => prev + increment)} />
                </div>
            )}
        </div>
    );
}

export default DynamicList;
