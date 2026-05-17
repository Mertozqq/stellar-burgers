import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  error: string | null;
  isConnected: boolean;
  orders: TOrder[];
  loading: boolean;
  total: number;
  totalToday: number;
};

export const initialState: TOrdersState = {
  error: null,
  isConnected: false,
  orders: [],
  loading: false,
  total: 0,
  totalToday: 0
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {
    setFeedOrdersConnecting: (state) => {
      state.loading = true;
      state.error = null;
    },
    setFeedOrdersData: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.loading = false;
      state.error = null;
      state.isConnected = true;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    setFeedOrdersDisconnected: (state) => {
      state.isConnected = false;
      state.loading = false;
    },
    setFeedOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.isConnected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersApi.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load feed orders';
      })
      .addCase(getOrdersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
  selectors: {
    getFeedOrdersStatus: (state): boolean => state.loading,
    getFeedOrders: (state): TOrder[] => state.orders,
    getFeedTotal: (state): number => state.total,
    getFeedTotalToday: (state): number => state.totalToday,
    getFeedOrdersConnected: (state): boolean => state.isConnected,
    getFeedOrdersError: (state): string | null => state.error
  }
});

export const {
  setFeedOrdersConnecting,
  setFeedOrdersData,
  setFeedOrdersDisconnected,
  setFeedOrdersError
} = feedOrdersSlice.actions;

export const {
  getFeedOrdersStatus,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedOrdersConnected,
  getFeedOrdersError
} = feedOrdersSlice.selectors;
