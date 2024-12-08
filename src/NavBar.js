import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from './Api';
import { debounce } from 'lodash';


function NavBar({ onSearch }) {
    const [username, setUsername] = useState('');
    const [roleLevel, setRoleLevel] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    //Fetch Username
    useEffect(() => {
        if (isLoggedIn) {
            //Fetch the username of the logged-in user
            Api('http://localhost:5000/users/me', {
                method: 'GET',
            }, navigate) //Pass the navigate function to Api
                .then(data => {
                    setUsername(data?.username || ''); //Handle undefined data gracefully
                    setRoleLevel(data?.roleLevel || '');
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                });
        }
    }, [isLoggedIn, navigate]);

    //Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    //Search Delay
    const delaySearch = debounce((term) => {
        onSearch(term);
    }, 500);

    //Search Suggestions
    const fetchSuggestions = debounce(async (term) => {
        if (term.length > 0) {
            try {
                const response = await Api(`http://localhost:5000/data/suggestions?q=${term}`, { method: 'GET' });
                setSuggestions(response.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 300);

    //Handle Search
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        delaySearch(term);
        fetchSuggestions(term);
    };

    //Handle selecting a suggestion
    const handleSuggestionClick = (suggestion) => {
        navigate(`/details/${suggestion.claimNumber}`);
    };

    //Render
    return (
        <div>
            <nav id="main-nav">
                {isLoggedIn ? (
                    <>
                        <Link to="/home" className="nav-link">Home</Link>
                        <Link to="/warrantyInput" className="nav-link" >Create New Claim</Link>
                        <Link to="/product" className="nav-link">Register Product</Link>
                        <Link to="/serial-search" className="nav-link">Search By Serial</Link>
                        {roleLevel === 3 ? (
                            <>
                                <Link to="/set-roles" className="nav-link">Account Management</Link>
                            </>
                        ) : null}
                        <div id="search-container">
                            {username && (
                                <div id="user-info">
                                    <span>Logged in as: {username}</span>
                                    <span>Role Level: {roleLevel}</span>
                                </div>
                            )}
                            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
                            <input
                                type="text"
                                placeholder="Search..."
                                id="search-input"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)} //Show Suggestions
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} //Hide suggestions after short delay 
                            />

                            {/* Suggestion Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (

                                <ul className="suggestion-dropdown">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="suggestion-item"
                                        >
                                            {/*{suggestion.name || suggestion.claimNumber}*/}

                                            <span className="suggestion-claim-number">{suggestion.claimNumber}</span>
                                            <span className="suggestion-name">{suggestion.name}</span>
                                            <span className="suggestion-email">{suggestion.email}</span>

                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                    </>
                ) : null}
            </nav>
        </div>
    );
};

export default NavBar;