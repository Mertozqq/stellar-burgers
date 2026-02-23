import reducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  changeIngredientsPositionTop,
  changeIngredientsPositionBottom
} from '../src/services/constructor/slice';

import type { TConstructorIngredient } from '../src/utils/types';

describe('burgerConstructorSlice reducer', () => {
  const makeIngredient = (id: string, name = `ing-${id}`): TConstructorIngredient => ({
    id,
    _id: `mongo-${id}`,
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

  const A = makeIngredient('a');
  const B = makeIngredient('b');
  const C = makeIngredient('c');

  it('обрабатывает добавление ингредиента', () => {
    const initialState = { bun: null, ingredients: [] as TConstructorIngredient[] };

    const action = {
      type: addIngredientToConstructor.type,
      payload: A
    };

    const nextState = reducer(initialState, action);

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(A);
    expect(nextState.bun).toBeNull();
  });

  it('обрабатывает удаление ингредиента', () => {

    const initialState = { bun: null, ingredients: [A, B, C] };

    const nextState = reducer(initialState, removeIngredientFromConstructor(B));

    expect(nextState.ingredients).toHaveLength(2);
    expect(nextState.ingredients).toEqual([A, C]);

  });

  it('обрабатывает изменение порядка ингредиентов вверх (Top)', () => {
    const initialState = { bun: null, ingredients: [A, B, C] };

    const nextState = reducer(initialState, changeIngredientsPositionTop(B));

    expect(nextState.ingredients).toEqual([B, A, C]);
  });

  it('обрабатывает изменение порядка ингредиентов вниз (Bottom)', () => {
    const initialState = { bun: null, ingredients: [A, B, C] };

    const nextState = reducer(initialState, changeIngredientsPositionBottom(B));

    expect(nextState.ingredients).toEqual([A, C, B]);
  });

  it('не меняет порядок, если двигаем первый элемент вверх', () => {
    const initialState = { bun: null, ingredients: [A, B, C] };

    const nextState = reducer(initialState, changeIngredientsPositionTop(A));

    expect(nextState.ingredients).toEqual([A, B, C]);
  });

  it('не меняет порядок, если двигаем последний элемент вниз', () => {
    const initialState = { bun: null, ingredients: [A, B, C] };

    const nextState = reducer(initialState, changeIngredientsPositionBottom(C));

    expect(nextState.ingredients).toEqual([A, B, C]);
  });
});