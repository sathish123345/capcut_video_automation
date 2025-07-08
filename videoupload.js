require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const videoList = [
{
  topic: "Canada Friendly People",
  keyPoint: "Canadians are globally known for being polite and friendly.",
  title: "Why Are Canadians So Friendly? 😄🇨🇦 Discover the Truth! #CanadaFacts #FriendlyNation",
  description: "Canada is famous not just for its landscapes but also for its incredibly friendly people. From warm welcomes to polite conversations, Canadian friendliness is legendary. Find out why this reputation exists and how it shapes the country’s identity! 🍁 #Canada #FriendlyPeople #CanadianCulture #Kindness #PoliteNation",
  tags: "Canada facts, Canadian culture, friendly Canadians, why Canadians are nice, Canadian politeness, Canadian kindness, travel Canada, fun facts Canada, learn about Canada, polite people",
  categoryId: 27,
  publishAt: "2025-11-02T12:00:00Z",
  playlistId:'******'
}

];

// OAuth setup
const oauth2Client = new google.auth.OAuth2(
  process.env.YT_CLIENT_ID,
  process.env.YT_CLIENT_SECRET,
  process.env.YT_REDIRECT_URI
);

oauth2Client.setCredentials({
  access_token: process.env.YT_ACCESS_TOKEN,
  refresh_token: process.env.YT_REFRESH_TOKEN,
  scope: process.env.YT_SCOPE,
  token_type: process.env.YT_TOKEN_TYPE,
  expiry_date: parseInt(process.env.YT_EXPIRY_DATE)
});

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

async function uploadVideo(video) {
  const filePath = path.join(__dirname, 'videos', `${video.topic}.mp4`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  console.log(`📤 Uploading: ${video.title}`);

  try {
    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: video.title,
          description: video.description,
          tags: video.tags.split(',').map(t => t.trim()),
          categoryId: video.categoryId.toString(),
           playlistId: video.playlistId,
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en'
        },
        status: {
          privacyStatus: 'private',
          selfDeclaredMadeForKids: false,
          publishAt: video.publishAt
        }
      },
      media: {
        body: fs.createReadStream(filePath)
      }
    });

    console.log(`✅ Uploaded: https://www.youtube.com/watch?v=${res.data.id}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${video.title}`);
    console.error(err.response?.data || err.message);
  }
}

(async () => {
  for (const video of videoList) {
    await uploadVideo(video);
  }
})();
