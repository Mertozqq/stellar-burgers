import { getOrdersApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getUserOrdersAction = createAsyncThunk(
  'order/getUserOrders',
  async () => getOrdersApi()
);
