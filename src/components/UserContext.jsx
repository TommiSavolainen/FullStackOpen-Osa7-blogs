import React, { useReducer, createContext } from 'react';


export const initialState = {
    user: null
  };
  
// Create a new context
export const UserContext = createContext();

// Define the reducer
export const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
        return { ...state, user: action.user };
    case 'CLEAR_USER':
        return { ...state, user: null };
    default:
        throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Define a provider component
export const UserProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={{ user, dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};