import React, { useEffect, useState } from 'react';

function WarrantyInput() {

    const [claimNumber, setClaimNumber] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phNumber, setPhNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [userID, setUserID] = useState(null);
    const [warrantyData, setWarrantyData] = useState([]);
    const [custName, setCustName] = useState('');
    const [custAddress, setCustAddress] = useState('');
    const [custPhNumber, setCustPhNumber] = useState('');
    const [custEmail, setCustEmail] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [dateOfPurchase, setDateOfPurchase] = useState('');
    const [dateFailed, setDateFailed] = useState('');
    const [dateReceived, setDateReceived] = useState('');

    const [username, setUsername] = useState(null);
    const [status, setStatus] = useState(null);

    const [reasonDeclined, setReasonDeclined] = useState(null);
    const [creditNote, setCreditNote] = useState(null);
    const [labour, setLabour] = useState(null);
    const [notes, setNotes] = useState(null);

    //Dynamic Table
    const [rows, setRows] = useState([{ partNumber: '', description: '', qty: '', causeOfFailure: '' }]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = rows.map((row, i) => (i === index ? { ...row, [name]: value } : row));
        setRows(updatedRows);
        console.log('Updated rows:', updatedRows);
    }

    //add a new row to the table
    const addRow = () => {
        setRows([...rows, { partNumber: '', description: '', qty: '', causeOfFailure: '' }])
    };

    //remove a row by index
    const removeRow = (index) => {
        const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };


    //generate new claim number
    const generateClaimNumber = () => {
        const min = 100000;
        const max = 999999;
        const randomClaimNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        setClaimNumber(randomClaimNumber);
    };

    //set status/reason/credit note/labour & any additional information
    const updateStatus = () => {
        setStatus('Pending');
    }

    const updateReason = () => {
        setReasonDeclined("")
    }

    const updateCreditNote = () => {
        setCreditNote("")
    }

    const updateLabour = () => {
        setLabour("");
    }

    const updateNotes = () => { 
        setNotes("");
    }

    const fetchUsername = async () => {
        const token = localStorage.getItem('token');
        /*console.log('Authorization token:', token);*/
        if (token) {
            fetch('http://localhost:5000/users/username', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((users) => {

                    if (users.username) {
                        console.log("Username retrieved:", users.username);
                        setUsername(users.username);
                    } else {
                        console.error('Username not found in response:', users)
                    }

                })
                .catch((error) => {
                    console.error('Error fetching username:', error);
                });
        };
    };

    useEffect(() => {
        generateClaimNumber();
        updateStatus();
        updateReason();
        updateCreditNote();
        updateLabour();
        updateNotes();
        fetchUsername();

        //Fetch the user ID
        const token = localStorage.getItem('token');
        /*console.log('Authorization token:', token);*/
        if (token) {
            fetch('http://localhost:5000/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {

                    if (data.id) {
                        console.log("User ID retrieved:", data.id);
                        setUserID(data.id);
                    } else {
                        console.error('User ID not found in response:', data)
                    }

                })
                .catch((error) => {
                    console.error('Error fetching user ID:', error);
                });

        };


    }, []);

    const addData = () => {
        const token = localStorage.getItem('token');

        const newEntry = {
            claimNumber,
            name,
            address,
            phNumber,
            email,
            gstNumber,
            custName,
            custAddress,
            custPhNumber,
            custEmail,
            brand,
            model,
            serialNumber,
            dateOfPurchase,
            dateFailed,
            dateReceived,
            userID,
            username,
            status,
            //reasonDeclined,
            //creditNote,
            //labour,
            //notes,
            parts: rows
        };

        console.log('Submitting newEntry:', newEntry);

        setWarrantyData([...warrantyData, newEntry])

        fetch('http://localhost:5000/data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(newEntry)

        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                //Confirmation message
                alert('Claim submitted successfully!')

                //Redirect
                setTimeout(() => {
                    window.location.href = "/home";
                }, 1500);
            })
            .catch((error) => {
                console.error('Error:', error)
            });

            
    };


    return (
        <div>
            <div id="claim-form-container">
                <label id="claim-number-label">Claim Number: {claimNumber}</label>
                <div className="details-box">
                    <form id="repairer-details-form">
                        <h3 id="form-heading">Repairer Details</h3>
                        <div className="form-group">
                            <label htmlFor="repairer-name">Name:
                                <input
                                    type="text"
                                    id="repairer-name"
                                    className="form-input"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}>
                                </input>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="repairer-address">Address:
                                <input
                                    type="text"
                                    id="repairer-address"
                                    className="form-input"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}>
                                </input>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Ph number:
                                <input
                                    type="text"
                                    id="repairer-phone"
                                    className="form-input"
                                    required
                                    value={phNumber}
                                    onChange={(e) => setPhNumber(e.target.value)}>
                                </input>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Email:
                                <input
                                    type="text"
                                    id="repairer-email"
                                    className="form-input"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}>
                                </input>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>GST number:
                                <input
                                    type="text"
                                    id="repairer-gst"
                                    className="form-input"
                                    required
                                    value={gstNumber}
                                    onChange={(e) => setGstNumber(e.target.value)}>
                                </input>
                            </label>
                        </div>
                    </form>
                </div>
                <div id="customer-details" className="details-box">
                    <h3 id="form-heading">Customer Details</h3>
                    <label>Name:
                        <input
                            type="text"
                            id="cust-name"
                            className="form-input"
                            required
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}>
                        </input>
                    </label>
                    <label>Address:
                        <input
                            type="text"
                            id="cust-address"
                            className="form-input"
                            required
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                        >
                        </input>
                    </label>
                    <label>Phone Number:
                        <input
                            type="text"
                            id="cust-phNumber"
                            className="form-input"
                            required
                            value={custPhNumber}
                            onChange={(e) => setCustPhNumber(e.target.value)}
                        >
                        </input>
                    </label>
                    <label>Email:
                        <input
                            type="text"
                            id="cust-email"
                            className="form-input"
                            required
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                        >
                        </input>
                    </label>
                </div>
                <div id="product-details" className="details-box">
                    <h3 id="form-heading">Product Details</h3>
                    <label>Brand:
                        <select
                            id="brand-name"
                            className="form-input"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        >
                            <option value="">Select Brand</option>
                            <option value="Oleo-Mac">Oleo-Mac</option>
                            <option value="Oregon">Oregon</option>
                            <option value="Stiga">Stiga</option>
                        </select>
                    </label>
                    <label>Model:
                        <input
                            type="text"
                            id="model-name"
                            className="form-input"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        >
                        </input>
                    </label>
                    <label>Serial Number:
                        <input
                            type="text"
                            id="serialNumber"
                            className="form-input"
                            required
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        >
                        </input>
                    </label>
                    <label htmlFor="dateOfPurchase">Date of Purchase:
                        <input
                            type="date"
                            id="dateOfPurchase"
                            className="form-input"
                            required
                            value={dateOfPurchase}
                            onChange={(e) => setDateOfPurchase(e.target.value)}
                        />
                    </label>
                    <label htmlFor="dateFailed">Date Failed:
                        <input
                            type="date"
                            id="dateFailed"
                            className="form-input"
                            required
                            value={dateFailed}
                            onChange={(e) => setDateFailed(e.target.value)}
                        />
                    </label>
                    <label htmlFor="dateRepaired">Date Repaired:
                        <input
                            type="date"
                            id="dateRepaired"
                            className="form-input"
                            required
                            value={dateReceived}
                            onChange={(e) => setDateReceived(e.target.value)}
                        />
                    </label>
                </div>
                <div className="table-container" id="parts-details-table">
                    <h3 className="form-heading" id="form-heading">Parts Details</h3>
                    <table className="parts-details">
                        <thead>
                            <tr>
                                <th className="table-header" id="part-number-header">Part Number</th>
                                <th className="table-header" id="description-header">Description</th>
                                <th className="table-header" id="quantity-header">Qty</th>
                                <th className="table-header" id="cause-of-failure-header">Cause Of Failure</th>
                                <th className="table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            className="input-part-number"
                                            name="partNumber"
                                            value={row.partNumber}
                                            onChange={(event) => handleInputChange(index, event)}
                                            id={`part-number-input-${index}-${name}`}
                                        />
                                    </td>
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            className="input-description"
                                            name="description"
                                            value={row.description}
                                            onChange={(event) => handleInputChange(index, event)}
                                            id={`part-number-input-${index}-${name}`}
                                        />
                                    </td>
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            name="qty"
                                            className="input-quantity"
                                            value={row.qty}
                                            onChange={(event) => handleInputChange(index, event)}
                                            id={`part-number-input-${index}-${name}`}
                                        />
                                    </td>
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            name="causeOfFailure"
                                            className="input-cause-of-failure"
                                            value={row.causeOfFailure}
                                            onChange={(event) => handleInputChange(index, event)}
                                            id={`part-number-input-${index}-${name}`}
                                        />
                                    </td>
                                    <td className="table-cell">
                                        {index > 0 && (
                                            <button className="remove-row-button" id="remove-row-btn" onClick={() => removeRow(index)}>-</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="add-row-container">
                        <button className="add-row-button" id="add-row-btn" onClick={addRow}>+</button>
                    </div>
                </div>
                <button type="submit" id="submit-button" onClick={addData}>Submit</button>
            </div>
        </div>
    );
}

export default WarrantyInput;

