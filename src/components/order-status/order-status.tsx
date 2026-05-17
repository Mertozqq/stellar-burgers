import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: '\u0413\u043e\u0442\u043e\u0432\u0438\u0442\u0441\u044f',
  done: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d',
  created: '\u0421\u043e\u0437\u0434\u0430\u043d'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
