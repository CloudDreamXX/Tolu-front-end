import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { folderService } from '../../services/folder.service';

export const fetchFolderStructure = createAsyncThunk(
  'adminData/fetchFolderStructure',
  async (_, { rejectWithValue }) => {
    try {
      const data = await folderService.getFolderStructure();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostedStructure = createAsyncThunk(
  'adminData/fetchPostedStructure',
  async (_, { rejectWithValue }) => {
    try {
      const data = await folderService.getPostedStructure();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminDataSlice = createSlice({
  name: 'adminData',
  initialState: {
    folderStructure: null,
    postedStructure: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolderStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolderStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.folderStructure = action.payload;
      })
      .addCase(fetchFolderStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostedStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostedStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.postedStructure = action.payload;
      })
      .addCase(fetchPostedStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDataSlice.reducer;
