const axios = require('axios');

let accessToken = null;
let refreshToken = null;
let tokenExpiryTime = Date.now() + 15 * 60 * 60 * 1000; 

const tokenConfig = {
    client_id: 'ushahidiui',
    client_secret: '35e7f0bca957836d05ca0492211b0ac707671261', 
    username: 'admin@example.com',
    password: 'admin',
    grant_type: 'password',
    scope: '*'
};

// Function to fetch access token from an external source
async function getAccessToken() {
    if (!accessToken || Date.now() > tokenExpiryTime) {
        const response = await axios.post('http://localhost:8080/oauth/token', tokenConfig, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('API response (getAccessToken):', response.data);

        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        console.log('New Access Token: ', accessToken);
    }
    return accessToken;
}
// Function to refresh access token
async function refreshAccessToken() {
    const response = await axios.post('http://localhost:8080/oauth/token', {
        grant_type: 'refresh_token',
        client_id: tokenConfig.client_id,
        client_secret: tokenConfig.client_secret,
        refresh_token: refreshToken
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;

    console.log('Token refreshed: ', accessToken);
    return accessToken;
}

module.exports = {
    getAccessToken,
    refreshAccessToken
};
