// authHelper.js
require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  process.env.YT_CLIENT_ID,
  process.env.YT_CLIENT_SECRET,
  process.env.YT_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log(`🔗 Visit this URL and authorize:\n\n${url}\n`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('📥 Paste the code from browser here: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(`\n✅ Add the following to your .env:\n`);
    console.log(`YT_ACCESS_TOKEN="${tokens.access_token}"`);
    console.log(`YT_REFRESH_TOKEN="${tokens.refresh_token}"`);
    console.log(`YT_SCOPE="${tokens.scope}"`);
    console.log(`YT_TOKEN_TYPE="${tokens.token_type}"`);
    console.log(`YT_EXPIRY_DATE="${tokens.expiry_date}"`);
  } catch (error) {
    console.error('❌ Failed to get tokens:', error);
  }
});
