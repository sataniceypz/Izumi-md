const { getBuffer } = require("./functions");
const { ytsdl } = require("./ytdl");
const { convertToJpegThumbnail } = require("./utils");
async function Play(message,match) {
    match = match || message.reply_message.text;
    if (!match) {
      await message.reply("🎵 *Give me a query to search* 🎵");
      return;
    }

    try {
      const { dlink, title, vid } = await ytsdl(match);
      const buff = await getBuffer(dlink);

      const imageUrl = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
      const imageBuffer = await getBuffer(imageUrl);
      const jpegThumbnail = await convertToJpegThumbnail(imageBuffer);

      const data = {
        jid: message.jid,
        button: [
          {
            type: "reply",
            params: {
              display_text: " VIDEO",
              id: `${PREFIX}video${match}`,
            },
          },
          {
            type: "reply",
            params: {
              display_text: " AUDIO",
              id: `${PREFIX}song${match}`,
            },
          },
          {
            type: "url",
            params: {
              display_text: "ðŸ”— YouTube",
              url: `https://youtu.be/${vid}`,
              merchant_url: `https://youtu.be/${vid}`,
            },
          },
        ],
        header: {
          title: `${config.BOT_NAME} ðŸŽ¶`,
          subtitle: "Enjoy your media",
          hasMediaAttachment: true,
          documentMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7119-24/32604545_851065356638384_7249668240904382308_n.enc?ccb=11-4&oh=01_Q5AaIAFVEf2yJG3_OoOxdqZ3QYDJq1tG83FaLPxtPuZCBUMG&oe=66D81532&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            fileSha256: "dy9zqojkTg6P5m8eTB0IfN8HR+m0e/3hDTO+KdTlBD8=",
            fileLength: "3404444444444",
            pageCount: 0,
            mediaKey: "UMnfnUKdjkk8NOWTZi1dJO3dBW3GnGpuZs1rIV7G7Jo=",
            fileName: `${title}`,
            fileEncSha256: "qIf7efDAyiNfF3XJvPJ2SAfAeFxqxP/lqF1mTe8Iwbw=",
            directPath: "/v/t62.7119-24/32604545_851065356638384_7249668240904382308_n.enc?ccb=11-4&oh=01_Q5AaIAFVEf2yJG3_OoOxdqZ3QYDJq1tG83FaLPxtPuZCBUMG&oe=66D81532&_nc_sid=5e03e0",
            jpegThumbnail: jpegThumbnail,
            mediaKeyTimestamp: "1722848277"
          },
        },
        body: {
          text: `*${title}*\nChoose an option below to proceed:`,
        },
        footer: {
          text: `Powered by ${config.OWNER_NAME}`,
        },
      };

      await message.sendMessage(message.jid, data, {}, "interactive");
    } catch (error) {
      console.error("Error handling:", error);
      await message.reply("*Error processing your request. Please try again later.*");
    }
	}
	module.exports = { Play };