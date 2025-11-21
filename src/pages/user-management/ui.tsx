import React, { useState, useMemo } from "react";
import { useEffect } from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  User,
} from "entities/admin";
import { phoneMask, toast } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { fmtDate } from "pages/feedback-hub";
import { FiltersPopup, UserFilters } from "widgets/filters-popup";
import { Button, Input } from "shared/ui";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";

const PAGE_SIZE = 10;

const ROLE_MAP: Record<number, string> = {
  0: "Super Admin",
  1: "Admin",
  2: "Practitioner",
  3: "Client",
  4: "Reviewer",
};

const defaultFilters: UserFilters = {
  role: "All",
  signup: {},
  sort: "newest",
};

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetAllUsersQuery();
  const usersData: User[] = data?.users ?? [];
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<UserFilters>(defaultFilters);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = usersData.filter((u) => {
      const matchesSearch =
        !term ||
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone_number || "").toLowerCase().includes(term);

      const matchesRole =
        filters.role === "All" || ROLE_MAP[u.role] === filters.role;

      const matchesDate = (() => {
        if (!filters.signup.start && !filters.signup.end) return true;
        if (!u.signup_date) return false;

        const t = new Date(u.signup_date).getTime();
        const s = filters.signup.start
          ? new Date(filters.signup.start).setHours(0, 0, 0, 0)
          : -Infinity;
        const e = filters.signup.end
          ? new Date(filters.signup.end).setHours(23, 59, 59, 999)
          : Infinity;

        return t >= s && t <= e;
      })();

      return matchesSearch && matchesRole && matchesDate;
    });

    if (filters.sort === "newest") {
      result = result.sort(
        (a, b) =>
          new Date(b.signup_date ?? 0).getTime() -
          new Date(a.signup_date ?? 0).getTime()
      );
    } else {
      result = result.sort(
        (a, b) =>
          new Date(a.signup_date ?? 0).getTime() -
          new Date(b.signup_date ?? 0).getTime()
      );
    }

    return result;
  }, [usersData, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [page, filteredUsers]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;

  const onApplyFilters = () => {
    setFilters(draftFilters);
    setPage(1);
    setFiltersOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        deleteMenuId &&
        !(
          document
            .querySelector(`[data-delete-menu-id="${deleteMenuId}"]`)
            ?.contains(target) ||
          (event.target as HTMLElement).closest('[data-delete-trigger="true"]')
        )
      ) {
        setDeleteMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [deleteMenuId]);

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

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser({ userId: selectedUserId }).unwrap();
      refetch();

      toast({
        title: "User deleted",
        description: "The user has been removed successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: err?.data?.detail || "Please try again.",
      });
    } finally {
      setConfirmDelete(false);
      setSelectedUserId(null);
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
          <Button
            variant={"light-blue"}
            className="text-[#1C63DB] text-[16px] font-semibold py-[10px] px-[16px]"
            onClick={() => {
              setDraftFilters(filters);
              setFiltersOpen(true);
            }}
          >
            <MaterialIcon iconName="page_info" />
            Filter
          </Button>
          <div className="flex gap-[8px] items-center w-full lg:w-[300px] rounded-full border border-[#DBDEE1] px-[16px] py-[10px] bg-white h-[40px]">
            <MaterialIcon iconName="search" size={16} />
            <Input
              placeholder="Search"
              className="outline-none w-full placeholder-custom text-[14px] font-semibold text-[#000] border-none h-9"
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
              <div className="grid [grid-template-columns:repeat(5,minmax(0,1fr))_30px] bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[16px]">
                <div className="px-[4px]">Sign Up date</div>
                <div className="px-[4px]">Name</div>
                <div className="px-[4px]">Account type</div>
                <div className="px-[4px]">Email</div>
                <div className="px-[4px]">Phone number</div>
                <div className="px-[4px]"></div>
              </div>

              <div className="flex flex-col gap-4 md:gap-0 md:px-[12px] pb-[16px] bg-white rounded-b-[8px]">
                {paginatedData.map((user, index) => (
                  <div
                    key={index}
                    className="grid [grid-template-columns:repeat(5,minmax(0,1fr))_30px] items-center p-[12px] border-b border-[#DBDEE1] text-[16px]"
                  >
                    <div className="px-[4px]">
                      {fmtDate(user.signup_date) || "-"}
                    </div>
                    <div className="px-[4px]">
                      {user.first_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.name}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${getRoleStyle(user.role)}`}
                      >
                        {ROLE_MAP[user.role] ?? "Unknown"}
                      </span>
                    </div>
                    <div className="px-[4px]">{user.email}</div>
                    <div className="px-[4px]">
                      {user.phone_number ? phoneMask(user.phone_number) : "-"}
                    </div>

                    <div
                      className="
                      w-[50px]
    px-[4px] 
    sticky -right-1 
    bg-white 
    z-20 
    flex justify-center 
    relative
  "
                      data-delete-menu-id={user.id}
                    >
                      <Button
                        variant={"unstyled"}
                        size={"unstyled"}
                        onClick={() =>
                          setDeleteMenuId(
                            deleteMenuId === user.id ? null : user.id
                          )
                        }
                        className="flex items-center justify-center hover:bg-[#ECEFF4] rounded-full w-fit"
                        data-delete-trigger="true"
                      >
                        <MaterialIcon iconName="more_vert" />
                      </Button>

                      {deleteMenuId === user.id && (
                        <div className="absolute top-[30px] right-0 bg-white py-[16px] px-[14px] rounded-[10px] flex items-center gap-[8px] text-[#FF1F0F] text-[16px] font-[500] w-[238px] shadow-[0px_8px_18px_rgba(0,0,0,0.15)] z-50">
                          <Button
                            variant={"unstyled"}
                            size={"unstyled"}
                            className="flex items-center gap-[8px] w-full text-left"
                            onClick={async () => {
                              setSelectedUserId(user.id);
                              setConfirmDelete(true);
                              setDeleteMenuId(null);
                            }}
                          >
                            <MaterialIcon
                              iconName="delete"
                              fill={1}
                              className="text-[#FF1F0F]"
                            />
                            Delete
                          </Button>
                        </div>
                      )}
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
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_left_alt" />
          </Button>

          {getVisiblePages(page, totalPages).map((pageNumber) => (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${page === pageNumber
                  ? "border-[#1C63DB] text-[#1C63DB]"
                  : "border-[#DBDEE1] text-black"
                }`}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            variant={"unstyled"}
            size={"unstyled"}
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_right_alt" />
          </Button>
        </div>
      )}

      {isFiltersOpen && (
        <FiltersPopup
          mode="users"
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          onSave={onApplyFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          onCancel={() => {
            setConfirmDelete(false);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
