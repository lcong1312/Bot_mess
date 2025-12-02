const fs = require("fs");
const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports.config = {
  name: "myboy",
  version: "1.7",
  role: 0,
  author: "MahMUD | Viết Công",
  category: "love",
  cooldowns: 5,
  description: {
    vi: "Tạo ảnh cặp đôi nam",
    en: "Create boy couple image"
  },
  guide: {
    vi: "{pn} [tag/reply người]",
    en: "{pn} [mention/reply person]"
  }
};

module.exports.onStart = async ({ event, api, args }) => {try {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);

    if (!mention)
      return api.sendMessage("Vui lòng tag hoặc reply 1 người", threadID, messageID);

    const user1 = mention;
    const user2 = senderID;

    const baseUrl = await baseApiUrl();
    const apiUrl = `${baseUrl}/api/myboy?user1=${user1}&user2=${user2}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const imgPath = __dirname + `/cache/myboy_${user1}_${user2}.png`;
    fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

    api.sendMessage({
      body: `𝐓𝐇𝐀𝐓'𝐒 𝐌𝐀𝐇 𝐁𝐎𝐘 🖤`,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("🥹 Lỗi, liên hệ admin.", event.threadID, event.messageID);
  }
};
