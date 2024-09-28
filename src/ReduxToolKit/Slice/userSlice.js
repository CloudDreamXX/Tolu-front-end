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
    async ({ name, email, password, type, role, location, num_clients,dob, priority}, { rejectWithValue }) => {
      try {
        const response = await api.signUp({ name, email, password, type, role, location, num_clients,dob, priority});
        // Navigate to home page on success

        return { response };
      } catch (error) {
        let message = "Failed to sign up.";
        // Handle error as previously described
        return rejectWithValue(message);
      }
    }
  );
  export const findUser = createAsyncThunk(
    "user/findUser",
    async ({ email }, { rejectWithValue }) => {
      try {
        const response = await api.finduser({ email});
        // Navigate to home page on success

        return { response };
      } catch (error) {
        let message = "internal server error";
        // Handle error as previously described
        return rejectWithValue(message);
      }
    }
  );
//   export const Onboard = createAsyncThunk(
//     "user/onboarding",
//     async (payload, { rejectWithValue }) => {
//       try {
//         const response = await api.onboarding(payload);
//         return response;
//       } catch (error) {
//         return rejectWithValue(error.response.data);
//       }
//     }
// );

export const updateChatTitle = createAsyncThunk(
  "user/updateChatTitle",
  async ({ chat_id, new_title }, { rejectWithValue }) => {
    try {
      const response = await api.updateChatTitle({ chat_id, new_title });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


  export const AISearch = createAsyncThunk(
    "aisearch",
    async ({ user_prompt, is_new, chat_id, regenerate_id }) => {
      try {
        const response = await api.getAISearch({ user_prompt, is_new, chat_id, regenerate_id});
        return response;
      } catch (error) {
        return error.response;
      }
    }
  );
  export const GetSearchHistory = createAsyncThunk(
    "searched-result",
    async () => {
      try {
        const response = await api.getSearchHistory();
        return response;
      } catch (error) {
        return error.response;
      }
    }
  );
  export const GetSession = createAsyncThunk(
    "session",
    async ({chat_id}) => {
      try {
        const response = await api.getSessionResult({chat_id});
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
    searchresults: {},
    handoutcontent:{},
    sessioncontent:{},
    error: "",
    loading: false,
    dislike: false,
    userexist: false,
    chatTitleUpdated: false,
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
        })
        .addCase(createUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(findUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(findUser.fulfilled, (state, action) => {
          state.userexist = action.payload.response;
          state.loading = false;
        })
        .addCase(findUser.rejected, (state, action) => {
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
       .addCase(GetSearchHistory.pending, (state) => {
          state.loading = true;
        })
        .addCase(GetSearchHistory.fulfilled, (state, action) => {
          state.searchresults = action.payload.response;
          state.loading = false;
        })
        .addCase(GetSearchHistory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(GetSession.pending, (state) => {
          state.loading = true;
        })
        .addCase(GetSession.fulfilled, (state, action) => {
          state.sessioncontent = action.payload.response;
          state.loading = false;
        })
        .addCase(GetSession.rejected, (state, action) => {
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
        })
        .addCase(updateChatTitle.pending, (state) => {
          state.loading = true;
          state.chatTitleUpdated = false;
        })
        .addCase(updateChatTitle.fulfilled, (state, action) => {
          state.loading = false;
          state.chatTitleUpdated = true;
        })
        .addCase(updateChatTitle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.chatTitleUpdated = false;
        });
    },
  });


// Export userSlice actions and reducer
export const {} = UserSlice.actions;
export default UserSlice.reducer;
