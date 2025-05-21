import React from "react";
import { getColorStatus, tableHeaders, tableRows } from ".";

interface HealthTableProps {
  userType: "paid" | "free";
}

export const HealthTable: React.FC<HealthTableProps> = ({ userType }) => {
  // Select headers based on userType
  const headersToUse =
    userType === "free"
      ? tableHeaders.filter((header) => header.id !== 5) // Remove header with id 5 for free users
      : tableHeaders;

  return (
    <table className="w-full bg-white">
      <thead className="bg-[#F3F7FD]">
        <tr>
          {headersToUse.map((header) => (
            <th
              key={header.id}
              className="px-4 py-3 text-left text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words"
            >
              {header.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y-0">
        {tableRows.map((row, index) => (
          <tr key={row.metric} className={index !== 0 ? "mt-2" : ""}>
            {/* Assuming tableHeaders ids correspond to row properties */}
            {headersToUse.map((header) => {
              switch (header.id) {
                case 0:
                  return (
                    <td
                      key={header.id}
                      className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                    >
                      {row.metric}
                    </td>
                  );
                case 1:
                  return (
                    <td
                      key={header.id}
                      className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                    >
                      {row.LatestResult}
                    </td>
                  );
                case 2:
                  return (
                    <td
                      key={header.id}
                      className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                    >
                      {row.Testdate}
                    </td>
                  );
                case 3:
                  return (
                    <td
                      key={header.id}
                      style={{ color: getColorStatus(row.Status) }}
                      className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex gap-1 items-center">
                        <div
                          style={{
                            backgroundColor: getColorStatus(row.Status),
                          }}
                          className="rounded-full w-[6px] h-[6px]"
                        />
                        {row.Status}
                      </div>
                    </td>
                  );
                case 4:
                  return (
                    <td
                      key={header.id}
                      className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                    >
                      {row.lab}
                    </td>
                  );
                  case 5:
                    return (
                      <td
                        key={header.id}
                        className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm"
                      >
                        {row.func}
                      </td>
                    );
                case 6:
                  return (
                    <td
                      key={header.id}
                      className="italic whitespace-pre-line px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] break-words bg-white rounded-lg shadow-sm"
                    >
                      {row.Comment}
                    </td>
                  );
                default:
                  return null;
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
