const admin = require('firebase-admin');
const functions = require('firebase-functions');


const prod = process.env.NODE_ENV === 'production';
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

try {
    adminConfig.credential = admin.credential.cert(JSON.parse(functions.config().kitchen.cert));

    if (prod) {
        console.log('Using Service Key from env!');
    }
} catch (e) {
    console.error('Service Key env not found!');

    try {
        adminConfig.credential = require('../serviceAccountKey.json');

        if (prod) {
            console.log('Using Service Key from file!');
        }
    } catch (error) {
        console.error('Service Key env not found! No Service Key to use!');
    }
}

if (!admin.apps.length) {
    try {
        admin.initializeApp(adminConfig);
    } catch (e) {
        console.error('Failed to initialize Firebase: ', e);
    }
}

module.exports = admin;
