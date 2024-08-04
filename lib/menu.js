const {
  PREFIX, 
  mode, 
  commands
} = require("./events");
const { 
  izumi, 
  clockString, 
  getUrl, 
  parsedJid, 
  isAdmin 
} = require("../lib");
const version = require("../package.json").version;
const { getJson } = require("./utils");
const config = require("../config");

async function sendMenu(message, match) {
    try {
        const hrs = new Date().getHours({ timeZone: 'Asia/Kolkata' });
        const { result } = await getJson("https://api.maskser.me/api/quote?apikey=izumi-v3");

        let wish = '';
        if (hrs < 12) wish = '⛅𝙂𝙤𝙤𝙙 𝙈𝙤𝙧𝙣𝙞𝙣𝙜';
        else if (hrs >= 12 && hrs <= 16) wish = '🌞𝙂𝙤𝙤𝙙 𝘼𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣';
        else if (hrs >= 16 && hrs <= 20) wish = '🔆𝙂𝙤𝙤𝙙 𝙀𝙫𝙚𝙣𝙞𝙣𝙜';
        else if (hrs >= 20 && hrs <= 24) wish = '🌙𝙂𝙤𝙤𝙙 𝙉𝙞𝙜𝙝𝙩';

        if (config.MENU_BUTTON) {
            // Button menu
            const link = config.MENU_URL;
            const url = await message.ParseButtonMedia(link);
            let buttonArray = [
                { type: "reply", params: { display_text: "DOWNLOADER", id: `${PREFIX}.downloader` } },
                { type: "reply", params: { display_text: "INFO", id: `${PREFIX}.info` } },
                { type: "reply", params: { display_text: "GROUP", id: `${PREFIX}.group` } },
                { type: "reply", params: { display_text: "MEDIA", id: `${PREFIX}.media` } },
                { type: "reply", params: { display_text: "AnimeVideo", id: `${PREFIX}.AnimeVideo` } },
                { type: "reply", params: { display_text: "USER", id: `${PREFIX}.user` } },
                { type: "reply", params: { display_text: "GENERATOR", id: `${PREFIX}.generator` } },
                { type: "reply", params: { display_text: "AnimeImage", id: `${PREFIX}.AnimeImage` } }
            ];

            // Sort buttons alphabetically
            buttonArray.sort((a, b) => a.params.display_text.localeCompare(b.params.display_text));

            const taxt = `╭────────────────╮
            *_🌻ǫᴜᴏᴛᴇ ᴏғ ᴛʜᴇ ᴅᴀʏ 🌻_* 
            ╰────────────────╯
            📖 *${result.quoteText}* 🖋️
            \n${wish} ${message.pushName}`;

            let data = {
                jid: message.jid,
                button: buttonArray,
                header: {
                    title: taxt,
                    subtitle: taxt,
                    hasMediaAttachment: true,
                },
                footer: {
                    text: `𝗠𝗢𝗗𝗘 : ${mode ? '𝗣𝗥𝗜𝗩𝗔𝗧𝗘' : '𝗣𝗨𝗕𝗟𝗜𝗖'}\n𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : ${version}\n𝚰𝚭𝐔𝚳𝚰-𝚅3`,
                },
                body: {
                    text: "",
                },
            };

            if (link.endsWith(".mp4")) {
                data.header.videoMessage = url;
            } else {
                data.header.imageMessage = url;
            }

            return await message.sendMessage(message.jid, data, {}, "interactive");

        } else {
            // Normal menu
            const readMore = String.fromCharCode(8206).repeat(4001);
            let menu = `\n╭━━━〔 ${config.BOT_NAME} 〕━━━┈
            ╭──────────────
            ❖ │  *OWNER*: ${config.OWNER_NAME}
            ❖ │  *COMMANDS*: ${
                        commands.filter((command) => command.pattern).length
                      }
            ❖ │  *MODE*: ${mode ? '𝗣𝗥𝗜𝗩𝗔𝗧𝗘' : '𝗣𝗨𝗕𝗟𝗜𝗖'}
            ❖ │  *PREFIX*: ${PREFIX}
            ❖ │  *VERSION*: ${version}
            ╰──────────────
            ╰━━━━━━━━━━━━━━━┈\n ${readMore}`;

            let cmnd = [];
            let cmd;
            let category = [];
            commands.forEach((command, num) => {
                if (command.pattern instanceof RegExp) {
                    cmd = String(command.pattern).split(/\W+/)[1];
                }

                if (!command.dontAddCommandList && command.pattern) {
                    let type = command.type ? command.type.toLowerCase() : "misc";

                    cmnd.push({ cmd, type });

                    if (!category.includes(type)) category.push(type);
                }
            });
            cmnd.sort();
            category.sort().forEach((cmmd) => {
                menu += `\n ╭─────────────────────┈⚆`;
                menu += `\n  │ 「 *${cmmd.toUpperCase()}* 」`;
                menu += `\n ╰┬────────────────────┈⚆`;
                menu += `\n ╭┴────────────────────┈⚆`;
                let comad = cmnd.filter(({ type }) => type == cmmd);
                comad.forEach(({ cmd }) => {
                    menu += `\n❆  ${cmd.trim()}`;
                });
                menu += `\n ╰─────────────────────┈⚆`;
            });
            menu += `\n\n${config.BOT_NAME}`;

            // Send normal menu with media
            let mediaUrl = config.MENU_URL;
            return await message.sendFromUrl(mediaUrl, { fileLength: "5555544444", gifPlayback: true, caption: menu }, { quoted: message });
        }
    } catch (e) {
        message.reply(e.toString());
    }
}

async function sendSegMenu(message, match, type) {
    let msg = '🌟 *HERE ARE THE AVAILABLE COMMANDS:* 🌟\n\n';
    let no = 1;

    commands.map((command) => {
        if (command.type === type && !command.dontAddCommandList && command.pattern) {
            const commandName = command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/)[2].trim();
            msg += `╔═━┈━═✦═━┈━═✦═━┈━═╗\n`;
            msg += `║  *${no++}. ${commandName}*\n`;
            msg += `╟─╖\n`;
            msg += `║ ${command.desc}\n`;
            msg += `╚═━┈━═✦═━┈━═✦═━┈━═╝\n\n`;
        }
    });

    await message.reply(msg.trim());
}

module.exports = { sendMenu, sendSegMenu };
