import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

function Search({ onSearch, size }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div
      className={classNames('relative w-full', { 'sm:w-fit': size !== 'full' })}
    >
      <FiSearch className="absolute top-3.5 left-3 w-5 h-5 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classNames(
          'p-3 pl-8 border border-stroke rounded-full w-full',
          { 'sm:w-fit': size !== 'full' }
        )}
      />
    </div>
  );
}

export default Search;
