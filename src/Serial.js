import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SerialInfo = () => {
    const { serialNumber } = useParams();
    const [serialInfo, setSerialInfo] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSerialInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/product/${serialNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setSerialInfo(data.data);
                } else if (response.status === 403) {
                    setError('Access forbidden: Info does not belong to this user');
                    navigate('/home');
                } else {
                    setError(data.error || 'Error fetching serial details');
                }
            } catch (error) {
                console.error('Error fetching serial details:', error);
                setError('Error fetching serial details');
            }
        };
        fetchSerialInfo();
    }, [serialNumber, navigate]);

    if (error) {
        return <div>{error}</div>
    }

    if (!serialInfo) {
        return <div>Loading...</div>
    }

    return (
        <div className="serial-details-container">
            <div className="serial-details-section" data-tooltip="Product Information">
                <h2 className="section-title-details">Product Information</h2>
                <p><strong>Serial Number: </strong>{serialInfo.serialNumber}</p>
                <p><strong>Brand: </strong>{serialInfo.brand}</p>
                <p><strong>Model: </strong>{serialInfo.model}</p>
                <p><strong>Date of purchase: </strong>{serialInfo.dateOfPurchase}</p>
                <p><strong>Use of product: </strong>{serialInfo.useOfProduct}</p>
            </div>

            <div className="serial-details-section" data-tooltip="Owner Information">
                <h2 className="section-title-details">Owner Information</h2>
                <p><strong>Name: </strong>{serialInfo.ownerName}</p>
                <p><strong>Address: </strong>{serialInfo.ownerAddress}</p>
                <p><strong>Email: </strong>{serialInfo.ownerEmail}</p>
                <p><strong>Phone: </strong>{serialInfo.ownerPh}</p>
            </div>

            <div className="serial-details-section" data-tooltip="Product Information">
                <h2 className="section-title-details">Dealer Information</h2>
                <p><strong>Name: </strong>{serialInfo.dealerName}</p>
                <p><strong>Address: </strong>{serialInfo.dealerAddress}</p>
                <p><strong>Email: </strong>{serialInfo.dealerEmail}</p>
                <p><strong>Phone: </strong>{serialInfo.dealerPh}</p>
            </div>
        </div>


    )

};

export default SerialInfo;
