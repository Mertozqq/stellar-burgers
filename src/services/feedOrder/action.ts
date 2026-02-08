import { getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (num: number) => getOrderByNumberApi(num)
);
