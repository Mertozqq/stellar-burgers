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
    },
    removeIngredientFromConstructor(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      state.ingredients = state.ingredients.filter(
        (val) => val.id != action.payload.id
      );
      console.log(state.ingredients);
    },
    changeIngredientsPositionTop(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index != -1 && index != 0) {
        const prevVal = state.ingredients[index - 1];
        state.ingredients[index - 1] = state.ingredients[index];
        state.ingredients[index] = prevVal;
      }
    },
    changeIngredientsPositionBottom(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index != -1 && index != state.ingredients.length - 1) {
        const nextVal = state.ingredients[index + 1];
        state.ingredients[index + 1] = state.ingredients[index];
        state.ingredients[index] = nextVal;
      }
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

export const {
  addIngredientToConstructor,
  addBunToConstructor,
  removeIngredientFromConstructor,
  changeIngredientsPositionBottom,
  changeIngredientsPositionTop
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
