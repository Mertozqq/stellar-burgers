import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserData,
  updateUser
} from './actions';
import { TOrder, TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        // state.isAuthChecked = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
  selectors: {
    getUser: (state): TUser | null => state.user,
    getIsAuthChecked: (state): boolean => state.isAuthChecked,
    getError: (state): string | null => state.error
  }
});
export const { setUser, setIsAuthChecked } = userSlice.actions;

export const { getUser, getIsAuthChecked, getError } = userSlice.selectors;
