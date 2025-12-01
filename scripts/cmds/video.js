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
    // Bỏ kiểm tra author để cho phép tùy chỉnh
    // const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    // if (module.exports.config.author !== obfuscatedAuthor) {
    //   return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    // }

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
        {
          url: `https://api.ryzendesu.vip/api/downloader/alldown?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.data?.medias?.[0]?.url || data?.data?.video || data?.url
        },
        {
          url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.video?.noWatermark || data?.video?.watermark
        },
        {
          url: `https://api-samir.onrender.com/download?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.url || data?.video
        },
        {
          url: `https://api.neoxr.eu/api/download?url=${encodeURIComponent(link)}&apikey=kanna`,
          parser: (data) => data?.data?.url || data?.url
        },
        {
          url: `https://widipe.com/download/alldown?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.result?.url || data?.url
        }
      ];

      let videoUrl = null;
      let lastError = null;

      // Thử từng API cho đến khi tìm được video
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`Trying API: ${endpoint.url}`);
          const response = await axios.get(endpoint.url, { 
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (response.data) {
            videoUrl = endpoint.parser(response.data);
            if (videoUrl) {
              console.log(`Success with API: ${endpoint.url}`);
              break;
            }
          }
        } catch (apiError) {
          lastError = apiError;
          const status = apiError.response?.status || 'unknown';
          console.log(`API failed (${status}): ${endpoint.url} - ${apiError.message}`);
          continue;
        }
      }

      if (!videoUrl) {
        const errorMsg = lastError?.response?.status === 500 
          ? "❌ | API đang gặp sự cố (Error 500). Vui lòng thử lại sau hoặc dùng link khác."
          : getLang("error");
        return message.reply(errorMsg);
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
