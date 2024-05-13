import React from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const API = axios.create({
  baseURL: baseURL,
});


API.interceptors.request.use((req) => {
    if (localStorage.getItem("token")) {
      req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return req;
  });
  
  const handleRequest = async (method, endpoint, payload) => {
    try {
      const response = await API[method](endpoint, payload);
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
      if ([401, 403, 0].includes(error.response?.status)) {
        sessionStorage.clear();
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
      throw error;
    }
  };
  
  export const login = async (payload) => {
    return handleRequest("post", "/user/login", payload);
  };
  
  export const signUp = async (payload) => {
    return handleRequest("post", "/user/signup", payload);
  };
  
  export const getAISearch = async (payload) => {
    const { user_prompt } = payload;
    return handleRequest("get", `/ai-search/${user_prompt}`);
  };
  export const createHandout = async (payload) => {
    return handleRequest("post", "/handout/create", payload);
};
  export const DislikeResponse = async(payload) =>{
    return handleRequest("post", "/searched-result/rating", payload)
  }