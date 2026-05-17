import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/ingredients/action';
import { getUserData } from '../../services/user/actions';

const TEXT = {
  ingredientDetails:
    '\u0414\u0435\u0442\u0430\u043b\u0438 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u0430'
};

const App = () => {
  const isLoading = false;
  const error = false;
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUserData());
  }, []);

  const feedMatch = useMatch('/feed/:number');
  const orderMatch = useMatch('/profile/orders/:number');
  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <NotFound404 />
      ) : (
        <>
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={<ProtectedRoute onlyUnAuth component={<Login />} />}
            />
            <Route
              path='/register'
              element={<ProtectedRoute onlyUnAuth component={<Register />} />}
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth component={<ForgotPassword />} />
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth component={<ResetPassword />} />
              }
            />
            <Route
              path='/profile'
              element={<ProtectedRoute component={<Profile />} />}
            />
            <Route
              path='/profile/orders'
              element={<ProtectedRoute component={<ProfileOrders />} />}
            />

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route
              path='/ingredients/:id'
              element={
                <div className={styles.detailPageWrap}>
                  <p
                    className={`text text_type_main-large ${styles.detailHeader}`}
                  >
                    {TEXT.ingredientDetails}
                  </p>
                  <IngredientDetails />
                </div>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={<ProtectedRoute component={<OrderInfo />} />}
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={`#${feedMatch?.params.number ?? ''}`}
                    onClose={handleModalClose}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title={TEXT.ingredientDetails}
                    onClose={handleModalClose}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute
                    component={
                      <Modal
                        title={`#${orderMatch?.params.number ?? ''}`}
                        onClose={handleModalClose}
                      >
                        <OrderInfo />
                      </Modal>
                    }
                  />
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
