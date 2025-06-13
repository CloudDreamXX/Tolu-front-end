import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  glucoseValue: "",
  measurementType: "",
  date: "",
  notes: "",
};

const clientGlucoseSlice = createSlice({
  name: "clientGlucose",
  initialState,
  reducers: {
    setGlucoseValue: (state, action: PayloadAction<string>) => {
      state.glucoseValue = action.payload;
    },
    setMeasurementType: (state, action: PayloadAction<string>) => {
      state.measurementType = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
  },
});

export const { setGlucoseValue, setMeasurementType, setDate, setNotes } =
  clientGlucoseSlice.actions;
export const clientGlucoseReducer = clientGlucoseSlice.reducer;
