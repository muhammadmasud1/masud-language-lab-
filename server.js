
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        courses: [],
        lessons: [],
        books: [],
        articles: [],
        quiz: [],
        enrollments: [],
        orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Helper to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- API ENDPOINTS ---

// Generic Get All
app.get('/api/:module', (req, res) => {
    const data = readDB();
    const module = req.params.module;
    res.json(data[module] || []);
});

// Generic Save/Update
app.post('/api/:module', (req, res) => {
    const data = readDB();
    const module = req.params.module;
    const newItem = req.body;
    
    if (!data[module]) data[module] = [];
    
    // Update if exists, otherwise append
    const index = data[module].findIndex(item => item.id === newItem.id);
    if (index !== -1) {
        data[module][index] = newItem;
    } else {
        data[module].push(newItem);
    }
    
    writeDB(data);
    res.json({ success: true, item: newItem });
});

// Generic Delete
app.delete('/api/:module/:id', (req, res) => {
    const data = readDB();
    const module = req.params.module;
    const id = req.params.id;
    
    if (data[module]) {
        data[module] = data[module].filter(item => item.id !== id);
        writeDB(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Module not found' });
    }
});

// Status Update (for Enrollments)
app.patch('/api/enrollments/:id', (req, res) => {
    const data = readDB();
    const id = req.params.id;
    const { status } = req.body;
    
    const index = data.enrollments.findIndex(e => e.id === id);
    if (index !== -1) {
        data.enrollments[index].status = status;
        writeDB(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Enrollment not found' });
    }
});

// User Search
app.get('/api/users/:email', (req, res) => {
    const data = readDB();
    const user = data.users.find(u => u.email.toLowerCase() === req.params.email.toLowerCase());
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
});

app.listen(PORT, () => {
    console.log(`CMS Server is running on http://localhost:${PORT}`);
});
