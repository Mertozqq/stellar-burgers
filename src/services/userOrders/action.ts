import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUserOrdersAction = createAsyncThunk(
  'order/getUserOrders',
  async () => getOrdersApi()
);
