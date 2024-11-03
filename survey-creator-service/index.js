const express = require('express');
const axios = require('axios');
const { createSurvey } = require('./createSurvey');
const app = express();
app.use(express.json());

app.post('/create-survey', async (req, res) => {
    const { keyValueMap, data } = req.body;

    try {
        // 使用 createSurvey 函数将外部数据转换为 Ushahidi Survey 格式
        const surveyData = createSurvey(data);

        console.log('Transformed surveyData:', JSON.stringify(surveyData, null, 2));

        // 获取访问令牌
        const tokenResponse = await axios.get('http://localhost:3003/get-token');
        const token = tokenResponse.data.access_token;

        // 调用 Ushahidi API 创建 Survey
        const response = await axios.post('http://localhost:8080/api/v5/surveys', surveyData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const formID = response.data.result.id;
        console.log('Survey creation response:', formID);

        

        try {
            await axios.post('http://localhost:5002/store', {
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
