const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "onepiece",
    aliases: ["onepiecevid", "onep", "onepvideo"],
    version: "1.7",
    role: 0,
    author: "MahMUD | Viết Công",
    category: "anime",
    description: {
      vi: "Lấy video One Piece ngẫu nhiên",
      en: "Get random One Piece video"
    },
    guide: {
      vi: "Dùng {pn} để lấy video One Piece ngẫu nhiên.",
      en: "Use {pn} to get a random One Piece video."
    }
  },

  langs: {
    vi: {
      noVideos: "❌ | Không tìm thấy video One Piece.",
      hereVideo: "✨ | Đây là video One Piece của bạn",
      downloadError: "❌ | Lỗi tải xuống.",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noVideos: "❌ | No One Piece videos found.",
      hereVideo: "✨ | Here's your One Piece video",
      downloadError: "❌ | Download error.",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, getLang }) {try {
      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/album/videos/onepiece?userID=${event.senderID}`);
      if (!res.data.success || !res.data.videos.length)
        return api.sendMessage(getLang("noVideos"), event.threadID, event.messageID);

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
          body: getLang("hereVideo"),
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      });

      writer.on("error", () => {
        api.sendMessage(getLang("downloadError"), event.threadID, event.messageID);
      });
    } catch (e) {
      console.error("ERROR:", e);
      api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  }
};
