const axios = require('axios');

module.exports = async function getCoordinates(address) {
    try {
        const response = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
            params: {
                api_key: process.env.ORS_API_KEY,  // Load API key from environment
                text: address,
            },
        });
        const { features } = response.data;
        if (features && features.length > 0) {
            return features[0].geometry.coordinates;
        } else {
            throw new Error("No coordinates found for this address.");
        }
    } catch (error) {
        console.error("Error getting coordinates:", error.message);
        throw error;
    }
};
