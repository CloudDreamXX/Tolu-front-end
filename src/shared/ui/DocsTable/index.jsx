import { LiaTimesSolid, LiaSortSolid } from "react-icons/lia";
import { VscFilePdf } from "react-icons/vsc";
import Badge from "../Badge";
import TableHeader from "./components/TableHeader";
import { useNavigate } from "react-router-dom"

const docs = [
  {
    name: "Managing low libido naturally",
    size: "24 MB",
    type: "PDF",
    date: "03/12/2025",
  },
  {
    name: "Understanding menopause symptoms",
    size: "24 MB",
    type: "PDF",
    date: "03/12/2025",
  },
  {
    name: "Give me 5 health benefits...",
    size: "24 MB",
    type: "PDF",
    date: "03/12/2025",
  },
  {
    name: "Menopause at the age 45",
    size: "24 MB",
    type: "PDF",
    date: "03/12/2025",
  },
];

function DocsTable() {
  const nav = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6 mx-auto mt-6 overflow-auto sm:overflow-hidden">
      <TableHeader />
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left rounded-lg">
            <th className="p-4 gap-2 relative">
              <span className="relative whitespace-nowrap">
                Document name
                <LiaSortSolid className="w-4 h-4 cursor-pointer absolute top-0.5 -right-6" />
              </span>
            </th>
            <th className="p-4 gap-2 relative">
              <span className="relative whitespace-nowrap">
                File size
                <LiaSortSolid className="w-4 h-4 cursor-pointer absolute top-0.5 -right-6" />
              </span>
            </th>
            <th className="p-4 gap-2 relative">
              <span className="relative whitespace-nowrap">
                Type
                <LiaSortSolid className="w-4 h-4 cursor-pointer absolute top-0.5 -right-6" />
              </span>
            </th>
            <th className="p-4 gap-2 relative">
              <span className="relative whitespace-nowrap">
                Date
                <LiaSortSolid className="w-4 h-4 cursor-pointer absolute top-0.5 -right-6" />
              </span>
            </th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, index) => (
            <tr
              key={index}
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
