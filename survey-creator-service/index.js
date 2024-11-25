const express = require('express');
const axios = require('axios');
const { createSurvey } = require('./createSurvey');
const app = express();
const {
    SURVEY_STORAGE_SERVICE_URL, 
    AUTH_SERVICE_URL,
    USHAHIDI_API_URL
} = require('../config');

app.use(express.json());

app.post('/create-survey', async (req, res) => {
    const { keyValueMap, data } = req.body;

    try {
        // Transform external data into Ushahidi survey format using the createSurvey function
        const surveyData = createSurvey(data);

        console.log('Transformed surveyData:', JSON.stringify(surveyData, null, 2));

        // Fetch the access token
        const tokenResponse = await axios.get(`${AUTH_SERVICE_URL}/get-token`);
        const token = tokenResponse.data.access_token;

        // Call the Ushahidi API to create the survey
        const response = await axios.post(`${USHAHIDI_API_URL}/api/v5/surveys`, surveyData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const formID = response.data.result.id;
        console.log('Survey creation response:', formID);

        
         // Store form ID and key-value map in the storage service
        try {
            await axios.post(`${SURVEY_STORAGE_SERVICE_URL}/store`, {
                formID, 
                keyValueMap
            });
        } catch (storeError) {
            console.error('Error storing keys:', storeError);
            return res.status(500).send('Survey created but storing keys failed');
        }

        res.status(200).send({ surveyId: formID });
    } catch (err) {
        console.error('Error creating survey:', err);
        res.status(500).send('Failed to create survey');
    }
});

app.listen(3001, () => console.log('Survey Creator Service running on port 3001'));
