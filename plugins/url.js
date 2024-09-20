const { izumi, mode, blackVideo } = require("../lib/");
const { uploadToGitHub, generateRandomName } = require("../lib/mediaUpload");

izumi({
    pattern: 'url ?(.*)',
    fromMe: mode,
    desc: 'get media url',
    type: 'generator'
}, async (m, text, client) => {
    await m.reply("Processing...");

    if (!m.quoted) {
        return m.reply("Reply to an image/audio/video message!");
    }

    
    if (m.quoted.image) {
        await m.reply("Downloading image...");
        const media = await m.quoted.download();
        const res = await uploadToGitHub(media, generateRandomName('png'), m, 'photo');
        await m.reply(res);

    
    } else if (m.quoted.video) {
        await m.reply("Downloading video...");
        const media = await m.quoted.download();
        const res = await uploadToGitHub(media, generateRandomName('mp4'), m, 'video');
        await m.reply(res);


    } else if (m.quoted.audio) {
        await m.reply("Creating black video...");
        try {
            const audioPath = await m.quoted.download();
            const videoBuffer = await blackVideo(audioPath);
            const videoName = generateRandomName('mp4');
            fs.writeFileSync(videoName, videoBuffer);

            const res = await uploadToGitHub(videoName, videoName, m, 'video');
            await m.reply(`URL: ${res}\nWait 5 seconds before using the URL.`);
            fs.unlinkSync(videoName); 
        } catch (e) {
            await m.reply(`Error: ${e.message}`);
        }

    } else {
        return m.reply("Reply to a video/image/audio!");
    }
});
