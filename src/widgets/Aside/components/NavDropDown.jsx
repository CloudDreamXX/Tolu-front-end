import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '../../../assets/images/icons/Folder.svg';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { HiHashtag } from 'react-icons/hi';
import PublishedIcon from '../../../assets/images/icons/Published.svg';

function NavDropDown({ item, isSubItem = false }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const hasChildren =
    (item.subItems && item.subItems.length > 0) ||
    (item.content && item.content.length > 0);

  const toggle = () => setOpen((prev) => !prev);
  const handleItemClick = (id) => {
    nav(`/admin2new/library-topic-details?id=${id}`);
  };

  return (
    <div className="w-full">
      <button
        className={classNames(
          'w-full gap-3 flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 cursor-pointer',
          { 'bg-stroke border-l-4 border-accent': open, 'pl-8': isSubItem }
        )}
        onClick={toggle}
      >
        <div className="flex items-center gap-3 text-lg font-semibold">
          {item.icon &&
            (typeof item.icon === 'string' ? (
              <img
                src={item.icon}
                alt={item.label}
                className={classNames('w-5 h-5', {
                  'w-7 h-7': item.icon === PublishedIcon,
                })}
              />
            ) : (
              <item.icon className="w-5 h-5" />
            ))}
          {item.label}
        </div>
        {hasChildren && (
          <span className="ml-auto">
            {open ? (
              <FaMinus className="w-3 h-3" />
            ) : (
              <FaPlus className="w-3 h-3" />
            )}
          </span>
        )}
      </button>

      {open && (
        <ul className="w-full mt-1">
          {item.subItems?.map((subItem) => (
            <NavDropDown
              key={subItem.id}
              item={{
                ...subItem,
                icon: subItem.icon || FolderIcon,
              }}
              isSubItem={true}
            />
          ))}

          {/* Content as array of items */}
          {Array.isArray(item.content) &&
            item.content.map((contentItem) => (
              <li
                key={contentItem.id}
                className="p-4 pl-10 flex items-center gap-3 cursor-pointer"
                onClick={() => handleItemClick(contentItem.id)}
              >
                <HiHashtag className="min-w-4 min-h-4 text-base" />
                <span className="text-base font-normal truncate">
                  {contentItem.title}
                </span>
              </li>
            ))}

          {/* Content as JSX (like a select element) */}
          {!Array.isArray(item.content) && item.content && (
            <li className="p-4 pl-10">{item.content}</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default NavDropDown;
