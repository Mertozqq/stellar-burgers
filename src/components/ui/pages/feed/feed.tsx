import { FC, memo } from 'react';

import styles from './feed.module.css';

import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

const TEXT = {
  kicker:
    '\u043e\u043d\u043b\u0430\u0439\u043d-\u0442\u0430\u0431\u043b\u043e \u043a\u0443\u0445\u043d\u0438',
  title:
    '\u041b\u0435\u043d\u0442\u0430 \u0437\u0430\u043a\u0430\u0437\u043e\u0432',
  description:
    '\u0421\u043b\u0435\u0434\u0438\u0442\u0435 \u0437\u0430 \u043d\u043e\u0432\u044b\u043c\u0438 \u0437\u0430\u043a\u0430\u0437\u0430\u043c\u0438, \u0438\u0445 \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043c\u0438 \u0438 \u043e\u0431\u0449\u0435\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u043e\u0439 \u043a\u0443\u0445\u043d\u0438 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438.',
  refresh: '\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c'
};

export const FeedUI: FC<FeedUIProps> = memo(({ orders, handleGetFeeds }) => (
  <main className={styles.containerMain}>
    <section className={styles.titleBox}>
      <div className={styles.titleContent}>
        <p className={styles.kicker}>{TEXT.kicker}</p>
        <h1 className={`${styles.title} text text_type_main-large`}>
          {TEXT.title}
        </h1>
        <p className={`text text_type_main-default ${styles.description}`}>
          {TEXT.description}
        </p>
      </div>
      <RefreshButton text={TEXT.refresh} onClick={handleGetFeeds} />
    </section>
    <div className={styles.main}>
      <section className={`${styles.columnPanel} ${styles.columnOrders}`}>
        <OrdersList orders={orders} />
      </section>
      <section className={`${styles.columnPanel} ${styles.columnInfo}`}>
        <FeedInfo />
      </section>
    </div>
  </main>
));
