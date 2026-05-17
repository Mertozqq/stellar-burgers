import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

const TEXT = {
  alt: '\u043f\u0440\u0435\u0432\u044c\u044e \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u0430',
  add: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u043f\u043e\u0434\u043d\u043e\u0441'
};

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id } = ingredient;

    return (
      <li className={styles.container}>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt={TEXT.alt} />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <span
              className={`text text_type_digits-default ${styles.currency}`}
            >
              &#8381;
            </span>
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <AddButton
          text={TEXT.add}
          onClick={handleAdd}
          extraClass={styles.addButton}
        />
      </li>
    );
  }
);
