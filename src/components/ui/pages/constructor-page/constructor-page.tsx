import { FC } from 'react';

import styles from './constructor-page.module.css';

import { ConstructorPageUIProps } from './type';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerConstructor } from '@components';

const TEXT = {
  kicker:
    '\u0441\u0435\u0434\u043b\u0430\u0439\u0442\u0435\u0441\u044c / \u0441\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u0431\u0443\u0440\u0433\u0435\u0440',
  title:
    '\u0421\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u043a\u043e\u0432\u0431\u043e\u0439\u0441\u043a\u0438\u0439 \u0431\u0443\u0440\u0433\u0435\u0440',
  description:
    '\u0421\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043b\u043a\u0438, \u0441\u043e\u0443\u0441\u044b \u0438 \u043d\u0430\u0447\u0438\u043d\u043a\u0438 \u0432 \u0431\u043e\u043b\u0435\u0435 \u0442\u0451\u043f\u043b\u043e\u043c \u0438 \u0432\u044b\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u043c \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0438.',
  ingredients:
    '\u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b',
  picks: '\u0441\u0432\u0435\u0436\u0438\u0439 \u0432\u044b\u0431\u043e\u0440',
  assembly: '\u0441\u0431\u043e\u0440\u043a\u0430',
  station: '\u0437\u043e\u043d\u0430 \u0441\u0431\u043e\u0440\u043a\u0438'
};

export const ConstructorPageUI: FC<ConstructorPageUIProps> = ({
  isIngredientsLoading
}) => (
  <>
    {isIngredientsLoading ? (
      <Preloader />
    ) : (
      <main className={styles.containerMain}>
        <section className={styles.hero}>
          <p className={styles.kicker}>{TEXT.kicker}</p>
          <div className={styles.heroRow}>
            <h1 className={`${styles.title} text text_type_main-large`}>
              {TEXT.title}
            </h1>
            <p className={`text text_type_main-default ${styles.description}`}>
              {TEXT.description}
            </p>
          </div>
        </section>
        <div className={styles.main}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>{TEXT.ingredients}</span>
              <span className={styles.panelHint}>{TEXT.picks}</span>
            </div>
            <BurgerIngredients />
          </section>
          <section className={`${styles.panel} ${styles.panelAccent}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>{TEXT.assembly}</span>
              <span className={styles.panelHint}>{TEXT.station}</span>
            </div>
            <BurgerConstructor />
          </section>
        </div>
      </main>
    )}
  </>
);
