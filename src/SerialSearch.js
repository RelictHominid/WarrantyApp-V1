import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SerialSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [serialData, setSerialData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSerialData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5000/product', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result)
                    setSerialData(result.product);
                } else {
                    console.error('Failed to fetch serial data');
                }

            } catch (error) {
                console.error('Error fetching serial data:', error);
            };

        };

        fetchSerialData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const formatSearchTerm = (term) => {
            const cleanedTerm = term.replace(/\D/g, '');
            return cleanedTerm.replace(/(.{3})/g, '$1-').slice(0, -1);
        };

        const formattedSearchTerm = formatSearchTerm(searchTerm);

        if (formattedSearchTerm.trim() === '') {
            setErrorMessage('Please enter a valid serial number');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/product/${formattedSearchTerm}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json',
                }
            });

            if (response.ok) {
                navigate(`/product/${formattedSearchTerm}`);
            } else if (response.status === 404) {
                setErrorMessage('Serial number not found');
            } else {
                setErrorMessage('Error searching for serial number');
            }
        } catch (error) {
            setErrorMessage('Error searching for serial number');
        }

    }

    return (
        <div className="serial-search-page" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1>Search for Serial Number</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter serial number"
                    style={{ width: '300px', padding: '10px', fontSize: '18px' }}
                />
                <button type="submit" style={{ marginLeft: '10px', padding: '10px', fontSize: '18px' }}>
                    Search
                </button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}


            {/* Table for serial numbers*/}
            {serialData.length > 0 ? (
                <>
                    <h2>Recently Registered Serial Numbers</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Date of purchase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serialData.map((serial, index) => (
                                <tr key={index}>
                                    <td>{serial.serialNumber}</td>
                                    <td>{serial.brand}</td>
                                    <td>{serial.model}</td>
                                    <td>{serial.dateOfPurchase}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <h2>No serial numbers registered yet.</h2>
            )}
        </div>
    );

};

export default SerialSearch;
