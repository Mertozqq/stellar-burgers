import { FC } from 'react';

import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

const TEXT = {
  name: '\u0418\u043c\u044f',
  email: 'E-mail',
  password: '\u041f\u0430\u0440\u043e\u043b\u044c',
  cancel: '\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c',
  save: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c'
};

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => (
  <main className={commonStyles.container}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <form
      className={`mt-30 ${styles.form} ${commonStyles.form}`}
      onSubmit={handleSubmit}
    >
      <div className='pb-6'>
        <Input
          type='text'
          placeholder={TEXT.name}
          onChange={handleInputChange}
          value={formValue.name}
          name='name'
          error={false}
          errorText=''
          size='default'
          icon='EditIcon'
        />
      </div>
      <div className='pb-6'>
        <Input
          type='email'
          placeholder={TEXT.email}
          onChange={handleInputChange}
          value={formValue.email}
          name='email'
          error={false}
          errorText=''
          size='default'
          icon='EditIcon'
        />
      </div>
      <div className='pb-6'>
        <Input
          type='password'
          placeholder={TEXT.password}
          autoComplete='new-password'
          onChange={handleInputChange}
          value={formValue.password}
          name='password'
          error={false}
          errorText=''
          size='default'
          icon='EditIcon'
        />
      </div>
      {isFormChanged && (
        <div className={styles.button}>
          <Button
            type='secondary'
            htmlType='button'
            size='medium'
            onClick={handleCancel}
          >
            {TEXT.cancel}
          </Button>
          <Button type='primary' size='medium' htmlType='submit'>
            {TEXT.save}
          </Button>
        </div>
      )}
      {updateUserError && (
        <p className={`${commonStyles.error} pt-5 text text_type_main-default`}>
          {updateUserError}
        </p>
      )}
    </form>
  </main>
);
