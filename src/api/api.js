import axios from "axios";

const api = axios.create({
  baseURL: "https://search.vitai.health:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
};

export const personalInfo = async (userData) => {
  try {
    const response = await api.post("/personal-information", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Personal info failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
