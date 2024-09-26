import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "antd";

import Home from "./Home";
import SideBar from "./SideBar";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Login/Login";
import NewSearch from "./NewSearch/NewSearch";
import { Signup } from "./Signup/Signup";
// import Onboarding from "./onboarding";
// import HealthConcerns from './HealthConcerns';
// import LifestyleDetails from './LifeStyleDetails';
// import HealthAndWellness from './HealthAndWellness';
// import HealthPatternTracking from "./HealthPattern";
// import LearningQuiz from "./LearningQuiz";
// import RewardSystem from "./RewardSystem";
// import ThankYouOnboarding from "./ThankYouOnboarding";
import Error from "./Error";
import Footer from './Footer';

const { Content } = Layout;

const useToken = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        // Set up the initial token state and listen for changes on localStorage
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return token;
};

const ProtectedRoute = ({ children }) => {
    const token = useToken();
    return token ? (
        <Layout>
            <SideBar />
            <Content style={{ padding: '0 00px' }}>{children}</Content>
        </Layout>
    ) : <Navigate to="/" replace />;
};

const Router = () => {
    const select = useSelector((st) => st.accessmode.value);
    const token = useToken();

    useEffect(() => {
        // Potentially handle Redux state changes or other side effects
    }, [select, token]);

    return (
        <BrowserRouter>
            <Layout style={{ background: "#FFFF" }}>
                <Content >
                    <Routes>
                        <Route path="/auth" element={<Login />} />
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/signup" element={<Signup />} />
                        {/* <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/health-concerns" element={<HealthConcerns />} />
                        <Route path="/LifestyleDetails" element={<LifestyleDetails />} />
                        <Route path="/HealthAndWellness" element={<HealthAndWellness />} />
                        <Route path="/HealthPatternTracking" element={<HealthPatternTracking />} />
                        <Route path="/LearningQuiz" element={<LearningQuiz />} />
                        <Route path="/RewardSystem" element={<RewardSystem />} />
                        <Route path="/ThankYouOnboarding" element={<ThankYouOnboarding />} /> */}
                        <Route path="/handouts" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        <Route path="/newsearch" element={
                            <ProtectedRoute>
                                <NewSearch />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={
                            <ProtectedRoute>
                                <Error />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Content>
                <Footer />
            </Layout>
        </BrowserRouter>
    );
};

export default Router;
