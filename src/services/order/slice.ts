import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeOrder } from './action';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(makeOrder.rejected, (state) => {
        state.orderRequest = false;
        state.orderModalData = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  },
  selectors: {
    getOrderRequestStatus: (state): boolean => state.orderRequest,
    getOrderModalData: (state): TOrder | null => state.orderModalData
  }
});
export const { setOrderRequest, clearOrderModalData } = orderSlice.actions;

export const { getOrderRequestStatus, getOrderModalData } =
  orderSlice.selectors;
