import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Aside from "../aside/Aside";
import Header from "../header/Header";
import HealthForm from '../../features/healthForm/components/HealthForm';

function LibraryUserLayout() {
    const [isOpen, setIsOpen] = useState(() => {
        const storedValue = localStorage.getItem('healthFormIsOpen');
        return storedValue === null ? true : JSON.parse(storedValue);
    });

    useEffect(() => {
        localStorage.setItem('healthFormIsOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    return (
        <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
            <div className="flex flex-col-2 h-full">
                <div className="hidden xl:block z-50">
                    <Aside />
                </div>
                <div className="w-[100%] h-screen bg-contentBg overflow-y-scroll custom-scroll">
                    <Header />
                    <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            <HealthForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </section>
    );
}

export default LibraryUserLayout;