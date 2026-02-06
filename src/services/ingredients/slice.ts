import { createSlice } from '@reduxjs/toolkit';
import { getIngredients } from './action';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // _: {
    //   reducer: (state, action) => {
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    getIngredientsList: (state): TIngredient[] => state.ingredients,
    getErrorStatus: (state) => state.error,
    getLoadingStatus: (state) => state.loading
  }
});

export const { getIngredientsList, getErrorStatus, getLoadingStatus } =
  ingredientsSlice.selectors;
