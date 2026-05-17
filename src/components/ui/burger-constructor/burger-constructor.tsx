import React, { FC } from 'react';
import {
  Button,
  ConstructorElement
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

const TEXT = {
  top: '\u0432\u0435\u0440\u0445',
  bottom: '\u043d\u0438\u0437',
  chooseBuns:
    '\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043b\u043a\u0438',
  addFillings:
    '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043d\u0430\u0447\u0438\u043d\u043a\u0438, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c',
  send: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0433\u0440\u0438\u043b\u044c',
  preparing:
    '\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u0437\u0430\u043a\u0430\u0437...'
};

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor}>
    {constructorItems.bun ? (
      <div className={`${styles.element} mb-4 mr-4`}>
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (${TEXT.top})`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        {TEXT.chooseBuns}
      </div>
    )}
    <ul className={styles.elements}>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          {TEXT.addFillings}
        </div>
      )}
    </ul>
    {constructorItems.bun ? (
      <div className={`${styles.element} mt-4 mr-4`}>
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (${TEXT.bottom})`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        {TEXT.chooseBuns}
      </div>
    )}
    <div className={styles.total}>
      <div className={styles.cost}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <span className={`text ${styles.text} ${styles.currency}`}>
          &#8381;
        </span>
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        extraClass={styles.orderButton}
        children={TEXT.send}
        onClick={onOrderClick}
      />
    </div>

    {orderRequest && (
      <Modal onClose={closeOrderModal} title={TEXT.preparing}>
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? TEXT.preparing : ''}
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
