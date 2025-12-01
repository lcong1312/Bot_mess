const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "anime",
    aliases: ["anivid", "animevideo"],
    version: "1.7",
    role: 0,
    author: "MahMUD | Viết Công",
    category: "anime",
    description: {
      vi: "Lấy video anime ngẫu nhiên",
      en: "Get random anime video"
    },
    guide: {
      vi: "Dùng {pn} để lấy video anime ngẫu nhiên hoặc {pn} list để xem tổng số anime.",
      en: "Use {pn} to get a random anime video or {pn} list to see total anime count."
    }
  },

  langs: {
    vi: {
      noCategories: "❌ | Không tìm thấy danh mục anime.",
      loading: "🐤 | Đang tải video anime ngẫu nhiên... Vui lòng chờ!!",
      noVideos: "❌ | Không tìm thấy video.",
      hereVideo: "✨ | Đây là video anime của bạn",
      downloadError: "❌ | Lỗi tải xuống.",
      fetchError: "❌ | Không thể lấy hoặc gửi video."
    },
    en: {
      noCategories: "❌ | No anime categories found.",
      loading: "🐤 | Loading random anime video... Please wait!!",
      noVideos: "❌ | No videos found.",
      hereVideo: "✨ | Here's your anime video",
      downloadError: "❌ | Download error.",
      fetchError: "❌ | Failed to fetch or send video."
    }
  },

  onStart: async function ({ api, event, message, args, getLang }) {
    try {
      if (args[0] === "list") {
        const apiUrl = await mahmud();
        const response = await axios.get(`${apiUrl}/api/album/list`);
        const lines = response.data.message.split("\n");
        const animeCategories = lines.filter(line =>
          /anime/i.test(line) && !/hanime/i.test(line) && !/Total\s*anime/i.test(line)
        );
        if (!animeCategories.length) {
          return api.sendMessage(getLang("noCategories"), event.threadID, event.messageID);
        }
        return api.sendMessage(animeCategories.join("\n"), event.threadID, event.messageID);
      }

      const loadingMessage = await message.reply(getLang("loading"));

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/album/videos/anime?userID=${event.senderID}`);
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
      api.sendMessage(getLang("fetchError"), event.threadID, event.messageID);
    }
  }
};
