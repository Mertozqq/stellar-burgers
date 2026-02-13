import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserOrdersAction } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
};

const initialState: TOrdersState = {
  orders: []
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    addUserOrder: (state, action: PayloadAction<TOrder>) => {
      state.orders = [...state.orders, action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrdersAction.pending, (state) => {
        // state.loading = true;
        // state.orders = [];
      })
      .addCase(getUserOrdersAction.rejected, (state, action) => {
        // state.loading = false;
        // state.orders = [];
      })
      .addCase(getUserOrdersAction.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
  selectors: {
    getUserOrders: (state): TOrder[] => state.orders
  }
});
export const { addUserOrder } = userOrdersSlice.actions;

export const { getUserOrders } = userOrdersSlice.selectors;
