import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../ReduxToolKit/Slice/userSlice';
import { FaRegUserCircle } from 'react-icons/fa';
import { Layout } from 'antd';
import SideBar from './SideBar';
import './ProfilePage.css';
import { LuArrowRightFromLine } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";

const { Content } = Layout;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = ['Account', 'Profile', 'Subscription'];
  const dispatch = useDispatch();

  const { userProfile, profileLoading, profileError } = useSelector((state) => ({
    userProfile: state.user?.userProfile,
    profileLoading: state.user?.profileLoading,
    profileError: state.user?.profileError
  }));

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  if (profileError) {
    return <div>Error: {profileError}</div>;
  }

  return (
    <Layout className="profile-page-layout">
      <SideBar />
      <Layout>
        <Content className="profile-content">
          <div className="profile-container">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-button ${activeTab === tab ? 'active-tab' : 'inactive-tab'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="content-area">
              {/* Account Tab */}
              {activeTab === 'Account' && (
                <div className="account-tab">
                  {/* User Info Card */}
                    <div className="account-header">
                      <div className="account-header-icon">
                        <div className="user-icon">
                          <FaRegUserCircle className="user-icon-svg" size={30} />
                        </div>
                      </div>
                      <div className="profile-header-details">
                      <h2>{userProfile.name || ''}</h2>
                      <p>{userProfile.email || ''}</p>
                    </div>
                      <div className="user-plan-actions">
                        <button className="upgrade-button">Free</button>
                        <span className="plan-tag">Upgrade</span>
                      </div>
                    </div>

                  {/* Info Buttons Container */}
                  <div className="info-buttons-container">
                    <button className="info-button">
                      <span>Privacy Policy</span>
                      <LuArrowRightFromLine />
                    </button>

                    <button className="info-button">
                      <span>Terms of use</span>
                      <LuArrowRightFromLine />
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'Profile' && userProfile && (
                <div className="profile-tab">
                  {/* Updated Profile Header */}
                  <div className="profile-header">
                    <div className="profile-header-icon">
                      <div className="user-icon">
                        <FaRegUserCircle className="user-icon-svg" size={30} />
                      </div>
                    </div>
                    <div className="profile-header-details">
                      <h2>{userProfile.name || ''}</h2>
                      <p>{userProfile.email || ''}</p>
                    </div>
                    <div className="profile-header-dropdown">
                      <button>
                        <IoIosArrowDown size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="profile-sections">
                    <h3>Health status</h3>
                    <div className="section-container">
                      <div className="section-list">
                        {['Diagnosis', 'Occurring Symptoms', 'Medicine', 'Supplements',
                          'Health Coaches', 'Healthcare Providers', 'Lab tests'].map((item) => (
                            <button key={item} className="section-button">
                              <span>{item}</span>
                              <IoIosArrowDown size={20} />
                            </button>
                          ))}
                      </div>
                    </div>

                    <h3>Lifestyle and Environmental Exposure</h3>
                    <div className="section-container">
                      <div className="section-list">
                        {['Diet and Nutrition', 'Lifestyle', 'Environmental exposure', 'Support Network'].map((item) => (
                          <button key={item} className="section-button">
                            <span>{item}</span>
                            <IoIosArrowDown size={20} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <h3>Health History and Symptom Assessment</h3>
                    <div className="section-container">
                      <div className="section-list">
                        {['Family Health History', 'Health Timeline', 'Genetic Predispositions'].map((item) => (
                          <button key={item} className="section-button">
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
                <div className="subscription-tab">
                  {/* Individual Plan - Role 3 */}
                  <div className="subscription-plan">
                    <div className="plan-details">
                      <h3>Individual (Free)</h3>
                      <p>Limited to 10 searches a day.</p>
                    </div>
                    {userProfile.role === 3 && (
                      <div className="plan-current">
                        <span>Current plan</span>
                      </div>
                    )}
                    {userProfile.role !== 3 && (
                      <span className="plan-tag">Choose</span>
                    )}
                  </div>

                  {/* Provider Plan with 10 Search Limit - Role 1 */}
                  <div className="subscription-plan">
                    <div className="plan-details">
                      <h3>Provider (Free) - Requires verified certificate or license</h3>
                      <p>Limited to 10 searches a day. Includes client management features.</p>
                    </div>
                    {userProfile.role === 1 && (
                      <div className="plan-current">
                        <span>Current plan</span>
                      </div>
                    )}
                    {userProfile.role !== 1 && (
                      <span className="plan-tag">Choose</span>
                    )}
                  </div>

                  {/* Provider Plan with Unlimited Searches - Role 2 */}
                  <div className="subscription-plan">
                    <div className="plan-details">
                      <h3>Reseacher ($20/m-$199/y) - Requires verified certificate or license</h3>
                      <p>Unlimited daily searches. Includes client management features.</p>
                    </div>
                    {userProfile.role === 2 && (
                      <div className="plan-current">
                        <span>Current plan</span>
                      </div>
                    )}
                    {userProfile.role !== 2 && (
                      <span className="plan-tag">Choose</span>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;
