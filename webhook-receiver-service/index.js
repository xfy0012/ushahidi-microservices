const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


// Webhook endpoint to receive incoming data
app.post('/webhook', async (req, res) => {
    const data = req.body;
    console.log('Received webhook data:', data);

    // Convert incoming data into key-value pairs
    const keyValueMap = new Map(Object.entries(data));
    const keys = Array.from(keyValueMap.keys()); 

    // Check if keys exist in the system
    const checkResponse = await axios.post('http://localhost:5002/check', { keys });
    const { existingKeys, newKeys } = checkResponse.data;

    const formID = data.formID;
    
    if (formID) {
        console.log('FormID found:', formID);
        // If formID exists, submit the survey response
        await submitSurveyResponse(data);
        res.status(200).json({ message: 'Survey response submitted for stored formID', formID });
    } else {
        console.log('FormID not found, creating a new survey.');
        // If no formID, create a new survey
        await createSurvey(keyValueMap, data);
        res.status(200).json({ message: 'Survey creation initiated', data });
    }
});

// Function to create a new survey
async function createSurvey(keyValueMap, data) {
    try {
        await axios.post('http://localhost:3001/create-survey', { keyValueMap: Object.fromEntries(keyValueMap), data });
        console.log('Survey creation request sent');
    } catch (err) {
        console.error('Error creating survey:', err);
    }
}

// Function to submit a survey response
async function submitSurveyResponse(data) {
    try {
        await axios.post('http://localhost:3002/submit-response', data);
        console.log('Survey response submission request sent');
    } catch (err) {
        console.error('Error submitting survey response:', err);
    }
}

// Start the Webhook Receiver Service
app.listen(3000, () => console.log('Webhook Receiver Service running on port 3000'));
