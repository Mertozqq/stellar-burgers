import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { getLoadingStatus } from '../../services/ingredients/slice';
import { useSelector } from '../../services/store';

const TEXT = {
  eyebrow:
    '\u043a\u043e\u0432\u0431\u043e\u0439 \u0431\u0443\u0440\u0433\u0435\u0440 / \u043c\u0435\u043d\u044e \u0434\u043d\u044f',
  title:
    '\u0421\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u0440\u0433\u0435\u0440 \u0441 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u043e\u043c',
  lead: '\u0412\u044b\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0431\u0443\u043b\u043a\u0438, \u0441\u043e\u0443\u0441\u044b \u0438 \u043d\u0430\u0447\u0438\u043d\u043a\u0438, \u0441\u043e\u0447\u0435\u0442\u0430\u0439\u0442\u0435 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u0437\u0430\u043a\u0430\u0437 \u043d\u0430 \u0433\u0440\u0438\u043b\u044c.',
  moodLabel:
    '\u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 \u0434\u043d\u044f',
  moodValue: '\u0434\u044b\u043c \u0438 \u0436\u0430\u0440',
  moodText:
    '\u041a\u043e\u043f\u0447\u0451\u043d\u044b\u0435 \u0441\u043e\u0443\u0441\u044b, \u0441\u043e\u0447\u043d\u044b\u0435 \u043a\u043e\u0442\u043b\u0435\u0442\u044b \u0438 \u0442\u0451\u043f\u043b\u044b\u0435 \u0431\u0443\u043b\u043a\u0438 \u0434\u043b\u044f \u043f\u043b\u043e\u0442\u043d\u043e\u0439 \u0438 \u0432\u044b\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0439 \u0441\u0431\u043e\u0440\u043a\u0438.',
  focusLabel: '\u0444\u043e\u043a\u0443\u0441 \u043c\u0435\u043d\u044e',
  focusValue:
    '\u043e\u0442\u0431\u043e\u0440\u043d\u044b\u0435 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b',
  focusText:
    '\u0411\u0443\u043b\u043a\u0438, \u0441\u043e\u0443\u0441\u044b \u0438 \u043d\u0430\u0447\u0438\u043d\u043a\u0438 \u043f\u043e\u0434\u043e\u0431\u0440\u0430\u043d\u044b \u0442\u0430\u043a, \u0447\u0442\u043e\u0431\u044b \u0432\u044b \u043c\u043e\u0433\u043b\u0438 \u0431\u044b\u0441\u0442\u0440\u043e \u0441\u043e\u0431\u0440\u0430\u0442\u044c \u0441\u0432\u043e\u044e \u0444\u0438\u0440\u043c\u0435\u043d\u043d\u0443\u044e \u043a\u043e\u043c\u0431\u0438\u043d\u0430\u0446\u0438\u044e.',
  market:
    '\u0432\u0438\u0442\u0440\u0438\u043d\u0430 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u043e\u0432',
  shelf:
    '\u0421\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u0440\u0433\u0435\u0440 \u0438\u0437 \u043b\u044e\u0431\u0438\u043c\u044b\u0445 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u043e\u0432',
  shelfText:
    '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u0441\u043d\u043e\u0432\u0443, \u0434\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043c\u044f\u0441\u043e, \u0441\u044b\u0440, \u043e\u0432\u043e\u0449\u0438 \u0438 \u0441\u043e\u0443\u0441\u044b, \u0447\u0442\u043e\u0431\u044b \u0441\u043e\u0431\u0440\u0430\u0442\u044c \u0431\u0443\u0440\u0433\u0435\u0440 \u043f\u043e\u0434 \u0441\u0432\u043e\u0439 \u0432\u043a\u0443\u0441.',
  signature:
    '\u0444\u0438\u0440\u043c\u0435\u043d\u043d\u0430\u044f \u0441\u0431\u043e\u0440\u043a\u0430',
  signatureText:
    '\u0414\u0432\u043e\u0439\u043d\u0430\u044f \u0431\u0443\u043b\u043a\u0430, \u0433\u043e\u0432\u044f\u0436\u044c\u044f \u043a\u043e\u0442\u043b\u0435\u0442\u0430, \u0447\u0435\u0434\u0434\u0435\u0440 \u0438 \u0430\u043a\u0446\u0435\u043d\u0442\u043d\u044b\u0439 \u0441\u043e\u0443\u0441 \u0434\u043b\u044f \u0441\u043e\u0447\u043d\u043e\u0439 \u043a\u043b\u0430\u0441\u0441\u0438\u043a\u0438.',
  style: '\u0441\u0442\u0438\u043b\u044c \u043f\u043e\u0434\u0430\u0447\u0438',
  styleText:
    '\u041e\u0442 \u043c\u044f\u0433\u043a\u0438\u0445 \u0431\u0443\u043b\u043e\u043a \u0434\u043e \u043e\u0441\u0442\u0440\u044b\u0445 \u0441\u043e\u0443\u0441\u043e\u0432 \u2014 \u0432\u0441\u0435 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b \u0433\u043e\u0442\u043e\u0432\u044b \u043a \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0439 \u0441\u0431\u043e\u0440\u043a\u0435.',
  liveText:
    '\u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u043a\u0430\u0437\u044b \u043f\u043e\u044f\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0432 \u043b\u0435\u043d\u0442\u0435 \u0441\u0440\u0430\u0437\u0443 \u043f\u043e\u0441\u043b\u0435 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f.',
  station: '\u0437\u043e\u043d\u0430 \u0437\u0430\u043a\u0430\u0437\u0430',
  finish:
    '\u041e\u0444\u043e\u0440\u043c\u0438\u0442\u0435 \u0437\u0430\u043a\u0430\u0437',
  finishText:
    '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u043e\u0441\u0442\u0430\u0432, \u0438\u0442\u043e\u0433\u043e\u0432\u0443\u044e \u0446\u0435\u043d\u0443 \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0431\u0443\u0440\u0433\u0435\u0440 \u043d\u0430 \u043f\u0440\u0438\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u0435.'
};

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(getLoadingStatus);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.heroMain}>
              <p className={styles.eyebrow}>{TEXT.eyebrow}</p>
              <h1 className={`${styles.title} text text_type_main-large`}>
                {TEXT.title}
              </h1>
              <p className={`text text_type_main-default ${styles.lead}`}>
                {TEXT.lead}
              </p>
            </div>
            <div className={styles.heroSide}>
              <article className={styles.noteCard}>
                <span className={styles.noteLabel}>{TEXT.moodLabel}</span>
                <strong className={styles.noteValue}>{TEXT.moodValue}</strong>
                <p className={`text text_type_main-small ${styles.noteText}`}>
                  {TEXT.moodText}
                </p>
              </article>
              <article className={styles.noteCard}>
                <span className={styles.noteLabel}>{TEXT.focusLabel}</span>
                <strong className={styles.noteValue}>{TEXT.focusValue}</strong>
                <p className={`text text_type_main-small ${styles.noteText}`}>
                  {TEXT.focusText}
                </p>
              </article>
            </div>
          </section>

          <section className={styles.catalogSection}>
            <div className={styles.catalogIntro}>
              <div>
                <p className={styles.sectionLabel}>{TEXT.market}</p>
                <h2 className='text text_type_main-medium'>{TEXT.shelf}</h2>
              </div>
              <p
                className={`text text_type_main-default ${styles.sectionText}`}
              >
                {TEXT.shelfText}
              </p>
            </div>
            <div className={styles.catalogLayout}>
              <div className={styles.catalogMain}>
                <BurgerIngredients />
              </div>
              <aside className={styles.catalogAside}>
                <div className={styles.asideCard}>
                  <span className={styles.asideTitle}>{TEXT.signature}</span>
                  <p className='text text_type_main-small'>
                    {TEXT.signatureText}
                  </p>
                </div>
                <div className={styles.asideCard}>
                  <span className={styles.asideTitle}>{TEXT.style}</span>
                  <p className='text text_type_main-small'>{TEXT.styleText}</p>
                </div>
                <div className={styles.asideAccent}>
                  <span className={styles.asideMetric}>24/7</span>
                  <p className='text text_type_main-small'>{TEXT.liveText}</p>
                </div>
              </aside>
            </div>
          </section>

          <section className={styles.builderSection}>
            <div className={styles.builderIntro}>
              <p className={styles.sectionLabel}>{TEXT.station}</p>
              <h2 className='text text_type_main-medium'>{TEXT.finish}</h2>
              <p
                className={`text text_type_main-default ${styles.sectionText}`}
              >
                {TEXT.finishText}
              </p>
            </div>
            <div className={styles.builderWrap}>
              <BurgerConstructor />
            </div>
          </section>
        </main>
      )}
    </>
  );
};
