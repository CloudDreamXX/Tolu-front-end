import { useState, useEffect } from 'react';
import { FiSearch } from "react-icons/fi";

function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    return (
        <div className="relative">
            <FiSearch className="absolute top-3.5 left-3 w-5 h-5 text-gray-500" />
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 pl-8 border border-stroke rounded-full"
            />
        </div>
    );
}

export default Search;