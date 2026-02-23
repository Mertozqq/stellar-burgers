import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumber as getOrderByNumberApi } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  order: TOrder | null;
  loading: boolean;
};

export const initialState: TOrdersState = {
  order: null,
  loading: false
};

export const feedOrderSlice = createSlice({
  name: 'feedOrder',
  initialState,
  reducers: {
    // setOrderRequest: (state, action: PayloadAction<boolean>) => {
    //   state.orderRequest = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumberApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumberApi.rejected, (state, action) => {
        state.loading = false;
        state.order = null;
      })
      .addCase(getOrderByNumberApi.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.orders[0];
      });
  },
  selectors: {
    getFeedOrderStatus: (state): boolean => state.loading,
    getFeedOrder: (state): TOrder | null => state.order
  }
});
// export const { setOrderRequest } = orderSlice.actions;

export const { getFeedOrderStatus, getFeedOrder } = feedOrderSlice.selectors;
