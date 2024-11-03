const express = require('express');
const bodyParser = require('body-parser');
const { getFormAttributes, extractKeys } = require('./getForm.js');
const app = express();
app.use(bodyParser.json());

// In-memory store for keys and forms
const keyStore = {};
const formStore = {};



// Endpoint to store key-value pairs and formID
app.post('/store', async (req, res) => {
    const { formID, keyValueMap } = req.body;
    const mapKey = new Map(Object.entries(keyValueMap));

    // Retrieve the last key-value pair to determine form name
    const lastKeyValuePair = [...mapKey.entries()].pop();  
    const formName = lastKeyValuePair ? lastKeyValuePair[1] : null;  

    try {
        // Retrieve form attributes based on formID
        const attributes = await getFormAttributes(formID);
        console.log(attributes);

        // Extract keys from the attributes
        const unmatchedValues = [];

        mapKey.forEach((value , key) => {
            let cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');   // Clean value to remove non-alphanumeric characters
            cleanValue = cleanValue.replace(/response$/, '');  // Remove "- Response" suffix
            cleanValue = cleanValue.replace(/enteranumber$/, '');  // Remove instructions like "enter a number"
            cleanValue = cleanValue.replace(/enteradecimalnumber$/, '');  
            if (value === formName) {
                console.log(`Skipping form name: ${value}`);
                return; 
            }
    
            const matchingAttribute = attributes.find(attr => {
                const cleanLabel = attr.label.toLowerCase().replace(/[^a-z0-9]/g, '');  // 同样清理 label
                console.log(`Trying to match cleanLabel: ${cleanLabel} with cleanValue: ${cleanValue}`);
                return cleanLabel.includes(cleanValue);  // 使用部分匹配，确保 label 包含 value
            });
            if (matchingAttribute) {
                // If a matching attribute is found, store it in the formStore
                mapKey.set(key, matchingAttribute.key);
                if (!formStore[formID]) {
                    formStore[formID] = {};  
                }
                formStore[formID][key] = matchingAttribute.key;  
                console.log('machesvalues:', matchingAttribute);
            } else {
               
                unmatchedValues.push(value);
            }
        });

         // Endpoint to check if keys exist
         if (unmatchedValues.length > 0) {
            console.log('Unmatched values:', unmatchedValues);
            return res.status(400).json({
                message: 'Some values could not be matched to attributes',
                unmatchedValues
            });
        }

        console.log('Stored keyStore:', keyStore);
        console.log('Stored formStore:', formStore);

        res.status(200).json({ message: 'Keys and formID stored successfully', keyValueMap });

    } catch (err) {

        console.error('Error storing keys:', err);
        res.status(500).send('Failed to store keys');
    }
   
});


// Endpoint to retrieve all stored forms
app.post('/check', (req, res) => {
    const { keys } = req.body;
    const existingKeys = [];
    const newKeys = [];

    const formName = keys[keys.length - 1]; 

    keys.forEach(key => {

        if (key === formName) {
            console.log(`Skipping form name: ${key}`);
            return;
        }

        if (keyStore[key]) {
            existingKeys.push(key);
        } else {
            newKeys.push(key);
        }
    });

    res.status(200).json({ existingKeys, newKeys });
});

// Retrieve specific form data by formID
app.get('/forms', (req, res) => {
    try {
        const allForms = Object.keys(formStore);  // 获取所有 formID
        res.status(200).json({
            message: 'Successfully retrieved all forms',
            forms: allForms,  // 返回所有的 formID
            formStore: formStore  // 返回完整的 formStore
        });
    } catch (err) {
        console.error('Error retrieving forms:', err);
        res.status(500).send('Failed to retrieve forms');
    }
});

app.get('/forms/:formID', (req, res) => {
    const formID = req.params.formID;
    if (formStore[formID]) {
        res.status(200).json(formStore[formID]);  // 返回指定的 formStore
    } else {
        res.status(404).json({ message: `Form with ID ${formID} not found` });
    }
});

module.exports = { keyStore, formStore };

app.listen(5002, () => console.log('Survey Storage Service running on port 5002'));
