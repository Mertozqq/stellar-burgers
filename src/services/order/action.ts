import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const makeOrder = createAsyncThunk(
  'order/makeOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);
