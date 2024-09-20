const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

const GITHUB_TOKEN = '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'; // Hard-coded token
const GITHUB_OWNER = 'eypz'; // Your GitHub username
const GITHUB_REPO = 'web'; // Your repository name
const UPLOAD_URL = 'https://izumi-upload.vercel.app/'; // Vercel upload URL

// Function to generate a random filename
function generateRandomName(extension) {
    return crypto.randomBytes(16).toString('hex') + '.' + extension;
}

// Function to upload media to GitHub
async function uploadToGitHub(media, filename, m, folder) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folder}/${filename}`;
    const fileContent = fs.readFileSync(media, { encoding: 'base64' });

    const data = {
        message: `Upload ${filename}`,
        content: fileContent
    };

    try {
        await m.reply("Uploading to GitHub...");

        const response = await axios.put(url, data, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 201) {
            const fileUrl = `${UPLOAD_URL}${folder}/${filename}`;
            return fileUrl;
        } else {
            await m.reply(`Failed to upload: ${response.data.message}`);
            return `Failed to upload: ${response.data.message}`;
        }
    } catch (error) {
        const errorMessage = error.response
            ? `Upload error: ${error.response.data.message}`
            : `Upload error: ${error.message}`;
        await m.reply(errorMessage);
        return errorMessage;
    }
}

module.exports = { uploadToGitHub, generateRandomName };
