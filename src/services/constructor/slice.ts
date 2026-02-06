import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
type TIngredientsState = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TIngredientsState = {
  bun: null,
  ingredients: []
};

// type TBunsId = { _id: string | null; }
// type TIngredientsState = { bun: TBunsId, ingredients: Array<TIngredient>; };
// const initialState: TIngredientsState = {
//   bun: {
//     _id: null,
//   },
//   ingredients: [],
// };

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor(state, action: PayloadAction<TIngredient>) {
      state.ingredients.push({ ...action.payload, id: nanoid() });
    },
    addBunToConstructor(state, action: PayloadAction<TIngredient>) {
      state.bun = { ...action.payload, id: nanoid() };
    }
  },

  selectors: {
    getConstructorIngredientsList: (state): TConstructorIngredient[] =>
      state.ingredients,
    getConstructorBun: (state) => state.bun
  }
});

export const { getConstructorIngredientsList, getConstructorBun } =
  burgerConstructorSlice.selectors;

export const { addIngredientToConstructor, addBunToConstructor } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
