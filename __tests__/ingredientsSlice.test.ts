import { ingredientsSlice, initialState } from '../src/services/ingredients/slice';
import { getIngredients } from '../src/services/ingredients/action';
import type { TIngredient } from '../src/utils/types';

describe('ingredientsSlice reducer (extraReducers)', () => {
  const makeIngredient = (id: string, name = `ingredient-${id}`): TIngredient => ({
    _id: id,
    name,
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: '',
    image_large: '',
    image_mobile: ''
  });

  const getFreshInitialState = () => ({
    ...initialState,
    ingredients: [...initialState.ingredients]
  });

  it('pending: loading становится true, error сбрасывается в null', () => {
    const nextState = ingredientsSlice.reducer(
      getFreshInitialState(),
      getIngredients.pending('req-1')
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('fulfilled: записывает ингредиенты в store, loading становится false', () => {
    const payload: TIngredient[] = [makeIngredient('1'), makeIngredient('2')];

    const nextState = ingredientsSlice.reducer(
      getFreshInitialState(),
      getIngredients.fulfilled(payload, 'req-1')
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.ingredients).toEqual(payload);
  });

  it('rejected: записывает ошибку в store.error, loading становится false', () => {
    const action = getIngredients.rejected(new Error('Network error'), 'req-1');

    const nextState = ingredientsSlice.reducer(getFreshInitialState(), action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Network error');
  });

  it("rejected: если message отсутствует, error становится 'Error'", () => {
    

    const action = getIngredients.rejected(null, 'req-1');

    const nextState = ingredientsSlice.reducer(getFreshInitialState(), action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Rejected');
  });
});