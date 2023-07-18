const { google } = require('googleapis');
require('dotenv').config();



// Configurer l'authentification
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK
);

// Générer une URL pour l'authentification
const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});




module.exports = {
    url,
    oauth2Client
};



