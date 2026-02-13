import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { getUser, setUser } from '../../services/user/slice';
import { useDispatch } from '../../services/store';
import { updateUser } from '../../services/user/actions';
export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email
      })
    );
    // setUser();
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user ? user.name : '',
      email: user ? user.email : '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
