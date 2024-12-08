import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';


const RoleManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [show, setShow] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Executing useEffect');
        /*console.log('Current User:', token);*/


        const fetchUsers = async () => {
            /*console.log('Authorization token:', token);*/
            console.log('Fetching Users...');
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Fetched users:', result);
                    setUsers(Array.isArray(result) ? result : []);

                } else {
                    console.error('Failed to fetch user data. Status:', response.status)
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        const fetchRoles = async () => {
            console.log('Fetching Roles...');

            try {
                const response = await fetch('http://localhost:5000/api/roles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Fetched roles:', result);
                    setRoles(Array.isArray(result) ? result : []);
                } else {
                    console.error('Failed to fetch user data. Status:', response.status)
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        }

        fetchUsers();
        fetchRoles();

    }, []);


    const handleRoleChange = async (userId, newRole) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleLevel: newRole }),

            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Role updated successfully:', updatedUser);

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, roleLevel: newRole } : user
                    )
                )
            } else {
                console.error('Failed to update role. Status:', response.status);
            }
        } catch (error) { 
            console.error('Error updating role:', error)
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    return (
        <div className="container mt-5">
            <h1>Account Management</h1>
            <h3>Accounts</h3>
            <Table>
                
                <thead>
                    
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>
                                    <Form.Control
                                        as="select"
                                        value={user.roleLevel}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        {roles.map(role => (
                                            <option key={role.roleLevel} value={role.roleLevel}>{role.name}</option>
                                        ))}
                                    </Form.Control>
                                </td>
                                <td>
                                    <Button variant="info" onClick={() => handleUserSelect(user)}>View/Edit</Button>
                                </td>
                            </tr>
                        ))

                    ) : (
                        <tr><td colSpan="4">No users found or loading...</td></tr>
                    )

                    }
                </tbody>
            </Table>

            {/*<Modal show={show} onHide={handleClose}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        <Modal.Title>User Details</Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        {selectedUser && (*/}
            {/*            <div>*/}
            {/*                <h4>{selectedUser.username}</h4>*/}
            {/*                <Form.Group>*/}
            {/*                    <Form.Label>Role</Form.Label>*/}
            {/*                    <Form.Control*/}
            {/*                        as="select"*/}
            {/*                        value={selectedUser.roleLevel}*/}
            {/*                        onChange={(e) => setNewRole(e.target.value)}*/}
            {/*                    >*/}
            {/*                        {roles?.map(role => (*/}
            {/*                            <option key={role.roleLevel} value={role.roleLevel}>{role.name}</option>*/}
            {/*                        ))}*/}

            {/*                    </Form.Control>*/}
            {/*                </Form.Group>*/}
            {/*                <Button*/}
            {/*                    variant="primary"*/}
            {/*                    onClick={() => {*/}
            {/*                        handleRoleChange(selectedUser.id, newRole);*/}
            {/*                        handleClose();*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    Save Changes*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </Modal.Body>*/}
            {/*</Modal>*/}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <h4>{selectedUser.username}</h4>
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                >
                                    {roles?.map((role) => (
                                        <option key={role.roleLevel} value={role.roleLevel}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleRoleChange(selectedUser.id, newRole);
                                    handleClose();
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>


        </div>
    );
};

export default RoleManagement;