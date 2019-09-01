const admin = require('firebase-admin');


let firebaseCert;

try {
    firebaseCert = require('../../serviceAccountKey.json');
    console.error('Using Service Key from file!');
} catch (e) {
    console.error('Service Key file not found!');

    try {
        firebaseCert = JSON.parse(
            process.env.KITCHEN_FIREBASE_CERT
            || process.env.kitchen_firebase_cert
            || process.env.kitchencert
        );
        console.error('Using Service Key from env!');
    } catch (error) {
        console.error('Service Key env not found! No Service Key to use!');
    }
}

try {
    console.log('Using Service Key with project_id: ', firebaseCert.project_id);
} catch (e) {
    console.error('Invalid Firebase Service Key!');
}

const config = {
    credential: admin.credential.cert(firebaseCert),
    apiKey: 'AIzaSyA837S0q33uSvnEK5L6Rba3b6HCnJS2x0Q',
    authDomain: 'kitchen-jobs-88e5c.firebaseapp.com',
    databaseURL: 'https://kitchen-jobs-88e5c.firebaseio.com',
    projectId: 'kitchen-jobs-88e5c',
    storageBucket: '',
    messagingSenderId: '786920529497',
    appId: '1:786920529497:web:4b636eefb03ef01f'
};

if (!admin.apps.length) {
    try {
        admin.initializeApp(config);
    } catch (e) {
        console.error('Failed to initialize Firebase: ', e);
    }
}

module.exports = admin;
