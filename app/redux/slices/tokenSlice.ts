import { TUser } from "@/app/types/type";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API;

interface TokenState {
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  user: TUser | null;
}

const getStoredToken = ():string | null => {
  if(typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

const getStoredUser = ():TUser | null => {
  if(typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export const verifyToken = createAsyncThunk(
  "token/verify",
  async (token: string, { rejectWithValue }) => {
    console.log("Verifying token:", token);
    try {
      const response = await axios.get<TUser>(
        `${API_URL}/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token"); // Clear the token
        console.log("Token is invalid or expired. Cleared from local storage.");
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: TokenState = {
  isVerified: false,
  isLoading: false,
  error: null,
  user: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    clearTokenState: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return initialState;
    },
    // initializeFromStorage: (state) => {
    //   const storedUser = getStoredUser();
    //   const storedToken = getStoredToken();
    //   if (storedUser && storedToken) {
    //     state.user = storedUser;
    //     state.isVerified = true;
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        verifyToken.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.isVerified = true;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isVerified = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearTokenState } = tokenSlice.actions;
export default tokenSlice.reducer;
