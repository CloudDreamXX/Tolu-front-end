import React, { useState, useMemo } from "react";
import { useEffect } from "react";
import { useGetAllUsersQuery, User } from "entities/admin";
import { toast } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { fmtDate } from "pages/feedback-hub";

const PAGE_SIZE = 10;

const ROLE_MAP: Record<number, string> = {
  0: "Super Admin",
  1: "Admin",
  2: "Practitioner",
  3: "Client",
  4: "Reviewer",
};

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetAllUsersQuery();
  const usersData: User[] = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return usersData;
    return usersData.filter((u) => {
      return (
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone_number || "").toLowerCase().includes(term)
      );
    });
  }, [usersData, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [page, filteredUsers]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch users",
        description: "Please try again.",
      });
    }
  }, [error]);

  const getVisiblePages = (current: number, total: number, maxVisible = 4) => {
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getRoleStyle = (role: number) => {
    switch (role) {
      case 0:
        return "bg-green-100 text-green-700";
      case 1:
        return "bg-[#F0F3FF] text-[#000E66]";
      case 2:
        return "bg-red-100 text-red-700";
      case 3:
        return "bg-orange-100 text-orange-700";
      case 4:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col gap-[16px] md:gap-[35px] p-8 overflow-y-auto h-[100%]">
      <div className="flex flex-col md:flex-row gap-[16px] justify-between md:items-end">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <MaterialIcon iconName="groups" fill={1} />
          Users
        </h1>
        <div className="flex md:flex-row flex-row gap-2 md:gap-[20px] lg:gap-2">
          <div className="flex gap-[8px] items-center w-full lg:w-[300px] rounded-full border border-[#DBDEE1] px-[12px] py-[8px] bg-white h-[32px]">
            <MaterialIcon iconName="search" size={16} />
            <input
              placeholder="Search"
              className="outline-none w-full placeholder-custom text-[14px] font-semibold text-[#000]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading users...</div>
      ) : (
        <div>
          {/* Table View for Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[1800px]">
              <div className="grid grid-cols-5 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[16px]">
                <div className="px-[4px]">Name</div>
                <div className="px-[4px]">Email</div>
                <div className="px-[4px]">Phone number</div>
                <div className="px-[4px]">Sign Up date</div>
                <div className="px-[4px]">Role</div>
              </div>

              <div className="flex flex-col gap-4 md:gap-0 md:px-[12px] pb-[16px] bg-white rounded-b-[8px]">
                {paginatedData.map((user, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center p-[12px] border-b border-[#DBDEE1] text-[16px]"
                  >
                    <div className="px-[4px]">{user.name}</div>
                    <div className="px-[4px]">{user.email}</div>
                    <div className="px-[4px]">{user.phone_number}</div>
                    <div className="px-[4px]">
                      {fmtDate(user.signup_date) || "-"}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${getRoleStyle(user.role)}`}
                      >
                        {ROLE_MAP[user.role] ?? "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card View for Mobile */}
          <div className="flex flex-col gap-4 md:hidden">
            {paginatedData.map((user, index) => (
              <div
                key={index}
                className="bg-white rounded-[8px] border border-[#AAC6EC] p-[16px]"
              >
                <div className="bg-[#AAC6EC1A] rounded-[4px] p-[8px] mb-[24px]">
                  <h2 className="text-[18px] text-[#1D1D1F] font-[500] leading-[24px]">
                    {user.name}
                  </h2>
                </div>

                <div className="flex flex-col">
                  <div className="flex text-[14px] leading-[20px] py-[8px] border-b border-[#F3F6FB]">
                    <span className="shrink-0 w-[88px] text-[#5F5F65] font-medium">
                      Email
                    </span>
                    <span className="flex-1 min-w-0 font-normal text-black whitespace-normal [overflow-wrap:anywhere] break-words">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex text-[14px] leading-[20px] py-[8px] border-b border-[#F3F6FB]">
                    <span className="w-full text-[#5F5F65] font-medium">
                      Phone number
                    </span>
                    <span className="w-full font-normal text-black">
                      {user.phone_number}
                    </span>
                  </div>

                  <div className="flex text-[14px] leading-[20px] py-[8px] border-b border-[#F3F6FB]">
                    <span className="w-full text-[#5F5F65] font-medium">
                      Sign up date
                    </span>
                    <span className="w-full font-normal text-black">
                      {fmtDate(user.signup_date) || "-"}
                    </span>
                  </div>

                  <div className="flex text-[14px] leading-[20px] items-center py-[8px] border-b border-[#F3F6FB]">
                    <span className="w-full text-[#5F5F65] font-medium">
                      Role
                    </span>
                    <span className="w-full">
                      <span
                        className={`font-[500] px-2 py-[2px] rounded-full whitespace-nowrap ${getRoleStyle(user.role)}`}
                      >
                        {ROLE_MAP[user.role] ?? "Unknown"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_left_alt" />
          </button>

          {getVisiblePages(page, totalPages).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${
                page === pageNumber
                  ? "border-[#1C63DB] text-[#1C63DB]"
                  : "border-[#DBDEE1] text-black"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_right_alt" />
          </button>
        </div>
      )}
    </div>
  );
};
