import React from 'react';
import { Navigate, /*useLocation*/ } from 'react-router-dom';
//import { useAuth } from './Authenticator';


const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

//const PrivateRoute = ({ children }) => {
//    const { user } = useAuth();
//    const location = useLocation();

//    return user ? (
//        children
//    ) : (
//        <Navigate to="/login" state={{ from: location }} replace />
//    );
//};





export default PrivateRoute;