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

export const deleteChat = createAsyncThunk(
  "user/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await api.deleteChat(chatId);
      return { chatId, response };
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to delete chat";
      return rejectWithValue(message);
    }
  }
);

export const reportResponse = createAsyncThunk(
  "user/reportResponse",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.reportResult({
        result_id: payload.result_id,
        report: payload.feedback
      });
      return response;
    } catch (error) {
      const message = error.response?.data?.detail || "An unknown error occurred";
      return rejectWithValue(message);
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

export const rateResponse = createAsyncThunk(
  "user/rateResponse",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.rateResponse(payload);
      return { response, rating: payload.vote };
    } catch (error) {
      const message = error.response?.data?.detail || "An unknown error occurred";
      return rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile", // Changed action type to be more specific
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUserProfile();
      return response; // This should now contain the user profile data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profile"
      );
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
    likedResults: {},
    dislikedResults: {},
    userexist: false,
    chatTitleUpdated: false,
    reportSubmitted: false,
    reportError: null,
    userProfile: null,
    profileLoading: false,
    profileError: null,
    chatDeletionStatus: 'idle',
    chatDeletionError: null,
  };

  export const UserSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {clearReportStatus: (state) => {
      state.reportSubmitted = false;
      state.reportError = null;},
      clearChatDeletionStatus: (state) => {
      state.chatDeletionStatus = 'idle';
      state.chatDeletionError = null;
    }},
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
        .addCase(deleteChat.pending, (state) => {
          state.chatDeletionStatus = 'loading';
          state.chatDeletionError = null;
        })
        .addCase(deleteChat.fulfilled, (state) => {
          state.chatDeletionStatus = 'succeeded';
          state.chatDeletionError = null;
        })
        .addCase(deleteChat.rejected, (state, action) => {
          state.chatDeletionStatus = 'failed';
          state.chatDeletionError = action.payload;
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
        .addCase(getUserProfile.pending, (state) => {
          state.profileLoading = true;
          state.profileError = null;
        })
        .addCase(getUserProfile.fulfilled, (state, action) => {
          state.profileLoading = false;
          state.userProfile = action.payload;
          state.profileError = null;
        })
        .addCase(getUserProfile.rejected, (state, action) => {
          state.profileLoading = false;
          state.profileError = action.payload;
          state.userProfile = null;
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
        .addCase(rateResponse.pending, (state) => {
          state.loading = true;
        })
        .addCase(rateResponse.fulfilled, (state, action) => {
          state.loading = false;
          if (action.payload.rating === 'liked') {
            state.likedResults[action.payload.response.result_id] = true;
            delete state.dislikedResults[action.payload.response.result_id];
          } else if (action.payload.rating === 'disliked') {
            state.dislikedResults[action.payload.response.result_id] = true;
            delete state.likedResults[action.payload.response.result_id];
          }
        })
        .addCase(rateResponse.rejected, (state, action) => {
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
        })
        .addCase(reportResponse.pending, (state) => {
          state.loading = true;
          state.reportSubmitted = false;
          state.reportError = null;
        })
        .addCase(reportResponse.fulfilled, (state) => {
          state.loading = false;
          state.reportSubmitted = true;
        })
        .addCase(reportResponse.rejected, (state, action) => {
          state.loading = false;
          state.reportError = action.payload;
        });
    },
  });


// Export userSlice actions and reducer
export const { clearReportStatus } = UserSlice.actions;
export default UserSlice.reducer;
