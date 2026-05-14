import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  total: number;
  totalToday: number;
};

export const initialState: TOrdersState = {
  orders: [],
  loading: false,
  total: 0,
  totalToday: 0
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrdersApi.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getOrdersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
  selectors: {
    getFeedOrdersStatus: (state): boolean => state.loading,
    getFeedOrders: (state): TOrder[] => state.orders,
    getFeedTotal: (state): number => state.total,
    getFeedTotalToday: (state): number => state.totalToday
  }
});

export const {
  getFeedOrdersStatus,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} = feedOrdersSlice.selectors;
