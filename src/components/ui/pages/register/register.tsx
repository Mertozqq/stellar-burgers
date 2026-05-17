import { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';

const TEXT = {
  title: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f',
  name: '\u0418\u043c\u044f',
  submit:
    '\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f',
  loginQuestion:
    '\u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?',
  loginLink: '\u0412\u043e\u0439\u0442\u0438'
};

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  userName,
  setUserName
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>{TEXT.title}</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='register'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='text'
            placeholder={TEXT.name}
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            name='name'
            error={false}
            errorText=''
            size='default'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={false}
            errorText=''
            size='default'
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            {TEXT.submit}
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        {TEXT.loginQuestion}
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          {TEXT.loginLink}
        </Link>
      </div>
    </div>
  </main>
);
