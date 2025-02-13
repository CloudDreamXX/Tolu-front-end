import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useGetUserProfileQuery } from '../../../redux/apis/apiSlice';
import ContactInfo from './components/ContactInfo';
function Profile() {
    const [activeTab, setActiveTab] = useState('Contact Info');
    const tabs = ['Contact Info', 'Health Profile', 'Subscription'];
    const dispatch = useDispatch();
    const { data: userProfile, isLoading: profileLoading, error: profileError } = useGetUserProfileQuery();


    if (profileLoading) {
        return <div>Loading...</div>;
    }

    // if (profileError) {
    //     return <div>Error: {profileError}</div>;
    // }

    return (
        <section className="h-[calc(100vh-150px)] custom-scroll overflow-auto ">
            {/* <SideBar /> */}
            <section>
                <section className="  pt-6">
                    <div className="max-w-6xl mx-auto p-6">
                        {/* Tab Navigation */}
                        <div className="mb-8 flex gap-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-gray-600 ${activeTab === tab ? 'font-semibold text-gray-900' : 'text-gray-400'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* section Area */}
                        <div className="bg-transparent rounded-lg mb-8 p-6">
                            {/* Contact Info Tab */}
                            {activeTab === 'Contact Info' && (
                                <div className="flex flex-col gap-8">
                                    <section>
                                        <ContactInfo tabs={tabs} activeTab={activeTab}userProfile={userProfile} />
                                    </section>
                                </div>
                            )}

                            {/* Profile Tab */}
                            {activeTab === 'Health Profile' && userProfile && (
                                <div className="flex flex-col gap-8">
                                    {/* Updated Profile Header */}
                                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4 flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <FaRegUserCircle className="text-black" size={30} />
                                        </div>
                                        <div className="flex-grow">
                                            <h2 className="text-gray-900 text-sm font-medium">{userProfile.name || ''}</h2>
                                            <p className="text-gray-500 text-sm">{userProfile.email || ''}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <button>
                                                <IoIosArrowDown size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-gray-500 font-semibold text-xs mb-4">Health status</h3>
                                        <div className="bg-white border-2 border-gray-300 rounded-lg">
                                            <div className="space-y-4">
                                                {['Diagnosis', 'Occurring Symptoms', 'Medicine', 'Supplements',
                                                    'Health Coaches', 'Healthcare Providers', 'Lab tests'].map((item) => (
                                                        <button key={item} className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50">
                                                            <span>{item}</span>
                                                            <IoIosArrowDown size={20} />
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>

                                        <h3 className="text-gray-500 font-semibold text-xs mb-4">Lifestyle and Environmental Exposure</h3>
                                        <div className="bg-white border-2 border-gray-300 rounded-lg">
                                            <div className="space-y-4">
                                                {['Diet and Nutrition', 'Lifestyle', 'Environmental exposure', 'Support Network'].map((item) => (
                                                    <button key={item} className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50">
                                                        <span>{item}</span>
                                                        <IoIosArrowDown size={20} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <h3 className="text-gray-500 font-semibold text-xs mb-4">Health History and Symptom Assessment</h3>
                                        <div className="bg-white border-2 border-gray-300 rounded-lg">
                                            <div className="space-y-4">
                                                {['Family Health History', 'Health Timeline', 'Genetic Predispositions'].map((item) => (
                                                    <button key={item} className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50">
                                                        <span>{item}</span>
                                                        <IoIosArrowDown size={20} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Subscription Tab */}
                            {activeTab === 'Subscription' && (
                                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8">
                                    {/* Individual Plan - Role 3 */}
                                    <div className="flex justify-between items-center border-b-2 border-gray-300 py-4">
                                        <div>
                                            <h3 className="text-gray-900 font-medium">Individual (Free)</h3>
                                            <p className="text-gray-500 text-sm">Limited to 10 searches a day.</p>
                                        </div>
                                        {userProfile?.role === 3 ? (
                                            <span className="text-gray-700 font-semibold">Current plan</span>
                                        ) : (
                                            <span className="py-1 px-3 bg-gray-100 text-gray-600 text-sm rounded-full">Choose</span>
                                        )}
                                    </div>

                                    {/* Provider Plan with 10 Search Limit - Role 1 */}
                                    <div className="flex justify-between items-center py-4">
                                        <div>
                                            <h3 className="text-gray-900 font-medium">Provider</h3>
                                            <p className="text-gray-500 text-sm">10 searches a day.</p>
                                        </div>
                                        {userProfile?.role === 1 ? (
                                            <span className="text-gray-700 font-semibold">Current plan</span>
                                        ) : (
                                            <span className="py-1 px-3 bg-gray-100 text-gray-600 text-sm rounded-full">Choose</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </section>
        </section>
    );
}

export default Profile