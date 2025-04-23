import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./model";
import { getUserRole } from "shared/lib";

interface InitialState {
  user: IUser | null;
  token: string | null;
  userType: { role: string } | null;
  isLoading: boolean;
}

const initialState: InitialState = {
  user: null,
  token: null,
  userType: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const email = action.payload?.email ?? null;
      if (!email) {
        state.userType = { role: "guest" };
      } else {
        state.userType = {
          role: getUserRole(email),
        };
      }
    },
    setCredentials: (state, action) => {
      if (!action.payload) {
        console.error(
          "setCredentials called with invalid payload",
          action.payload
        );
        return;
      }

      const user = action.payload.user ?? null;
      state.user = user;

      state.token = action.payload.accessToken ?? action.payload.token ?? null;

      if (user?.email) {
        state.userType = {
          role: getUserRole(user.email),
        };
      } else {
        state.userType = { role: "guest" };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setUser, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
