import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

const Notification = () => {
  const { state } = useContext(NotificationContext);

  if (state.message === null) {
    console.log('state.message is null');
    return null;
  }
  console.log(state.message)
  return (
    <div className={state.type}>
      {state.message}
    </div>
  );
};

export default Notification;