import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrders } from './action';
import { TOrder } from '@utils-types';
import { error } from 'console';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error?: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  loading: false,
  error: null
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
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.orders = [];
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.error.toString();
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      });
  },
  selectors: {
    getFeedOrdersStatus: (state): boolean => state.loading,
    getFeedOrders: (state): TOrder[] => state.orders
  }
});
// export const { setOrderRequest } = orderSlice.actions;

export const { getFeedOrdersStatus, getFeedOrders } = feedOrdersSlice.selectors;
