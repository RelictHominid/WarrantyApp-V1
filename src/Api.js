const Api = (url, options = {}, navigate) => {
    const token = localStorage.getItem('token');

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, { ...options, headers })
        .then(response => {
            if (response === 401) {
                //Token has expired or invalid
                localStorage.removeItem('token');
                //Call the navigate function to redirect to login
                navigate('/login');
            }
            return response.json();
        })
        .catch(error => {
            console.error('API error:', error);
        });
};

export default Api;