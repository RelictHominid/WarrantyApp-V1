const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = '0223643073';

app.use(cors());
app.use(express.json());

//Connect to database
const db = new sqlite3.Database('./warrantyData.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database')
    };
});

//Create table if not exists
//db.run('DROP TABLE users');
//db.run('DROP TABLE data');
//db.run('DROP TABLE product');
//db.run('DROP TABLE parts');
db.run('PRAGMA foreign_keys = ON');

db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, roleLevel INTEGER DEFAULT 1)');
db.run('CREATE TABLE IF NOT EXISTS data (claimNumber INTEGER PRIMARY KEY, name TEXT, address TEXT, phNumber INTEGER, email TEXT, gstNumber INTEGER, custName TEXT, custAddress TEXT, custPhNumber TEXT, custEmail TEXT, brand TEXT, model TEXT, serialNumber TEXT, dateOfPurchase TEXT, dateFailed TEXT, dateReceived TEXT, userId INTEGER, username TEXT, status TEXT, FOREIGN KEY (userId) REFERENCES users(id))');
db.run('CREATE TABLE IF NOT EXISTS product(brand TEXT, dateOfPurchase TEXT, model TEXT, serialNumber TEXT PRIMARY KEY, useOfProduct TEXT, ownerName TEXT, ownerAddress TEXT, ownerEmail TEXT, ownerPh TEXT, dealerName TEXT, dealerAddress TEXT, dealerEmail TEXT, dealerPh TEXT, userId INTEGER, FOREIGN KEY (userId) REFERENCES users(id))');
db.run('CREATE TABLE IF NOT EXISTS parts(id INTEGER PRIMARY KEY AUTOINCREMENT, claimId INTEGER, partNumber TEXT, description TEXT, qty TEXT, causeOfFailure TEXT, FOREIGN KEY (claimId) REFERENCES data(claimNumber) ON DELETE CASCADE)');

//Authenticate middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.sendStatus(403)
        };
        req.user = user;
        next();
    });
};

//Role check middleware
const canManageRole = (requiredLevel) => {
    return (req, res, next) => {
        const currentUserRoleLevel = req.user.roleLevel;
        //console.log('Current User role level:', currentUserRoleLevel, 'Required Level:', requiredLevel)
        if (currentUserRoleLevel >= requiredLevel) {
            next();
        } else {
            res.status(403).json({ error: 'Insufficient privileges to modify role' })
        }
    };
};

//Insert warranty claim data into table
app.post('/data', authenticateToken, (req, res) => {
    const { claimNumber, name, address, phNumber, email, gstNumber, custName, custAddress, custPhNumber, custEmail, brand, model, serialNumber, dateOfPurchase, dateFailed, dateReceived, username, status, parts } = req.body;
    const userId = req.user.userId;

    const stmt = db.prepare('INSERT INTO data (claimNumber, name, address, phNumber, email, gstNumber, custName, custAddress, custPhNumber, custEmail, brand, model, serialNumber, dateOfPurchase, dateFailed, dateReceived, username, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    stmt.run(claimNumber, name, address, phNumber, email, gstNumber, custName, custAddress, custPhNumber, custEmail, brand, model, serialNumber, dateOfPurchase, dateFailed, dateReceived, username, status, userId, function (err) {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(400).json({ error: err.message });
            return;
        }

        const claimId = this.lastID;

        if (parts && parts.length > 0) {
            const partStmt = db.prepare('INSERT INTO parts (claimId, partNumber, description, qty, causeOfFailure) VALUES (?, ?, ?, ?, ?)');

            parts.forEach((part) => {
                partStmt.run(claimId, part.partNumber, part.description, part.qty, part.causeOfFailure, function (err) {
                    if (err) {
                        console.error("Error inserting part:", err.message);
                    }
                });
            });

            partStmt.finalize();
        }

        res.json({
            message: 'Warranty data and parts added successfully!',
        });
    });

    stmt.finalize();
});

//Insert into product table
app.post('/product', authenticateToken, (req, res) => {
    const { brand, dateOfPurchase, model, serialNumber, useOfProduct, ownerName, ownerAddress, ownerEmail, ownerPh, dealerName, dealerAddress, dealerEmail, dealerPh } = req.body;
    const userId = req.user.userId;
    const stmt = db.prepare('INSERT INTO product (brand, dateOfPurchase, model, serialNumber, useOfProduct, ownerName, ownerAddress, ownerEmail, ownerPh, dealerName, dealerAddress, dealerEmail, dealerPh, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    stmt.run(brand, dateOfPurchase, model, serialNumber, useOfProduct, ownerName, ownerAddress, ownerEmail, ownerPh, dealerName, dealerAddress, dealerEmail, dealerPh, userId, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Product registered successfully!',

        });
    });
    stmt.finalize();
})

//Fetch data
app.get('/details/:claimNumber', authenticateToken, (req, res) => {
    const { claimNumber } = req.params;
    const { userId, roleLevel } = req.user;

    const query = roleLevel === 3
        ? 'SELECT * FROM data WHERE claimNumber = ?'
        : 'SELECT * FROM data WHERE claimNumber = ? AND userId = ?';

    const params = roleLevel === 3 ? [claimNumber] : [claimNumber, userId];

    db.get(query, params, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message })
        }
        if (!row) {
            return res.status(403).json({ error: 'Access forbidden: claim does not belong to this user' });
        }
        res.json({
            message: 'Success!',
            data: row,
        });
    });

});

//Update Claim Details
app.put('/details/:claimNumber', authenticateToken, (req, res) => {
    const { roleLevel } = req.user;

    if (roleLevel !== 3) {
        return res.status(403).json({ message: 'Access forbidden: insufficient privileges' })
    }

    const claimNumber = req.params.claimNumber;
    const updatedData = req.body;

    const query = `
        UPDATE data
        SET name = ?, address = ?, phNumber = ?, email = ?, gstNumber = ?,
        custName = ?, custAddress = ?, custPhNumber = ?, custEmail = ?,
        brand = ?, model = ?, serialNumber = ?, dateOfPurchase = ?, dateFailed = ?, dateReceived = ?
        WHERE claimNumber = ?
    `;

    const params = [
        updatedData.name, updatedData.address, updatedData.phNumber, updatedData.email, updatedData.gstNumber,
        updatedData.custName, updatedData.custAddress, updatedData.custPhNumber, updatedData.custEmail,
        updatedData.brand, updatedData.model, updatedData.serialNumber, updatedData.dateOfPurchase,
        updatedData.dateFailed, updatedData.dateReceived, claimNumber
    ];

    db.run(query, params, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Claim details updated successfully' });
    });

});

//Update status
app.put('/details/status/:claimNumber', authenticateToken, (req, res) => {
    const { roleLevel } = req.user;
    const { claimNumber } = req.params;
    const { status } = req.body;

    if (roleLevel !== 3) { 
        return res.status(403).json({ message: 'Access forbidden: insuffcient privileges'})
    }

    if (!claimNumber || !status) { 
        return res.status(400).json({ message: 'Missing claimNumber or status' });
    }

    const query = `UPDATE data SET status = ? WHERE claimNumber = ?`;
    const params = [status, claimNumber];

    db.run(query, params, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Status successfully updated' })
    });
});


//Fetch product details
app.get('/product/:serialNumber', authenticateToken, (req, res) => {
    const { serialNumber } = req.params;
    const userId = req.user.userId;

    db.get('SELECT * FROM product where serialNumber = ? and userId = ?', [serialNumber, userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(403).json({ error: 'Access forbidden: product does not belong to this user' });
        }
        res.json({
            message: 'Success!',
            data: row
        });
    });
});

//Fetch part details
app.get('/parts/:claimNumber', authenticateToken, (req, res) => {
    const { claimNumber } = req.params;

    const query = 'SELECT partNumber, description, qty, causeOfFailure FROM parts WHERE claimId = ?';
    db.all(query, [claimNumber], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch parts of data' });
        } else {
            res.json({ parts: rows });
        }
    });
});

//Update part details
app.put('/parts/:claimNumber', authenticateToken, (req, res) => {
    const { roleLevel } = req.user;

    if (roleLevel !== 3) {
        return res.status(403).json({ message: 'Access forbidden: insuffcient privileges' })
    }

    const claimNumber = req.params.claimNumber;
    const updatedParts = req.body.parts;

    db.serialize(() => {
        const deleteQuery = `DELETE FROM parts WHERE claimId = ?`;
        const insertQuery = `
            INSERT INTO parts (claimId, partNumber, description, qty, causeOfFailure)
            VALUES (?, ?, ?, ? ,?)
        `;

        //Delete existing parts
        db.run(deleteQuery, [claimNumber], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }


            //Insert updated parts
            const insertStmt = db.prepare(insertQuery);
            updatedParts.forEach(part => {
                insertStmt.run([claimNumber, part.partNumber, part.description, part.qty, part.causeOfFailure]);
            });
            insertStmt.finalize();

            res.json({ message: 'Parts updated successfully' })
        });
    });
});


//Start
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//Delete data from the table
app.delete('/data/:claimNumber', (req, res) => {
    console.log(`Received delete request for claim number: ${req.params.claimNumber}, type: ${typeof req.params.claimNumber}`)
    const { claimNumber } = req.params;

    const stmt = db.prepare('DELETE FROM data WHERE claimNumber = ?');

    stmt.run(claimNumber, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        console.log(`Deleted ${this.changes} row(s)`);
        res.json({
            message: 'Entry deleted successfully!',
            changes: this.changes,
        });
    });
    stmt.finalize();
});

//API Endpoints

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password, roleLevel) VALUES (?, ?, 3)', [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully!' });
    });

});

//User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user.id, roleLevel: user.roleLevel }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

//Fetch users (Admin can see all)
app.get('/api/users', authenticateToken, canManageRole(3), (req, res) => {
    /*console.log('User role:', req.user.roleLevel);*/
    db.all('SELECT id, username, roleLevel FROM users', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        /*console.log('Fetched users from DB:', rows)*/
        res.json(rows);
    });
});

//Fetch roles
app.get('/api/roles', authenticateToken, (req, res) => {
    const roles = [
        { id: 1, name: 'User', roleLevel: 1 },
        { id: 2, name: 'Moderator', roleLevel: 2 },
        { id: 3, name: 'Admin', roleLevel: 3 }
    ];
    /*console.log('Returning Roles:', roles);*/
    res.json(roles);
});

//Update user's role
app.put('/api/users/:userId/role', authenticateToken, canManageRole(3), (req, res) => {
    const userId = req.params.userId;
    const { roleLevel } = req.body;

    //Ensure no self-demotion to lower privilage
    if (userId === req.user.userId && roleLevel < req.user.roleLevel) {
        return res.status(400).json({ error: 'Cannot demote yourself to a lower privilage' })
    }

    db.run('UPDATE users SET roleLevel = ? WHERE id = ?', [roleLevel, userId], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ message: 'User role updated successfully', changes: this.changes });
        }
    });
});

//Protected route to fetch-user specific data
app.get('/data', authenticateToken, (req, res) => {
    const { userId, roleLevel } = req.user;

    const query = roleLevel === 3
        ? 'SELECT * FROM data'
        : 'SELECT * FROM data WHERE userId = ?';

    const params = roleLevel === 3 ? [] : [userId];

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'Success!',
            data: rows,
        });
    });
});

//Protected route to fetch-user specific serial data
app.get('/product', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.all('SELECT * from product WHERE userId = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'Success!',
            product: rows,
        })
    })
})

//Protect route to fetch the current user's info
app.get('/users/me', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get('SELECT username, roleLevel FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ username: user.username, roleLevel: user.roleLevel });

    })
});

//Get user info by ID
app.get('/users', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT id FROM users WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(row);
    });
});

//Get user role by ID
app.get('/users/role', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT roleLevel FROM users WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User role not found' })
        }
        res.json(row);
    })
})

//Get username by ID
app.get('/users/username', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT username FROM users WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Username not found' })
        }
        res.json(row);
    })
})

//Search Data Table
app.get('/data/search', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const searchTerm = req.query.q.toLowerCase();

    if (!searchTerm) {
        return res.status(400).json({ error: 'Missing search term' });
    }

    const query = `SELECT * FROM data WHERE userId = ?
                   AND (claimNumber LIKE ? OR LOWER(name) LIKE ? OR LOWER(email) LIKE ?)`;

    db.all(query, [userId, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

//Search Suggestions
app.get('/data/suggestions', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const searchTerm = req.query.q.toLowerCase();

    if (!searchTerm) {
        return res.status(400).json({ error: 'Missing search term' });
    }

    //Limit results to 5 for suggestions
    const query = `SELECT * FROM data WHERE userId = ?
                   AND (claimNumber LIKE ? or LOWER(name) LIKE ?) LIMIT 5`;

    db.all(query, [userId, `%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ suggestions: rows });
    })
});

