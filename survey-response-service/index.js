const express = require('express');
const axios = require('axios');
const { transformFormData } = require('./transformData.js');
const app = express();
app.use(express.json());

// Endpoint to handle survey response submission
app.post('/submit-response', async (req, res) => {
    const data = req.body;
    console.log('Received response data to submit:', data);

    try {
        // Transform the form data to the required format
        const transformedResponse = await transformFormData(data);

        // Fetch access token from auth service
        const tokenResponse = await axios.get('http://localhost:3003/get-token');
        const token = tokenResponse.data.access_token;

        // Submit the transformed data to the external survey platform
        console.log(JSON.stringify(transformedResponse) );

        const response = await axios.post('http://localhost:8080/api/v3/posts', JSON.stringify(transformedResponse) , {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Survey response submitted');
        res.status(200).send('Response submitted');

    } catch (err) {
        console.error('Error submitting survey response:', err);
        res.status(500).send('Failed to submit response');
    }
});


app.listen(3002, () => console.log('Survey Response Service running on port 3002'));
