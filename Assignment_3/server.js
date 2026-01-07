const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper: Read Data
async function readData() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading DB:', err);
        return [];
    }
}

// Helper: Write Data
async function writeData(data) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing DB:', err);
    }
}

// Routes

// GET /posts - Get all posts
app.get('/posts', async (req, res) => {
    const posts = await readData();
    res.json(posts);
});

// GET /posts/:id - Get single post
app.get('/posts/:id', async (req, res) => {
    const posts = await readData();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// POST /posts - Create new post
app.post('/posts', async (req, res) => {
    const posts = await readData();
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author || 'Anonymous',
        date: new Date().toISOString().split('T')[0]
    };

    if (!newPost.title || !newPost.content) {
        return res.status(400).json({ error: 'Title and Content are required' });
    }

    posts.push(newPost);
    await writeData(posts);
    res.status(201).json(newPost);
});

// PUT /posts/:id - Update post
app.put('/posts/:id', async (req, res) => {
    const posts = await readData();
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    const updatedPost = {
        ...posts[index],
        ...req.body,
        id: posts[index].id // Prevent ID change
    };

    posts[index] = updatedPost;
    await writeData(posts);
    res.json(updatedPost);
});

// DELETE /posts/:id - Delete post
app.delete('/posts/:id', async (req, res) => {
    let posts = await readData();
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== parseInt(req.params.id));

    if (posts.length === initialLength) {
        return res.status(404).json({ error: 'Post not found' });
    }

    await writeData(posts);
    res.json({ message: 'Post deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
