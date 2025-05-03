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

export const verifyToken = createAsyncThunk(
  "token/verify",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TUser>(
        `${API_URL}/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Token verification response:", JSON.stringify(response.data));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token"); // Clear the token
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
    clearTokenState: () => initialState,
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
