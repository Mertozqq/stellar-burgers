import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getOrder = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  async () => getIngredientsApi()
);
