import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

const Notification = () => {
  const { state } = useContext(NotificationContext);

  if (state.message === null) {
    return null;
  }

  return (
    <div className={state.type}>
      {state.message}
    </div>
  );
};

export default Notification;