import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: null, // Initially, no user is logged in
  user: JSON.parse(localStorage.getItem('user')) || null,  // Load user from localStorage
  token: localStorage.getItem('token') || null,  // Load token from localStorage
  isLoading: true, //
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const email = action.payload?.email || null; // Get email  from payload
      if (!email) {
        state.userType = { role: "guest" }; // If no email, set as guest
      } else {
        state.userType = {
          role: email === "admin@example.com" ? "admin" : "user",
        };
      }
      localStorage.setItem("userType", JSON.stringify(state.userType));
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;

      // Remove user and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
});

export const { setCredentials, logout, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
