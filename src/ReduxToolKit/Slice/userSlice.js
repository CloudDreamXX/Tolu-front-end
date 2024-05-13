import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../helpers/API";

// Async thunk for user login
export const login = createAsyncThunk(
    "login",
    async ({ payload, navigate }, { rejectWithValue }) => {
      try {
        const response = await api.login(payload);
        return { response, navigate };
      } catch (error) {
        // Extracting error message assuming error response could be an object with a detail key
        const message = error.response.data.detail || "An unknown error occurred";
        return rejectWithValue(message);
      }
    }
  );
  export const createUser = createAsyncThunk(
    "user/createUser",
    async ({ name, email, password, navigate }, { rejectWithValue }) => {
      try {
        const response = await api.signUp({ name, email, password });
        // Navigate to home page on success
        navigate('/home');

        return { response, navigate };
      } catch (error) {
        let message = "Failed to sign up.";
        // Handle error as previously described
        return rejectWithValue(message);
      }
    }
  );
  export const AISearch = createAsyncThunk(
    "aisearch",
    async ({ user_prompt}) => {
      try {
        const response = await api.getAISearch({ user_prompt});
        return response;
      } catch (error) {
        return error.response;
      }
    }
  );
  export const createHandouts = createAsyncThunk(
    "createhandout",
    async (payload, { rejectWithValue }) => {
      try {
        const responseData = await api.createHandout(payload);
        return { data: responseData, status: 201 };
      } catch (error) {
        const message = error.response?.data?.detail || "An unknown error occurred";
        return rejectWithValue({ message, status: error.response?.status });
      }
    }
  );
  export const dislikeResponse = createAsyncThunk(
    "user/dislikeResponse",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.DislikeResponse(payload);
            return response;
        } catch (error) {
            const message = error.response?.data?.detail || "An unknown error occurred";
            return rejectWithValue(message);
        }
    }
);

  

  
  

  const initialState = {
    name: "",
    lastName: "",
    email: "",
    handoutcontent:{},
    error: "",
    loading: false,
    dislike: false
  };
  
  export const UserSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          localStorage.setItem("token", action.payload?.response?.accessToken);
          action.payload.navigate();
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload; 
        })
        .addCase(createUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(createUser.fulfilled, (state, action) => {
          state.loading = false;
          localStorage.setItem("token", action.payload?.response?.accessToken);
          action.payload.navigate();
        })
        .addCase(createUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload; 
        })
        .addCase(createHandouts.pending, (state) => {
          state.loading = true;
        })
        .addCase(createHandouts.fulfilled, (state, action) => {
          state.handoutcontent = action.payload.response;
          state.loading = false;
        })
        .addCase(createHandouts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(dislikeResponse.pending, (state) => {
          state.loading = true;
        })
        .addCase(dislikeResponse.fulfilled, (state, action) => {
          state.loading = false;
          state.dislike = true
        })
        .addCase(dislikeResponse.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  

// Export userSlice actions and reducer
export const {} = UserSlice.actions;
export default UserSlice.reducer;
