const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config({path:'../.env'})
 // Load environment variables from .env
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID;
const app = express();
const port = 5000;  // You can change this port if needed
app.use(cors());
app.use(express.json());
// Parse JSON bodies
app.use(express.json());
TWILIO_PHONE_NUMBER=process.env.TWILIO_PHONE_NUMBER;
// Twilio setup from environment variables
const client = twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

// Send SMS endpoint
app.post('/send-sms', (req, res) => {
    const { phoneNumbers, message, location } = req.body;
  
    phoneNumbers.forEach((number) => {
      client.messages.create({
        body: `Distress Alert: ${message}.`,
        from: TWILIO_PHONE_NUMBER,
        to: number,
      })
      .then((message) => {
        console.log(`Message sent to ${number}: ${message.sid}`);
      })
      .catch((error) => {
        console.error(`Error sending message to ${number}: ${error.message}`);
        res.status(500).send(`Failed to send message to ${number}: ${error.message}`);
      });
    });
  
    res.status(200).send('Messages sent successfully.');
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});