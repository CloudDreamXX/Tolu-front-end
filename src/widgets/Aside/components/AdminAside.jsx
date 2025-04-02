import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FOLDER_STRUCTURE_CONFIG } from './config';
import NavDropDown from './NavDropDown';
import { FaRegFolder } from 'react-icons/fa6';
import Search from '../../../shared/ui/Search';
import Button from '../../../shared/ui/Button';
import { useGetFolderStructureQuery } from '../../../app/store/slice/apiSlice';

function AdminAside() {
  const nav = useNavigate();
  const location = useLocation();
  const { data: allFolders } = useGetFolderStructureQuery();
  const { folderStructure } = useSelector((state) => state.adminData);
  const topLevelKeys = allFolders ? Object.keys(allFolders) : [];  

  console.log('folderStructure', folderStructure);  
  console.log('allFolders', allFolders);  

  const transformItem = (item) => ({
    id: item.id,
    label: item.name,
    icon: FaRegFolder,
    subItems: item.subfolders?.map(transformItem) || [],
    content: item.content || [],
  });

  const handleCreateClick = () => {
    if (location.pathname === '/admin2new/newdoc') {
      localStorage.removeItem('instruction');
      window.location.reload();
    } else {
      nav('/admin2new/newdoc');
    }
  };

  return (
    <nav className="flex flex-col w-full gap-6">
      <Button name="Create" type="createAccent" onClick={handleCreateClick} />
      <div className="flex flex-col gap-3">
        <Search size="full" />
        {topLevelKeys.length > 0 ? (
          topLevelKeys.map((key) => {
            const config = FOLDER_STRUCTURE_CONFIG[key];
            const sectionData = allFolders[key]?.[0];

            return (
              <NavDropDown
                key={key}
                item={{
                  id: key,
                  label: config?.label || key,
                  icon: config?.icon,
                  subItems: sectionData?.subfolders?.map(transformItem) || [],
                  content: sectionData?.content || [],
                }}
              />
            );
          })
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>
    </nav>
  );
}

export default AdminAside;
