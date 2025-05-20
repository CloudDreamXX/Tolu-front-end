import Sparkle from "shared/assets/icons/sparkle-2";
import Chevron from "shared/assets/icons/chevron";
import Search from "shared/assets/icons/search";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { NavLink, useNavigate } from "react-router-dom";
import Magic from "shared/assets/icons/magic";
import CaretDown from "shared/assets/icons/caret-down";
import Expert from "shared/assets/icons/expert-content";
import SquareDivider from "shared/assets/icons/square-divider";
import Symptoms from "shared/assets/icons/symptoms";
import Conditions from "shared/assets/icons/conditions";
import Supplements from "shared/assets/icons/supplements";
import LabTests from "shared/assets/icons/lab-tests";
import { useState } from "react";
import SignOutIcon from "shared/assets/icons/signout";
import { UserService } from "entities/user";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";

export const HealthSnapshotSidebar: React.FC = () => {
    const nav = useNavigate();
    const [isRefineOpen, setIsRefineOpen] = useState(false);
    const token = useSelector((state: RootState) => state.user.token);

    const toggleRefine = () => {
        setIsRefineOpen(prev => !prev);
    };

    const handleSignOut = async () => {
        try {
            await UserService.signOut(token);
            localStorage.clear();
            window.location.href = "/auth";
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-[40px] font-bold">VITAI</h2>
                    <h3 className="text-2xl font-semibold">Client Library</h3>
                </div>
                <div className="flex flex-col px-[14px] py-[17px] gap-[18px]">
                    <Input
                        placeholder="Search by name or content"
                        icon={<Search className="ml-[16px]" />}
                        iconRight={<Chevron className="mr-[16px]" />}
                        className="rounded-full px-[54px]"
                    />
                    <div className="flex items-center w-full gap-[8px]">
                        <div className="flex-grow border-t border-[#ECEFF4]" />
                        <div className="text-[#5F5F65] font-semibold select-none">or</div>
                        <div className="flex-grow border-t border-[#ECEFF4]" />
                    </div>

                    <Button
                        variant={"brightblue"}
                        className="w-full h-[44px] text-base font-semibold"
                        onClick={() => nav("/content-manager/create")}
                    >
                        <Sparkle />
                        Ask VITAI
                    </Button>
                </div>
                <div className="flex flex-col gap-1 pt-[48px]">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-[4px]">
                            <button
                                onClick={toggleRefine}
                                className="flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold cursor-pointer select-none"
                            >
                                <Magic />
                                Refine Search
                                <span className={`ml-auto transition-transform duration-0 ${isRefineOpen ? "rotate-180" : ""}`}>
                                    <CaretDown />
                                </span>
                            </button>

                            {isRefineOpen && <div className="flex flex-col gap-[4px]">
                                <button
                                    className={"flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold"}
                                >
                                    <SquareDivider />
                                    <Symptoms />
                                    Symptoms
                                    <span className="ml-auto"><CaretDown /></span>
                                </button>
                                <button
                                    className={"flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold"}
                                >
                                    <SquareDivider />
                                    <Conditions />
                                    Conditions
                                    <span className="ml-auto"><CaretDown /></span>
                                </button>
                                <button
                                    className={"flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold"}
                                >
                                    <SquareDivider />
                                    <Supplements />
                                    Supplements
                                    <span className="ml-auto"><CaretDown /></span>
                                </button>
                                <button
                                    className={"flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold"}
                                >
                                    <SquareDivider />
                                    <LabTests />
                                    Lab Tests
                                    <span className="ml-auto"><CaretDown /></span>
                                </button>
                            </div>}
                        </div>
                        <NavLink
                            to={"/health-snapshot/expert-content"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] ${isActive ? "font-bold" : "font-semibold"
                                }`
                            }
                        >
                            <Expert />
                            Expert Content
                        </NavLink>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] font-semibold cursor-pointer select-none"
            >
                <SignOutIcon />
                Log out
            </button>
        </div>
    );
};
