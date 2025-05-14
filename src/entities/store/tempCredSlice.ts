import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TempCredState {
  email: string;
  password: string; // ✅ FIXED
}

const initialState: TempCredState = {
  email: "",
  password: "", // ✅ FIXED
};
const tempCredSlice = createSlice({
    name: "tempCred",
    initialState,
    reducers: {
        setTempCred: (state, action: PayloadAction<TempCredState>) => {
            state.email = action.payload.email;
            state.password = action.payload.password;
        },
        clearTempCred: (state) => {
            state.email = "";
            state.password = "";
        },
    },
});

export const { setTempCred, clearTempCred } = tempCredSlice.actions;
export default tempCredSlice.reducer;