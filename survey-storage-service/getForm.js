const axios = require('axios');

async function getFormAttributes(formID) {
    try {
        const response = await axios.get(`http://localhost:8080/api/v3/forms/${formID}/attributes`);
        return response.data.results;  
    } catch (err) {
        console.error('Error fetching form attributes:', err);
        throw err;
    }
}

function extractKeys(newKeys, attributes) {
    const keyMap = {};

    newKeys.forEach(newKey => {
        const matchingAttribute = attributes.find(attr => attr.label.includes(newKey));
        if (matchingAttribute) {
            keyMap[newKey] = matchingAttribute.key;  
        }
    });

    return keyMap;
}

module.exports = { getFormAttributes, extractKeys };