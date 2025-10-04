// src/lib/validateGST.ts
import axios from 'axios';
// Function to validate GSTIN
export const validateGST = async (gstin, apiKey) => {
    // Endpoint
    const gstURI = `https://appyflow.in/api/verifyGST?gstNo=${gstin}&key_secret=${apiKey}`;
    try {
        const response = await axios.get(gstURI, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        console.log('GST API Response:', response.data); // Debug log
        if (!response.data || !response.data.taxpayerInfo) {
            throw new Error('Invalid GST number or missing data');
        }
        return response.data.taxpayerInfo;
    }
    catch (error) {
        console.error('Error validating GST:', error.response?.data || error.message);
        throw new Error('GST validation failed');
    }
};
