import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getOrdersApi = createAsyncThunk('order/getOrders', getFeedsApi);
