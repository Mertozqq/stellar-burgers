import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import { useDispatch } from '../../services/store';
import {
  removeIngredientFromConstructor,
  changeIngredientsPositionBottom,
  changeIngredientsPositionTop
} from '../../services/constructor/slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(changeIngredientsPositionBottom(ingredient));
    };

    const handleMoveUp = () => {
      dispatch(changeIngredientsPositionTop(ingredient));
    };

    const handleClose = () => {
      dispatch(removeIngredientFromConstructor(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
