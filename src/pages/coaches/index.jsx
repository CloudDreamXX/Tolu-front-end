import React from "react";
import CoachesAside from "./layout/coachesAside/CoachesAside";
import CoachesHeader from "./layout/coachesHeader/CoachesHeader";
import Main from "./layout/Main";



const Coaches = () => {
    return (
        <section className="w-full relative user-dashboard h-screen overflow-hidden bg-[#f5f7fb] z-[0]">
            <div className="flex flex-col-2 h-full">
                <div className="hidden xl:block z-50">
                    <CoachesAside />
                </div>
                <div className="w-[100%] h-screen bg-white overflow-y-scroll custom-scroll">
                    <CoachesHeader />
                    <Main />
                </div>
            </div>
        </section>
    )
}
export default Coaches;