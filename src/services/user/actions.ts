import {
  registerUserApi,
  TRegisterData,
  loginUserApi,
  logoutApi,
  TLoginData,
  refreshToken,
  getUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { setIsAuthChecked, setUser } from './slice';

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const getUserData = createAsyncThunk('user/getUserData', async () =>
  getUserApi()
);

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  if (response.success) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
  return response.success;
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);

    if (response.success) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return response.success;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: TUser) =>
    // const response = await updateUserApi(data);
    updateUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (
      getCookie('accessToken') != undefined ||
      localStorage.getItem('refreshToken') != null
    ) {
      getUserApi()
        .then((user) => {
          dispatch(setUser(user.user));
        })
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(setUser(null));
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);
