import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const MainTable = ({ searchTerm }) => {

    /*const warrantyData = useWarrantyData();*/
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState([]);
    const [searchDelay, setSearchDelay] = useState(searchTerm);
    const [loading, setLoading] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false)
    const [searching, setSearching] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        name: '',
        email: ''
    });

    const [roleLevel, setRoleLevel] = useState('');
    //const [username, setUsername] = useState('');

    /*const [serialData, setSerialData] = useState([]);*/


    //Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5000/data', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Fetched data:", result);
                    setData(Array.isArray(result.data) ? result.data : []);
                    setFilteredData(Array.isArray(result.data) ? result.data : []);

                } else {
                    console.error('Failed to fetch data');
                }


            } catch (error) {
                console.error('Error fetching data:', error);
            };
        };


        const fetchRole = async () => {
            const token = localStorage.getItem('token');
            /*console.log('Authorization token:', token);*/
            if (token) {
                fetch('http://localhost:5000/users/role', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((users) => {

                        if (users.roleLevel) {
                            console.log("User role retrieved", users.roleLevel);
                            setRoleLevel(users.roleLevel);
                        } else {
                            console.error('User ID not found in response:', users)
                        }

                    })
                    .catch((error) => {
                        console.error('Error fetching user ID:', error);
                    });
            };
        };

        //const fetchUsername = async () => {
        //    const token = localStorage.getItem('token');
        //    /*console.log('Authorization token:', token);*/
        //    if (token) {
        //        fetch('http://localhost:5000/users/username', {
        //            method: 'GET',
        //            headers: {
        //                'Authorization': `Bearer ${token}`,
        //                'Content-Type': 'application/json',
        //            },
        //        })
        //            .then((response) => response.json())
        //            .then((users) => {

        //                if (users.username) {
        //                    console.log("Username retrieved", users.username);
        //                    setUsername(users.username);
        //                } else {
        //                    console.error('Username not found in response:', users)
        //                }

        //            })
        //            .catch((error) => {
        //                console.error('Error fetching username:', error);
        //            });
        //    };
        //};

        fetchData();
        fetchRole();
        //    fetchUsername();
    }, []);


    //useEffect(() => {
    //    const fetchSerialData = async () => {
    //        const token = localStorage.getItem('token');
    //        try {
    //            const response = await fetch('http://localhost:5000/product', {
    //                headers: {
    //                    'Authorization': `Bearer ${token}`,
    //                },
    //            });

    //            if (response.ok) {
    //                const result = await response.json();
    //                setSerialData(result.serialData);
    //            } else {
    //                console.error('Failed to fetch serial data');
    //            }

    //        } catch (error) {
    //            console.error('Error fetching serial data:', error);
    //        };

    //    };

    //    fetchSerialData();
    //}, []);

    //Search New with useCallback
    const performSearch = useCallback(async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setSearching(true);
        setSearchComplete(false);

        if (searchDelay.trim()) {
            try {
                const response = await fetch(`http://localhost:5000/data/search?q=${searchDelay.trim()}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const result = await response.json();

                if (JSON.stringify(result.data) !== JSON.stringify(filteredData)) {
                    setFilteredData(result.data);
                }

            } catch (error) {
                console.error('Error during search:', error);
            } finally {
                setLoading(false);
                setSearching(false);
                setSearchComplete(true);
            }
        } else {
            setFilteredData(data);
            setLoading(false);
            setSearching(false);
            setSearchComplete(true);
        }
    }, [searchDelay, data, filteredData]);

    //Use effect for search function
    useEffect(() => {
        const handler = setTimeout(() => {
            performSearch();
        }, 500)

        return () => {
            clearTimeout(handler);
        };
    }, [performSearch]);


    //Search Delay
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchDelay(searchTerm);
        }, 500); //Time delay

        //Clean up
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    //Filter
    const handleFilter = () => {
        const { name, email } = filterCriteria;

        const filtered = data.filter(item =>
            (name ? item.name.toLowerCase().includes(name.toLowerCase()) : true) &&
            (email ? item.email.toLowerCase().includes(email.toLowerCase()) : true)
        );

        setFilteredData(filtered);
        setShowFilter(false);
    }

    //Sort
    const handleSort = (key) => {
        const sortedData = [...data].sort((a, b) => a[key] > b[key] ? 1 : -1);
        setFilteredData(sortedData)
    };

    //Delete
    const handleDelete = (claimNumber) => {
        console.log(`Attempting to delete claim number: ${claimNumber}`);
        fetch(`http://localhost:5000/data/${claimNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ claimNumber }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })

            .then(() => {
                const updatedData = data.filter(item => item.claimNumber !== claimNumber);
                setData(updatedData);
                setFilteredData(updatedData);
            })
            .catch(error => {
                console.error('Error deleting entry:', error)
            });
    };

    //Claim details
    const handleRowClick = (claimNumber) => {
        navigate(`/details/${claimNumber}`);
    };

    const memoizedFilterData = useMemo(() => filteredData, [filteredData]);

    const getColor = (status) => {
        switch (status) {
            case "Pending":
                return "orange";
            case "Accepted":
                return "green";
            case "Being Processed":
                return "blue";
            case "Declined":
                return "red";
            case "Complete":
                return "purple";
            default:
                return "black";
        }

    };

    //Render
    return (
        <div>
            <div></div>
            {loading ? (
                <div className="loading-indicator">
                    <p>Loading...</p>
                </div>
            ) : memoizedFilterData && memoizedFilterData.length > 0 ? (
                <table id="warrantyTable">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('claimNumber')} className="sortable">Warranty Number</th>
                            <th onClick={() => handleSort('name')} className="sortable">Name</th>
                            <th onClick={() => handleSort('email')} className="sortable">Email</th>
                            <th onClick={() => handleSort('address')} className="sortable">Address</th>
                            <th onClick={() => handleSort('status')} className="sortable">Status</th>

                            {roleLevel === 3 ?
                                (
                                    <>
                                        <th onClick={() => handleSort('username')} className="sortable">Username</th>
                                    </>
                                ) : null}

                            <th><button
                                onClick={() => setShowFilter(true)} //Handle click
                                className="filter-button"
                            ><i className="fas fa-filter"></i> Filter
                            </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.claimNumber}
                                className="table-row"
                                onClick={() => handleRowClick(item.claimNumber)}>

                                <td>{item.claimNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.address}</td>
                                <td style={{ color: getColor(item.status) }}>{item.status}</td>
   
                                {roleLevel === 3 ? (
                                    <>
                                        <td>{item.username}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => handleDelete(item.claimNumber)}>Delete</button>
                                        </td>
                                    </>
                                ) : null}

                            </tr>
                        ))}
                    </tbody>
                </table >

            ) : (
                // Show "No data available" only when not searching
                searchComplete && !searching && !loading && (
                    <div className="no-data">
                        <p>No data available.</p>
                        <Link to="/warrantyInput" className="start-new-claim-link"> Start a new claim?</Link>
                    </div>
                )
            )}

            {/*Filter Modal*/}
            {
                showFilter && (
                    <div className="filter-modal">
                        <h2>Filter Data</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleFilter(); }}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={filterCriteria.name}
                                    onChange={(e) => setFilterCriteria({ ...filterCriteria, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    value={filterCriteria.email}
                                    onChange={(e) => setFilterCriteria({ ...filterCriteria, email: e.target.value })}
                                />
                            </div>
                            <button type="submit">Filter</button>
                        </form>
                        <button onClick={() => setShowFilter(false)}>Cancel</button>
                    </div>
                )
            }
        </div >
    );
};

export default MainTable;