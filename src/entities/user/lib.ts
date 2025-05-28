import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./model";
import { getUserRole } from "shared/lib";

interface InitialState {
  user: IUser | null;
  token: string | null;
  tokenNewPassword: string | null;
  userType: { role: string } | null;
  isLoading: boolean;
}

const initialState: InitialState = {
  user: null,
  token: null,
  tokenNewPassword: null,
  userType: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const roleID = action.payload?.user?.roleID ?? null;

      if (!roleID) {
        state.userType = { role: "guest" };
      } else {
        state.userType = {
          role: getUserRole(roleID),
        };
      }
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.tokenNewPassword = action.payload.tokenNewPassword;

      const roleID = action.payload?.user?.roleID ?? null;

      if (roleID) {
        state.userType = {
          role: getUserRole(roleID),
        };
      }
    },
    setRoleID: (state, action) => {
      if (state.user) {
        state.user.roleID = action.payload.roleID;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenNewPassword = null;
      state.userType = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setUser, setRoleID, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
