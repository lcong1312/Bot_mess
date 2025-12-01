const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    aliases: ["tiktok", "tt", "fb", "fbvideo", "ytb", "youtube"],
    version: "1.0",
    role: 0,
    author: "MahMUD | Viết Công",
    category: "media",
    description: {
      vi: "Tải video từ TikTok, Facebook, YouTube, Instagram",
      en: "Download video from TikTok, Facebook, YouTube, Instagram"
    },
    guide: {
      vi: "{pn} <link video>\nVí dụ: {pn} https://www.tiktok.com/@user/video/123456",
      en: "{pn} <video link>\nExample: {pn} https://www.tiktok.com/@user/video/123456"
    }
  },

  langs: {
    vi: {
      missingLink: "⚠️ | Vui lòng nhập link video!\nVí dụ: {pn} https://www.tiktok.com/@user/video/123456",
      downloading: "⏳ | Đang tải video, vui lòng đợi...",
      success: "✅ | Tải video thành công!",
      error: "❌ | Không thể tải video. Vui lòng kiểm tra lại link hoặc thử lại sau.",
      invalidLink: "❌ | Link không hợp lệ. Hỗ trợ: TikTok, Facebook, YouTube, Instagram."
    },
    en: {
      missingLink: "⚠️ | Please provide a video link!\nExample: {pn} https://www.tiktok.com/@user/video/123456",
      downloading: "⏳ | Downloading video, please wait...",
      success: "✅ | Video downloaded successfully!",
      error: "❌ | Cannot download video. Please check the link or try again later.",
      invalidLink: "❌ | Invalid link. Supported: TikTok, Facebook, YouTube, Instagram."
    }
  },

  onStart: async function ({ api, event, args, getLang, message }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }

    const link = args.join(" ");
    
    if (!link) {
      return message.reply(getLang("missingLink"));
    }

    // Kiểm tra link có hợp lệ không
    const supportedPlatforms = [
      /tiktok\.com/i,
      /facebook\.com|fb\.watch|fb\.com/i,
      /youtube\.com|youtu\.be/i,
      /instagram\.com/i
    ];

    const isValidLink = supportedPlatforms.some(pattern => pattern.test(link));
    
    if (!isValidLink) {
      return message.reply(getLang("invalidLink"));
    }

    message.reply(getLang("downloading"));

    try {
      // API để tải video từ nhiều nền tảng
      const apiEndpoints = [
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(link)}`,
        `https://api.ryzendesu.vip/api/downloader/alldown?url=${encodeURIComponent(link)}`,
        `https://api-samir.onrender.com/download?url=${encodeURIComponent(link)}`
      ];

      let videoUrl = null;
      let videoData = null;

      // Thử từng API cho đến khi tìm được video
      for (const apiUrl of apiEndpoints) {
        try {
          const response = await axios.get(apiUrl, { timeout: 30000 });
          
          // Xử lý response từ các API khác nhau
          if (response.data) {
            if (response.data.video?.noWatermark) {
              videoUrl = response.data.video.noWatermark;
              break;
            } else if (response.data.data?.video) {
              videoUrl = response.data.data.video;
              break;
            } else if (response.data.url) {
              videoUrl = response.data.url;
              break;
            } else if (response.data.medias && response.data.medias.length > 0) {
              videoUrl = response.data.medias[0].url;
              break;
            }
          }
        } catch (apiError) {
          console.log(`API failed: ${apiUrl}`, apiError.message);
          continue;
        }
      }

      if (!videoUrl) {
        return message.reply(getLang("error"));
      }

      // Tải video
      const filePath = path.join(__dirname, `video_${Date.now()}.mp4`);
      
      const videoStream = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const writer = fs.createWriteStream(filePath);
      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: getLang("success"),
          attachment: fs.createReadStream(filePath)
        }, () => {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error("Error deleting file:", e);
          }
        });
      });

      writer.on("error", (err) => {
        console.error("Write error:", err);
        message.reply(getLang("error"));
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      });

    } catch (error) {
      console.error("Download error:", error.message);
      return message.reply(getLang("error"));
    }
  }
};
