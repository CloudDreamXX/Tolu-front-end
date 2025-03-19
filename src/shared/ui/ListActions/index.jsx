import Button from '../Button';
import Search from '../Search';

function ListActions({ isSearch, type, onSearch }) {
    return (
        <div className="flex items-center gap-2">
            <Button name="Add New" type="action" onClick={() => {}} />
            {type === 'main' && isSearch && (
                <Search onSearch={onSearch} />
            )}            
        </div>
    );
}

export default ListActions;