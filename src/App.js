import './App.css';
import MainTable from './MainTable';
import Login from './Login'
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import WarrantyInput from './WarrantyInput';
import Details from './Details';
import Register from './Register';
import NavBar from './NavBar';
import ProductInput from './ProductInput';
import { AuthProvider } from './Authenticator';
import React, { useState } from 'react';
import Serial from './Serial';
import SerialSearch from './SerialSearch';
import RoleManagement from './RoleManagement';


function App() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="App">

            <BrowserRouter>
                <AuthProvider>
                    <NavBar onSearch={setSearchTerm} />
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/register" element={<Register />}></Route>


                        <Route path="/home" element={<PrivateRoute component={() => <MainTable searchTerm={searchTerm} />} />} />
                        {/*<Route path="/home" element={<PrivateRoute><MainTable searchTerm={searchTerm} /> </PrivateRoute>}></Route>*/}
                        <Route path="/warrantyInput" element={<PrivateRoute component={WarrantyInput} />}></Route>
                        <Route path="/details/:claimNumber" element={<PrivateRoute component={Details} />}></Route>
                        <Route path="/product" element={<PrivateRoute component={ProductInput} />}></Route>
                        <Route path="/product/:serialNumber" element={<PrivateRoute component={Serial} />}></Route>
                        <Route path="/serial-search" element={<PrivateRoute component={SerialSearch} />}></Route>
                        <Route path="/set-roles" element={<PrivateRoute component={RoleManagement} />}></Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>

        </div>
    );
}

export default App;
