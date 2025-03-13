const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

// Log server startup
console.log('Starting server...');
console.log('API Key from .env:', process.env.API_KEY || 'Not found');

// Use the exact endpoint from your Postman test
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/ask', async (req, res) => {
    console.log('Received request at /ask');
    const { question } = req.body;

    if (!question) {
        console.log('No question provided');
        return res.status(400).json({ error: 'Question is required' });
    }

    console.log('Question:', question);

    try {
        console.log('Making API call to Gemini...');
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${process.env.API_KEY}`,
            {
                contents: [{ parts: [{ text: question }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('API Response:', JSON.stringify(response.data, null, 2));
        const answer = response.data.candidates[0].content.parts[0].text;
        console.log('Sending answer:', answer);
        res.json({ answer });
    } catch (error) {
        console.error('Error occurred:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});