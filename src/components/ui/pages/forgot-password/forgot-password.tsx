import { FC } from 'react';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { PageUIProps } from '../common-type';

const TEXT = {
  title:
    '\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0430\u0440\u043e\u043b\u044f',
  emailPlaceholder: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 e-mail',
  submit:
    '\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c',
  loginQuestion:
    '\u0412\u0441\u043f\u043e\u043c\u043d\u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c?',
  loginLink: '\u0412\u043e\u0439\u0442\u0438'
};

export const ForgotPasswordUI: FC<PageUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>{TEXT.title}</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='email'
            placeholder={TEXT.emailPlaceholder}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={false}
            errorText=''
            size='default'
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
