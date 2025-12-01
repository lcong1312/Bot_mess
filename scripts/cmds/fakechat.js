const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmhd = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "fakechat",
    aliases: ["fc", "F", "fake"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    role: 0,
    category: "fun",
    description: {
      vi: "Tạo ảnh chat giả",
      en: "Generate fake chat image"
    },
    guide: {
      vi: "Reply tin nhắn hoặc tag người + nội dung chat giả",
      en: "Reply message or mention user + fake chat text"
    },
    countDown: 5,
  },

  onStart: async ({ event, message, args, usersData, api }) => {try {
      let targetId;
      let userText = args.join(" ").trim();

      if (event.messageReply) {
        targetId = event.messageReply.senderID || event.messageReply.sender?.id;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        
        targetId = Object.keys(event.mentions)[0];
        const mentionName = event.mentions[targetId];
        userText = args.join(" ").replace(new RegExp(`@?${mentionName}`, "gi"), "").trim();
      } else if (args.length > 0 && /^\d+$/.test(args[0])) {
        
        targetId = args[0];
        userText = args.slice(1).join(" ").trim();
      } else {
        return message.reply("❌ Please reply, mention, or provide user uid.");
      }

      if (!userText) return message.reply("❌ Please provide the text for the fake chat.");

      let userName = "Unknown";
      try {
        userName = (await usersData.getName(targetId)) || targetId;
      } catch {
        userName = targetId;
      }

      const baseApi = await mahmhd();
      const apiUrl = `${baseApi}/api/fakechat?id=${targetId}&name=${encodeURIComponent(
        userName
      )}&text=${encodeURIComponent(userText)}`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `fakechat_${Date.now()}.png`);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      await message.reply({
        body: `🗨️ Fake chat generated for: ${userName}`,
        attachment: fs.createReadStream(filePath),
      });

      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch {}
      }, 5000);
    } catch {
      await message.reply("🥹error, contact MahMUD.");
    }
  },
};
