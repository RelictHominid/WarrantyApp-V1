import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthService = {
    login: (username, password) => {
        return axios.post('/login', { username, password })
            .then(response => {
                if (response.data.token) {
                    console.log('Storing user:', response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            })
            .catch(error => {
                console.error("Login error:", error);
                return Promise.reject("Login failed. Please try again.");
            });
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    getAuthHeader: () => {
        const user = AuthService.getCurrentUser();
        const header = user ? { 'Authorization': 'Bearer ' + user.token } : {};
        /*return user ? { 'Authorization': 'Bearer ' + user.token } : {};*/
        return header;
    }
};

//const AuthService = {
//    login: (username, password) => { 
//        return axios.post('/login', { username, password })
//            .then(response => {
//                if (response.data.token) {
//                    localStorage.setItem('user', JSON.stringify({ token: response.data.token }))
//                }
//                return response.data;
//            })
//            .catch(error => {
//                console.error("Login error:", error);
//                return Promise.reject("Login failed. Please try again.")
//            });
//    },

//    logout: () => {
//        localStorage.removeItem('user');
//    },

//    getAuthHeader: () => {
//        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
//        return token ? { 'Authorization': 'Bearer ' + token } : {};
//    },

//    isTokenExpired: (token) => { 
//        if (!token) return true;
//        try {
//            const decoded = jwtDecode(token);
//            return decoded.exp < Date.now() / 1000;
//        } catch (error) { 
//            console.error('Error decoding token:', error)
//            return true;
//        }
//    },

//    getCurrentUser: () => {
//        const user = localStorage.getItem('user');
//        return user ? JSON.parse(user) : null;
//    }
//}



export default AuthService;