const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const functions = require('firebase-functions');


const prod = process.env.NODE_ENV === 'production';

let sgKey;

try {
    sgKey = functions.config().kitchen.sendgrid;

    if (prod) {
        console.log('Using SendGrid Key from env!');
    }
} catch (e) {
    console.error('SendGrid Key env not found!', e);

    try {
        sgKey = fs.readFileSync('../sendgridkey.txt', 'utf8');

        if (prod) {
            console.log('Using SendGrid Key from file!');
        }
    } catch (error) {
        console.error('SendGrid Key env not found! No SendGrid Key to use!');
    }
}

sgMail.setApiKey(sgKey);

module.exports = sgMail;
