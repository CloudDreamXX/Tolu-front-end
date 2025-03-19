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
    linkTo = ''
}) {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const visibleItems = loadMoreItems(items, visibleCount, 0);
    const handleSearch = (searchTerm) => {
        console.log('Search term:', searchTerm);
    };
    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + increment);
    };

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex w-full justify-between items-center">
                <h2 className="text-h2">{title}</h2>
                <ListActions isSearch={type === 'main'} type={type} onSearch={handleSearch} />
            </div>
            <div className={classNames(
                "grid gap-4",
                title === "Subfolders" ? "grid-cols-4" : "grid-cols-3"
            )}>
                {title === "Subfolders" ? (
                    visibleItems.map((item) => (
                        <Link key={item.id} to={`${linkTo}/${item.id}`}>
                            <FolderCard item={item} />
                        </Link>
                    ))
                ) : (
                    visibleItems.map((item) => (
                        <Card key={item.id} item={item} />
                    ))
                )}
            </div>
            <div className='w-full flex justify-end'>
                <Button name="Load More" type="load" onClick={handleLoadMore} />
            </div>
        </div>
    );
}

export default DynamicList;
