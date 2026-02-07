import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getOrders = createAsyncThunk('order/getOrders', async () =>
  getFeedsApi()
);
