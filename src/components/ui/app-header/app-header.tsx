import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

const TEXT = {
  builder: '\u041a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442\u043e\u0440',
  feed: '\u041b\u0435\u043d\u0442\u0430 \u0437\u0430\u043a\u0430\u0437\u043e\u0432',
  eyebrow:
    '\u043a\u043e\u0432\u0431\u043e\u0439\u0441\u043a\u0430\u044f \u0431\u0443\u0440\u0433\u0435\u0440\u043d\u0430\u044f',
  brand:
    '\u041a\u043e\u0432\u0431\u043e\u0439 \u0411\u0443\u0440\u0433\u0435\u0440',
  account:
    '\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442'
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={styles.menu}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                {TEXT.builder}
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>{TEXT.feed}</p>
            </>
          )}
        </NavLink>
      </div>
      <NavLink to='/' className={styles.brand}>
        <span className={styles.brand_eyebrow}>{TEXT.eyebrow}</span>
        <span className={styles.brand_title}>{TEXT.brand}</span>
      </NavLink>
      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>
                {userName || TEXT.account}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
