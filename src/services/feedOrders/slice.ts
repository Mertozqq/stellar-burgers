import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  total: number;
  totalToday: number;
};

const initialState: TOrdersState = {
  orders: [],
  loading: false,
  total: 0,
  totalToday: 0
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {
    // setOrderRequest: (state, action: PayloadAction<boolean>) => {
    //   state.orderRequest = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersApi.pending, (state) => {
        console.log('PENDING');
        state.loading = true;
        // state.orders = [];
      })
      .addCase(getOrdersApi.rejected, (state, action) => {
        console.log('REJECTED', action.error, action.payload);

        state.loading = false;
        // state.orders = [];
      })
      .addCase(getOrdersApi.fulfilled, (state, action) => {
        console.log('FULFILLED', action.payload);
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
// export const { setOrderRequest } = orderSlice.actions;

export const {
  getFeedOrdersStatus,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} = feedOrdersSlice.selectors;
