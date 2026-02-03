const axios = require('axios');

async function testEmailCase(email1, email2) {
    try {
        console.log(`Testing email1: ${email1}`);
        const response1 = await axios.get(`https://multi-bakend.onrender.com/api/users/?email=${email1}`);
        console.log(`Response1 length: ${response1.data.length}`);
        console.log(`Response1:`, response1.data);

        console.log(`\nTesting email2: ${email2}`);
        const response2 = await axios.get(`https://multi-bakend.onrender.com/api/users/?email=${email2}`);
        console.log(`Response2 length: ${response2.data.length}`);
        console.log(`Response2:`, response2.data);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Test different email cases
testEmailCase('emmanuelobakpolor6655@gmail.com', 'Emmanuel.O@lampnets.com');
