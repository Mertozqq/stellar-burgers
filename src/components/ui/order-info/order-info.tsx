import React, { FC, memo } from 'react';
import { FormattedDate } from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';

const TEXT = {
  composition: '\u0421\u043e\u0441\u0442\u0430\u0432:'
};

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => (
  <div className={styles.wrap}>
    <h3 className={`text text_type_main-medium  pb-3 pt-10 ${styles.header}`}>
      {orderInfo.name}
    </h3>
    <OrderStatus status={orderInfo.status} />
    <p className={`text text_type_main-medium pt-15 pb=6`}>
      {TEXT.composition}
    </p>
    <ul className={`${styles.list} mb-8`}>
      {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
        <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
          <div className={styles.img_wrap}>
            <div className={styles.border}>
              <img
                className={styles.img}
                src={item.image_mobile}
                alt={item.name}
              />
            </div>
          </div>
          <span className='text text_type_main-default pl-4'>{item.name}</span>
          <span
            className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
          >
            {item.count} x {item.price}
          </span>
          <span className={`text text_type_digits-default ${styles.currency}`}>
            &#8381;
          </span>
        </li>
      ))}
    </ul>
    <div className={styles.bottom}>
      <p className='text text_type_main-default text_color_inactive'>
        <FormattedDate date={orderInfo.date} />
      </p>
      <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
        {orderInfo.total}
      </span>
      <span className={`text text_type_digits-default ${styles.currency}`}>
        &#8381;
      </span>
    </div>
  </div>
));
