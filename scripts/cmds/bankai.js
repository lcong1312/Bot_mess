const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "bankai",
    aliases: ["bankaivid"],
    version: "1.7",
    role: 0,
    author: "MahMUD | Viết Công",
    category: "anime",
    description: {
      vi: "Lấy video Bankai ngẫu nhiên",
      en: "Get random Bankai video"
    },
    guide: {
      vi: "Dùng {pn} để lấy video Bankai ngẫu nhiên",
      en: "Use {pn} to get a random Bankai video"
    }
  },

  onStart: async function ({ api, event }) {try {
      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/album/videos/bleach?userID=${event.senderID}`);
      if (!res.data.success || !res.data.videos.length)
        return api.sendMessage("❌ | Không tìm thấy video.", event.threadID, event.messageID);

      const url = res.data.videos[Math.floor(Math.random() * res.data.videos.length)];
      const filePath = path.join(__dirname, "temp_video.mp4");

      const video = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const writer = fs.createWriteStream(filePath);
      video.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: "𝐕𝐢𝐝𝐞𝐨 𝐁𝐀𝐍𝐊𝐀𝐈 𝐜𝐮̉𝐚 𝐛𝐚̣𝐧 đ𝐚̂𝐲 😘",
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      });

      writer.on("error", () => {
        api.sendMessage("❌ | Lỗi tải xuống.", event.threadID, event.messageID);
      });
    } catch (e) {
      console.error("ERROR:", e);
      api.sendMessage("🥹 Lỗi, liên hệ admin.", event.threadID, event.messageID);
    }
  }
};
