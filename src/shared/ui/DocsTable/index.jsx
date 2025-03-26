import { useState } from 'react';
import { LiaTimesSolid, LiaSortSolid } from 'react-icons/lia';
import { VscFilePdf } from 'react-icons/vsc';
import Badge from '../Badge';
import TableHeader from './components/TableHeader';
import { useNavigate } from 'react-router-dom';
import { sortDocsByValue } from '../../../utils/sort/sortDocsByValue';
import { uploadFile } from '../../../utils/uploadFile';

const initialDocs = [
  {
    id: 1,
    name: 'Managing low libido naturally',
    size: '24 MB',
    type: 'PDF',
    date: '03/12/2025',
  },
  {
    id: 2,
    name: 'Understanding menopause symptoms',
    size: '24 MB',
    type: 'PDF',
    date: '02/12/2025',
  },
  {
    id: 3,
    name: 'Give me 5 health benefits...',
    size: '26 MB',
    type: 'PDF',
    date: '01/12/2025',
  },
  {
    id: 4,
    name: 'Menopause at the age 45',
    size: '21 MB',
    type: 'PDF',
    date: '11/11/2025',
  },
];

function DocsTable() {
  const nav = useNavigate();
  const [docs, setDocs] = useState(initialDocs);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedDocs = sortDocsByValue(
    docs,
    sortConfig.key,
    sortConfig.direction
  );

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDoc = uploadFile(file);
      setDocs((prevDocs) => [newDoc, ...prevDocs]);
      event.target.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 mx-auto mt-6 overflow-auto sm:overflow-hidden">
      <TableHeader onUpload={handleUpload} />
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left rounded-lg">
            {['name', 'size', 'type', 'date'].map((key) => (
              <th key={key} className="p-4 gap-2 relative">
                <span className="relative whitespace-nowrap capitalize">
                  {key === 'name'
                    ? 'Document name'
                    : key === 'size'
                      ? 'File size'
                      : key}
                  <LiaSortSolid
                    className="w-4 h-4 cursor-pointer absolute top-0.5 -right-6"
                    onClick={() => handleSort(key)}
                  />
                </span>
              </th>
            ))}
            <th className="p-4" />
          </tr>
        </thead>
        <tbody>
          {sortedDocs.map((doc) => (
            <tr
              key={doc.id}
              className="rounded-lg transition duration-200"
              onClick={() => nav(`/admin2/document/${doc.id}`)}
            >
              <td className="p-5 flex items-center gap-3 bg-white rounded-tl-lg rounded-bl-lg">
                <VscFilePdf className="w-6 h-6" />
                {doc.name}
              </td>
              <td className="p-4 bg-white">{doc.size}</td>
              <td className="p-4 bg-white">
                <Badge value={doc.type} />
              </td>
              <td className="p-4 bg-white">{doc.date}</td>
              <td className="p-4 bg-white text-right rounded-tr-lg rounded-br-lg">
                <button className="hover:text-red-600 transition">
                  <LiaTimesSolid className="w-5 h-5 opacity-80 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocsTable;
