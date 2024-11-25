const express = require('express');
const { getAccessToken, refreshAccessToken } = require('./tokenManager'); 
const app = express();



// Endpoint to get an access token
app.get('/get-token', async (req, res) => {
    try {
        const token = await getAccessToken();
        res.status(200).json({ access_token: token });
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).send('Failed to get access token');
    }
});

// Endpoint to refresh the access token
app.get('/refresh-token', async (req, res) => {
    try {
        const token = await refreshAccessToken();
        res.status(200).json({ access_token: token });
    } catch (error) {
        console.error('Error refreshing access token:', error);
        res.status(500).send('Failed to refresh access token');
    }
});

app.listen(3003, () => console.log('Auth Service running on port 3003'));
