import React, { useReducer, createContext } from 'react';

const NotificationContext = createContext();

const initialState = { message: null, type: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return { message: action.message, type: 'error' };
    case 'SET_SUCCESS':
      return { message: action.message, type: 'success' };
    default:
      return state;
  }
};

const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };