import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Details = () => {
    const { claimNumber } = useParams();
    const [claim, setClaim] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();
    const [parts, setParts] = useState([]);

    const [editing, setEditing] = useState(false);
    const [updatedClaim, setUpdatedClaim] = useState({});
    const [updatedParts, setUpdatedParts] = useState([]);

    const [roleLevel, setRoleLevel] = useState('');

    const [reasonModal, setReasonModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");

    //const [creditNote, setCreditNote] = useState("");
    //const [labour, setLabour] = useState("");
    //const [notes, SetNotes] = useState("");

    //Fetch Claim details & parts
    useEffect(() => {
        const fetchClaimDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/details/${claimNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setClaim(data.data);
                } else if (response.status === 403) {
                    setError('Access forbidden: claim does not belong to this user');
                    navigate('/home');
                } else {
                    setError(data.error || 'Error fetching claim details');
                }
            } catch (error) {
                console.error('Error fetching claim details:', error);
                setError('Error fetching claim details');
            }
        };
        //Fetch Parts
        const fetchParts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/parts/${claimNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setParts(data.parts);
                } else {
                    setError(data.error || 'Error fetching parts');
                }
            } catch (error) {
                console.error('Error fetching parts:', error);
                setError('Error fetching parts');
            }
        };
        //Fetch Role
        const fetchRole = async () => {
            const token = localStorage.getItem('token');

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
        }

        fetchRole();
        fetchClaimDetails();
        fetchParts();

    }, [claimNumber, navigate]);



    //Edit toggle
    const handleEditToggle = () => {
        setEditing(!editing);
        setUpdatedClaim(claim);
        setUpdatedParts(parts);
    };

    //Handle claim change
    const handleClaimChange = (e) => {
        const { name, value } = e.target;
        setUpdatedClaim({ ...updatedClaim, [name]: value });
    };

    //Handle parts change
    const handlePartChange = (index, field, value) => {
        const newParts = [...updatedParts];
        newParts[index][field] = value;
        setUpdatedParts(newParts);
    };

    //Cancel toggle
    const handleCancelToggle = () => {
        setEditing(false)
    };

    //Save
    const handleSave = async () => {
        try {
            //Save updated claim data
            const claimResponse = await fetch(`http://localhost:5000/details/${claimNumber}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClaim),
            });

            //Save updated parts data
            const partsResponse = await fetch(`http://localhost:5000/parts/${claimNumber}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ parts: updatedParts }),
            })

            if (claimResponse.ok && partsResponse.ok) {
                setEditing(false);
                setClaim(updatedClaim);
                setParts(updatedParts);
            } else {
                setError('Error saving changes');
            }
        } catch (error) {
            console.error('Error saving changes', error);
            setError('Error saving changes');

        }
    };

    //Update status
    const updateStatus = (newStatus) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:5000/details/status/${claim.claimNumber}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update status");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.message);
                /*claim.status = newStatus;*/
                setClaim((prevClaim) => ({
                    ...prevClaim,
                    status: newStatus,
                }));

            })
            .catch((error) => {
                console.error('Error updating status:', error)
            })
    }

    //Fetch updated status
    useEffect(() => {
        const fetchUpdatedStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/details/${claimNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setClaim(data.data);
                } else {
                    console.error('Error fetching updated claim status:', data.error);
                }
            } catch (error) {
                console.error('Error fetching updated claim status:', error);
            }
        };

        if (claim?.status) {
            fetchUpdatedStatus();
        }

    }, [claim?.status, claimNumber]);

    const handleStatusChange = (newStatus) => {
        if (newStatus === "Declined") {
            setReasonModal(true);
        } else {
            updateStatus(newStatus);
        }
    };

    const handleReasonSubmit = () => {
        if (declineReason.trim()) {
            updateStatus("Declined", declineReason);
            setReasonModal(false);
            setDeclineReason("")
        } else {
            alert("Please provide a reason for declining.")
        }
    };

    const handleReasonCancel = () => {
        setReasonModal(false);
        setDeclineReason("");
    };

    if (error) {
        return <div>{error}</div>
    }

    if (!claim) {
        return <div>Loading...</div>
    }

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

    return (
        <div className="claim-container">
            {editing ? (
                <>
                    <select
                        onChange={(e) => handleStatusChange(e.target.value)}
                        value={claim.status}
                        style={{ color: getColor(claim.status), }}
                    >
                        {["Pending", "Accepted", "Being Processed", "Declined", "Complete"]
                            .map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                    style={{ color: getColor(status) }}
                                >
                                    {status}
                                </option>
                            ))
                        }
                    </select>

                    {reasonModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>Reason for Declining</h3>
                                <textarea
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="Enter reason for declining..."
                                />
                                <div className="modal-actions">
                                    <button onClick={handleReasonSubmit}>Submit</button>
                                    <button onClick={handleReasonCancel}>Cancel</button>

                                </div>
                            </div>

                        </div>
                    )}

                    <div className="claim-details" id="claimDetails">
                        <h2 className="claim-title">Claim Details</h2>
                        <p className="claim-item" id="claimNumber"><strong>Claim Number: </strong>{claim.claimNumber}</p>
                        <p className="claim-item" id="claimName"><strong>Name: </strong><input className="claim-item" id="claimName" name="name" value={updatedClaim.name} onChange={handleClaimChange} /></p>
                        <p className="claim-item" id="claimAddress"><strong>Address: </strong><input className="claim-item" id="claimAddress" name="address" value={updatedClaim.address} onChange={handleClaimChange} /></p>
                        <p className="claim-item" id="claimPhoneNumber"><strong>Phone Number: </strong><input className="claim-item" id="claimPhoneNumber" name="phNumber" value={updatedClaim.phNumber} onChange={handleClaimChange} /></p>
                        <p className="claim-item" id="claimEmail"><strong>Email: </strong><input className="claim-item" id="claimEmail" name="email" value={updatedClaim.email} onChange={handleClaimChange} /></p>
                        <p className="claim-item" id="claimGSTNumber"><strong>GST Number: </strong><input className="claim-item" id="claimGSTNumber" name="gstNumber" value={updatedClaim.gstNumber} onChange={handleClaimChange} /></p>
                    </div>

                    <div className="details-section">
                        <div className="details-box customer-details">
                            <h3 className="claim-title">Customer Details</h3>
                            <p id='customer-name'><strong>Name: </strong><input id='customer-name' name="custName" value={updatedClaim.custName} onChange={handleClaimChange} /></p>
                            <p id='customer-address'><strong>Address: </strong><input id='customer-address' name="custAddress" value={updatedClaim.custAddress} onChange={handleClaimChange} /></p>
                            <p id='customer-phnumber'><strong>Phone Number: </strong><input id='customer-phnumber' name="custPhNumber" value={updatedClaim.custPhNumber} onChange={handleClaimChange} /></p>
                            <p id='customer-email'><strong>Email: </strong><input id='customer-email' name="custEmail" value={updatedClaim.custEmail} onChange={handleClaimChange} /></p>
                        </div>

                        <div className=" details-box machine-details">
                            <h3 className="claim-title">Product Details</h3>

                            <p id='machine-brand'><strong>Brand: </strong>
                                <select id='machine-brand' name="brand" value={updatedClaim.brand} onChange={handleClaimChange}>
                                    <option value="Oleo-Mac">Oleo-Mac</option>
                                    <option value="Oregon">Oregon</option>
                                    <option value="Stiga">Stiga</option></select></p>

                            <p id='machine-brand'><strong>Model: </strong><input id='machine-model' name="model" value={updatedClaim.model} onChange={handleClaimChange} /></p>
                            <p id='machine-serial'><strong>Serial Number: </strong><input id='machine-serial' name="serialNumber" value={updatedClaim.serialNumber} onChange={handleClaimChange} /></p>
                            <p id='machine-purchase'><strong>Date of Purchase: </strong><input id='machine-purchase' name="dateOfPurchase" value={updatedClaim.dateOfPurchase} onChange={handleClaimChange} /></p>
                            <p id='machine-failed'><strong>Date Failed: </strong><input id='machine-failed' name="dateFailed" value={updatedClaim.dateFailed} onChange={handleClaimChange} /></p>
                            <p id='machine-repaired'><strong>Date Repaired: </strong><input id='machine-repaired' name="dateRepaired" value={updatedClaim.dateReceived} onChange={handleClaimChange} /></p>
                        </div>
                    </div>

                </>
            ) : (
                <>

                    <p style={{ color: getColor(claim.status) }}>{claim.status}</p>
                    <div className="claim-details" id="claimDetails">
                        <h2 className="claim-title">Claim Details</h2>
                        <p className="claim-item" id="claimNumber"><strong>Claim Number: </strong>{claim.claimNumber}</p>
                        <p className="claim-item" id="claimName"><strong>Name: </strong>{claim.name}</p>
                        <p className="claim-item" id="claimAddress"><strong>Address: </strong>{claim.address}</p>
                        <p className="claim-item" id="claimPhoneNumber"><strong>Phone Number: </strong>{claim.phNumber}</p>
                        <p className="claim-item" id="claimEmail"><strong>Email: </strong>{claim.email}</p>
                        <p className="claim-item" id="claimGSTNumber"><strong>GST Number: </strong>{claim.gstNumber}</p>
                    </div>

                    <div className="details-section">
                        <div className="details-box customer-details">
                            <h3 className="claim-title">Customer Details</h3>
                            <p id='customer-name'><strong>Name: </strong>{claim.custName}</p>
                            <p id='customer-address'><strong>Address: </strong>{claim.custAddress}</p>
                            <p id='customer-phnumber'><strong>Phone Number: </strong>{claim.custPhNumber}</p>
                            <p id='customer-email'><strong>Email: </strong>{claim.custEmail}</p>
                        </div>

                        <div className=" details-box machine-details">
                            <h3 className="claim-title">Product Details</h3>
                            <p id='machine-brand'><strong>Brand: </strong>{claim.brand}</p>
                            <p id='machine-brand'><strong>Model: </strong>{claim.model}</p>
                            <p id='machine-serial'><strong>Serial Number: </strong>{claim.serialNumber}</p>
                            <p id='machine-purchase'><strong>Date of Purchase: </strong>{claim.dateOfPurchase}</p>
                            <p id='machine-failed'><strong>Date Failed: </strong>{claim.dateFailed}</p>
                            <p id='machine-repaired'><strong>Date Repaired: </strong>{claim.dateReceived}</p>
                        </div>
                    </div>
                </>

            )}

            <table className="parts-description">
                <thead >
                    <tr>
                        <th id='part-number'><strong>Part Number</strong></th>
                        <th id='description'><strong>Description</strong></th>
                        <th id='quantity'><strong>Quantity</strong></th>
                        <th id='failure'><strong>Cause of Failure</strong></th>
                    </tr>
                </thead>

                <tbody className="parts-description-table-body">
                    {editing
                        ? updatedParts.map((part, index) => (
                            <>
                                <tr key={index}>
                                    <td>
                                        <input
                                            value={part.partNumber}
                                            onChange={(e) => handlePartChange(index, 'partNumber', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={part.description}
                                            onChange={(e) => handlePartChange(index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={part.qty}
                                            onChange={(e) => handlePartChange(index, 'qty', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={part.causeOfFailure}
                                            onChange={(e) => handlePartChange(index, 'causeOfFailure', e.target.value)}
                                        />
                                    </td>
                                </tr>

                            </>

                        )) :
                        parts.map((part, index) => (
                            <tr key={index}>
                                <td>{part.partNumber}</td>
                                <td>{part.description}</td>
                                <td>{part.qty}</td>
                                <td>{part.causeOfFailure}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {roleLevel === 3 && (
                editing ? (
                    <>
                        <div>
                            <label htmlFor="labourCost">Labour Cost:</label>
                            <input
                                id="labourCost"
                                type="number"
                                value={updatedClaim.labour} onChange={handleClaimChange}
                                placeholder="Enter labour cost"
                            />
                        </div>
                        <div>
                            <label htmlFor="creditNote">Credit Note Number:</label>
                            <input
                                id="creditNote"
                                type="text"
                                value={updatedClaim.creditNote} onChange={handleClaimChange}
                                placeholder="Enter credit note number"
                            />
                        </div>
                        <div>
                            <label htmlFor="notes">Notes:</label>
                            <textarea
                                id="notes"
                                value={updatedClaim.notes} onChange={handleClaimChange}
                                placeholder="Enter any additional information"
                            />
                        </div>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancelToggle}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleEditToggle}>Edit</button>
                )
            )}
        </div >
    );
};

export default Details;