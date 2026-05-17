import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserOrdersAction } from './action';
import { TOrder } from '@utils-types';

type TOrdersState = {
  error: string | null;
  isConnected: boolean;
  loading: boolean;
  orders: TOrder[];
};

export const initialState: TOrdersState = {
  error: null,
  isConnected: false,
  loading: false,
  orders: []
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    addUserOrder: (state, action: PayloadAction<TOrder>) => {
      state.orders = [...state.orders, action.payload];
    },
    setUserOrdersConnecting: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUserOrdersData: (state, action: PayloadAction<TOrder[]>) => {
      state.loading = false;
      state.error = null;
      state.isConnected = true;
      state.orders = action.payload;
    },
    setUserOrdersDisconnected: (state) => {
      state.isConnected = false;
      state.loading = false;
    },
    setUserOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.isConnected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrdersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrdersAction.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load user orders';
      })
      .addCase(getUserOrdersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload;
      });
  },
  selectors: {
    getUserOrders: (state): TOrder[] => state.orders,
    getUserOrdersLoading: (state): boolean => state.loading,
    getUserOrdersConnected: (state): boolean => state.isConnected,
    getUserOrdersError: (state): string | null => state.error
  }
});

export const {
  addUserOrder,
  setUserOrdersConnecting,
  setUserOrdersData,
  setUserOrdersDisconnected,
  setUserOrdersError
} = userOrdersSlice.actions;

export const {
  getUserOrders,
  getUserOrdersLoading,
  getUserOrdersConnected,
  getUserOrdersError
} = userOrdersSlice.selectors;
