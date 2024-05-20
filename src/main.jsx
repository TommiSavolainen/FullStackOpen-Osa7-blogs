import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationProvider } from './components/NotificationContext'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContext, userReducer, initialState } from './components/UserContext';
import { useReducer } from 'react';

const queryClient = new QueryClient();

const MyComponent = () => {
    const [user, dispatchUser] = useReducer(userReducer, initialState);

    const userValue = {
        user,
        dispatchUser
    };

    return (
        <UserContext.Provider value={userValue}>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </QueryClientProvider>
        </UserContext.Provider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<MyComponent />);

// const [user, dispatchUser] = useReducer(userReducer, initialState);

// const userValue = {
//     user,
//     dispatchUser
// };



// ReactDOM.createRoot(document.getElementById('root')).render(
//     <UserContext.Provider value={userValue}>
//     <QueryClientProvider client={queryClient}>
//     <NotificationProvider>
//         <App />
//     </NotificationProvider>
//     </QueryClientProvider>
//     </UserContext.Provider>
//     );
