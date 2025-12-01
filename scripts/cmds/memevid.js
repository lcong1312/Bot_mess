const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "memevideo",
    aliases: ["memevid"],
    version: "1.7",
    role: 0,
    author: "MahMUD | Viết Công",
    category: "fun",
    description: {
      vi: "Lấy video meme ngẫu nhiên",
      en: "Get random meme video"
    },
    guide: {
      vi: "Dùng {pn} để lấy video meme ngẫu nhiên.",
      en: "Use {pn} to get a random meme video."
    }
  },

  langs: {
    vi: {
      noVideos: "❌ | Không tìm thấy video.",
      hereVideo: "Đây là video meme của bạn 🐸",
      downloadError: "❌ | Lỗi tải xuống.",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noVideos: "❌ | No videos found.",
      hereVideo: "Here's your meme video 🐸",
      downloadError: "❌ | Download error.",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }
    
    try {
      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/album/videos/meme?userID=${event.senderID}`);
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
