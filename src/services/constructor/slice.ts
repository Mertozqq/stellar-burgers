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
    addIngredientToConstructor: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
        };
      }
    },
    addBunToConstructor: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.bun = action.payload;
      },
      prepare(bun: TIngredient) {
        return { payload: { ...bun, id: nanoid() } as TConstructorIngredient };
      }
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
    },
    clearBurgerConstructor(state) {
      state.bun = null;
      state.ingredients = [];
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
  changeIngredientsPositionTop,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
