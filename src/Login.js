import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth } from './Authenticator';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { setToken } = useAuth();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/home');
        }
    }, [navigate])

    const handleLogin = async (e) => { 
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);

                setToken(data.token);
                console.log('Token set in localStorage:', data.token);
                navigate('/home');
            } else {
                console.error('Login Failed!')
            }
        } catch (error) { 
            console.error('Error logging in:', error);
        }
    }

    return (
      <div>
        
        <div className="login-container">                
            <form onSubmit={handleLogin} className="login-form">
                    <h2 className="register-heading">Log In</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                />
                <button type="submit" className="login-button">Login</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to='/register'>Register</Link></p>
                </div>
            
            </form>
        </div>
      </div>
    )
};

export default Login;