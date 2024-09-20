const { izumi, mode, blackVideo } = require("../lib/");
const { uploadToGitHub, generateRandomName } = require("../lib/mediaUpload");
const fs = require('fs');

izumi({
    pattern: 'upload ?(.*)',
    fromMe: mode,
    desc: 'Upload media files to GitHub',
    type: 'generator'
}, async (m, text, client) => {
    await m.reply("Processing...");

    if (!m.quoted) {
        return m.reply("Reply to an image/audio/video message!");
    }

    // Handle image
    if (m.quoted.image) {
        await m.reply("Downloading image...");
        const media = await m.quoted.download();
        const res = await uploadToGitHub(media, generateRandomName('png'), m, 'photo');
        await m.reply(res);

    // Handle video
    } else if (m.quoted.video) {
        await m.reply("Downloading video...");
        const media = await m.quoted.download();
        const res = await uploadToGitHub(media, generateRandomName('mp4'), m, 'video');
        await m.reply(res);

    // Handle audio with black video command
    } else if (m.quoted.audio) {
        await m.reply("Creating black video...");
        try {
            const audioPath = await m.quoted.download();
            const videoBuffer = await blackVideo(audioPath);
            const videoName = generateRandomName('mp4');
            fs.writeFileSync(videoName, videoBuffer); // Save video to a file

            const res = await uploadToGitHub(videoName, videoName, m, 'video');
            await m.reply(`URL: ${res}\nWait 5 seconds before using the URL.`);
            fs.unlinkSync(videoName); // Clean up the generated file
        } catch (e) {
            await m.reply(`Error: ${e.message}`);
        }

    } else {
        return m.reply("Reply to a video/image/audio!");
    }
});
