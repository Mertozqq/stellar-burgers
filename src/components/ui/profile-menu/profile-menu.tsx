import { FC } from 'react';
import styles from './profile-menu.module.css';
import { NavLink } from 'react-router-dom';
import { ProfileMenuUIProps } from './type';

const TEXT = {
  profile: '\u041f\u0440\u043e\u0444\u0438\u043b\u044c',
  orders:
    '\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u043e\u0432',
  logout: '\u0412\u044b\u0439\u0442\u0438',
  profileHint:
    '\u0417\u0434\u0435\u0441\u044c \u043c\u043e\u0436\u043d\u043e \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0438\u043c\u044f, e-mail \u0438 \u0434\u0440\u0443\u0433\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430.',
  ordersHint:
    '\u0417\u0434\u0435\u0441\u044c \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044f \u0438\u0441\u0442\u043e\u0440\u0438\u044f \u0432\u0430\u0448\u0438\u0445 \u0437\u0430\u043a\u0430\u0437\u043e\u0432.'
};

export const ProfileMenuUI: FC<ProfileMenuUIProps> = ({
  pathname,
  handleLogout
}) => (
  <>
    <NavLink
      to='/profile'
      className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      }
      end
    >
      {TEXT.profile}
    </NavLink>
    <NavLink
      to='/profile/orders'
      className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      }
    >
      {TEXT.orders}
    </NavLink>
    <button
      className={`text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.button}`}
      onClick={handleLogout}
    >
      {TEXT.logout}
    </button>
    <p className='pt-20 text text_type_main-default text_color_inactive'>
      {pathname === '/profile' ? TEXT.profileHint : TEXT.ordersHint}
    </p>
  </>
);
