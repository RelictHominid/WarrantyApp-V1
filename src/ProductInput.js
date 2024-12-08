import React, { useEffect, useState } from 'react';

function ProductInput() {
    const [brand, setBrand] = useState('');
    const [dateOfPurchase, setDateOfPurchase] = useState('');
    const [model, setModel] = useState('');
    /*const [serialNumber, setSerialNumber] = useState('');*/
    const [useOfProduct, setUseOfProduct] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPh, setOwnerPh] = useState('');
    const [dealerName, setDealerName] = useState('');
    const [dealerAddress, setDealerAddress] = useState('');
    const [dealerEmail, setDealerEmail] = useState('');
    const [dealerPh, setDealerPh] = useState('');
    const [productData, setProductData] = useState([]);
    const [userId, setUserId] = useState(null);

    const [serialInput1, setSerialInput1] = useState('');
    const [serialInput2, setSerialInput2] = useState('');
    const [serialInput3, setSerialInput3] = useState('');

    const serialNumber = `${serialInput1}-${serialInput2}-${serialInput3}`;

    //Serial Number Handlers
    const handleSerialInput1 = (e) => {
        setSerialInput1(e.target.value);
    };

    const handleSerialInput2 = (e) => {
        setSerialInput2(e.target.value);
    };

    const handleSerialInput3 = (e) => {
        setSerialInput3(e.target.value);
    };

    useEffect(() => {

        //Fetch the user ID
        const token = localStorage.getItem('token');
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
                    setUserId(data.id);
                })
                .catch((error) => {
                    console.error('Error fetching user ID:', error);
                });
        }
    }, []);

    // Add user product information
    const addData = () => {
        const token = localStorage.getItem('token');

        const newEntry = {
            brand,
            dateOfPurchase,
            model,
            serialNumber,
            useOfProduct,
            ownerName,
            ownerAddress,
            ownerEmail,
            ownerPh,
            dealerName,
            dealerAddress,
            dealerEmail,
            dealerPh,
            userId,
        };

        setProductData([...productData, newEntry])

        fetch('http://localhost:5000/product', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brand, dateOfPurchase, model, serialNumber, useOfProduct, ownerName, ownerAddress, ownerEmail, ownerPh, dealerName, dealerAddress, dealerEmail, dealerPh, userId }),

        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                //Confirmation message
                alert('Registered successfully!')

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
            <div className="product-registration-container">
                <form id="product-registration-form">
                    <div className="form-section">
                        <h3 className="section-title">Product Information</h3>
                        <label htmlFor="brand-name">Brand:
                            <select
                                id="brand-name"
                                className="form-input"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}>
                                <option value="">Select Brand</option>
                                <option value="Oleo-Mac">Oleo-Mac</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Stiga">Stiga</option>
                            </select>
                        </label>
                        <label htmlFor="dateOfPurchase">Date of Purchase:
                            <input
                                type="date"
                                id="dateOfPurchase"
                                className="form-input"
                                value={dateOfPurchase}
                                onChange={(e) => setDateOfPurchase(e.target.value)}
                                required
                            />
                        </label>
                        <label htmlFor="model-name">Model:
                            <input
                                id="model-name"
                                className="form-input"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            />
                        </label>
                        <div className="serial-number-container">
                            <label htmlFor="serial-number">Serial Number:</label>
                            
                            <div className="serial-number-inputs">
                                <input
                                    id="serial-number1"
                                    type="text"
                                    maxLength="3"
                                    value={serialInput1}
                                    onChange={handleSerialInput1}
                                    required
                                /><span><strong>-</strong></span>
                                <input
                                    id="serial-number2"
                                    type="text"
                                    maxLength="3"
                                    value={serialInput2}
                                    onChange={handleSerialInput2}
                                    required
                                /><span><strong>-</strong></span>
                                <input
                                    id="serial-number3"
                                    type="text"
                                    maxLength="3"
                                    value={serialInput3}
                                    onChange={handleSerialInput3}
                                    required
                                />
                                
                            </div>
                            
                        </div>
                        <div className="form-section">
                            <h3 className="section-title">Owner Information</h3>
                            <label htmlFor="owner-name">Name:
                                <input
                                    id="owner-name"
                                    className="form-input"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="owner-address">Address:
                                <textarea
                                    id="owner-address"
                                    className="form-input"
                                    value={ownerAddress}
                                    onChange={(e) => setOwnerAddress(e.target.value)}
                                    rows="4"
                                    cols="50"
                                    required
                                />
                            </label>
                            <label htmlFor="owner-email">Email:
                                <input
                                    id="owner-email"
                                    className="form-input"
                                    value={ownerEmail}
                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="owner-ph">Phone:
                                <input
                                    id="owner-ph"
                                    className="form-input"
                                    value={ownerPh}
                                    onChange={(e) => setOwnerPh(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-section">
                            <h3 className="section-title">Principal Use Of Product</h3>
                            <div className="checkbox-group">
                                <div className="commerical-group">
                                    <label><strong>Commerical:</strong>
                                        <label>Landscape Maintenance
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="produceUse"
                                                value="Landscape Maintenance"
                                                checked={useOfProduct === "Landscape Maintenance"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Institutional Grounds Care
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Institutional Grounds Care"
                                                checked={useOfProduct === "Institutional Grounds Care"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Tree Care/Arborist
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Tree Care/Arborist"
                                                checked={useOfProduct === "Tree Care/Arborist"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Construction/Industrial
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Construction/Industrial"
                                                checked={useOfProduct === "Construction/Industrial"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Logging/Pulp/Firewood
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Logging/Pulp/Firewood"
                                                checked={useOfProduct === "Logging/Pulp/Firewood"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Rental
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Rental"
                                                checked={useOfProduct === "Rental"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Government
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Government"
                                                checked={useOfProduct === "Government"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                    </label>
                                </div>
                                <div className="personal-group">
                                    <label><strong>Personal:</strong>
                                        <label>Home/Estate
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Home/Estate"
                                                checked={useOfProduct === "Home/Estate"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>Owner
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="productUse"
                                                value="Owner"
                                                checked={useOfProduct === "Owner"}
                                                onChange={(e) => setUseOfProduct(e.target.value)}
                                                required
                                            />
                                        </label>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-section">
                            <h3 className="section-title">Dealer Information</h3>
                            <label htmlFor="dealer-name">Name:
                                <input
                                    id="dealer-name"
                                    className="form-input"
                                    value={dealerName}
                                    onChange={(e) => setDealerName(e.target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="dealer-address">Address:
                                <textarea
                                    id="dealer-address"
                                    className="form-input"
                                    value={dealerAddress}
                                    onChange={(e) => setDealerAddress(e.target.value)}
                                    rows="4"
                                    cols="50"
                                    required
                                />
                            </label>
                            <label htmlFor="dealer-email">Email:
                                <input
                                    id="dealer-email"
                                    className="form-input"
                                    value={dealerEmail}
                                    onChange={(e) => setDealerEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="dealer-ph">Phone:
                                <input
                                    id="dealer-ph"
                                    className="form-input"
                                    value={dealerPh}
                                    onChange={(e) => setDealerPh(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </form>
                <button type="submit" className="submit-button" onClick={addData}>Submit</button>
            </div >
        </div >
    )
};

export default ProductInput;

