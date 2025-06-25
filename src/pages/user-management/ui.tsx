import React, { useState, useMemo } from "react";
import ClientsIcon from "shared/assets/icons/clients";
import Search from "shared/assets/icons/search";
import Arrow from "shared/assets/icons/pages-arrow";
import { useEffect } from "react";
import { AdminService, User } from "entities/admin";
import { toast } from "shared/lib";

const PAGE_SIZE = 10;

const ROLE_MAP: Record<number, string> = {
    0: "Super Admin",
    1: "Admin",
    2: "Practitioner",
    3: "Reviewer",
    4: "Client"
};

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const paginatedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return usersData.slice(start, start + PAGE_SIZE);
    }, [page]);

    const totalPages = Math.ceil(usersData.length / PAGE_SIZE);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await AdminService.getAllUsers();
                setUsersData(response.users);
                console.log(response)
            } catch (error) {
                console.error("Error fetching users", error);
                toast({
                    variant: "destructive",
                    title: "Failed to fetch users",
                    description: "Failed to fetch users. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const getVisiblePages = (current: number, total: number, maxVisible = 4) => {
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(1, end - maxVisible + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="flex flex-col gap-[16px] md:gap-[35px] p-8 overflow-y-auto h-[100%]">
            <div className="flex flex-col lg:flex-row gap-[16px] justify-between lg:items-end">
                <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
                    <ClientsIcon />
                    Users
                </h1>
                <div className="flex flex-col md:flex-row flex-row gap-2 md:gap-[20px] lg:gap-2">
                    <div className="flex gap-[8px] items-center w-full lg:w-[300px] rounded-full border border-[#DBDEE1] px-[12px] py-[8px] bg-white h-[32px]">
                        <Search />
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

            {loading ? (
                <div className="text-center py-8">Loading users...</div>
            ) : (<div className="lg:mt-8 md:rounded-[8px]">
                <div className="grid grid-cols-5 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[16px]">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone number</div>
                    <div>Sign Up date</div>
                    <div>Role</div>
                </div>

                <div className="flex flex-col gap-4 md:gap-0 md:px-[12px] pb-[16px] md:bg-white">
                    {paginatedData.map((user, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-5 items-center p-[12px] border-b border-[#DBDEE1] text-[16px]"
                        >
                            <div>{user.name}</div>
                            <div>{user.email}</div>
                            <div>{user.phone_number}</div>
                            <div>{user.signup_date}</div>
                            <div>
                                <span
                                    className={`text-sm font-semibold px-2 py-1 rounded-full ${user.role === 0
                                        ? "bg-green-100 text-green-700"
                                        : user.role === 1
                                            ? "bg-[#F0F3FF] text-[#000E66]"
                                            : user.role === 2
                                                ? "bg-red-100 text-red-700"
                                                : user.role === 3
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {ROLE_MAP[user.role] ?? "Unknown"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>)}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pb-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
                    >
                        <span className="rotate-[180deg]">
                            <Arrow />
                        </span>
                    </button>

                    {getVisiblePages(page, totalPages).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${page === pageNumber
                                ? "border-[#1C63DB] text-[#1C63DB]"
                                : "border-[#DBDEE1] text-black"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
                    >
                        <Arrow />
                    </button>
                </div>
            )}

        </div>
    );
};
