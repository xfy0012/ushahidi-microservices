const axios = require('axios');

// Function to transform the incoming survey response into the desired format
async function transformFormData(inputData) {
    console.log("input", inputData);
    const formname = inputData.form_name;
    const { formID, ...formData } = inputData;  // Extract form ID and form data
    const storedForm = await getFormStore(formID);  // Retrieve the stored form structure from the survey storage service
    

    if (!storedForm) {
        throw new Error(`Form with ID ${formID} not found`);
    }

    const values = {};

// Function to fetch stored form structure from the storage service
async function getFormStore(formID) {
    try {
        const response = await axios.get(`http://localhost:5002/forms`);
        console.log("1", response.data);
        console.log("3", formID)
        const form = response.data.formStore[formID];
        console.log("2", form);
        return form;  
    } catch (err) {
        console.error(`Error fetching form with ID ${formID}:`, err.message);
                return null;
    }
}

    // Iterate through form data and map it to the stored keys
    for (const [fieldLabel, fieldValue] of Object.entries(formData)) {
        // Skip the form name field
        if (fieldLabel === 'form name') {
            continue;
        }

        
        const fieldKey = storedForm[fieldLabel];
        if (fieldKey) {
            values[fieldKey] = [fieldValue.toLowerCase()];  // Transform field value to lowercase
        } else {
            console.warn(`Field '${fieldLabel}' not found in stored form.`);
        }
    }

     // Construct transformed data object
    const transformedData = {
        title: formname,
        content: 'forme external service',
        form: {
            id: formID,
            url: `http://localhost:8080/api/v3/forms/${formID}`
        },
        values: values
    };
    console.log (JSON.stringify(transformedData));

    return transformedData;
}


/*const inputData = {
    'radio - 2 [Sure,Nope]': 'Sure',
    'short text': 'hi',
    'form name': 'Test Webhook',
    'form id': 53
};
*/




module.exports = { transformFormData };

