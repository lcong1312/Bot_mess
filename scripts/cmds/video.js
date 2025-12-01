const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    aliases: ["tiktok", "tt", "fb", "fbvideo", "ytb", "youtube"],
    version: "2.0",
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
      missingLink: "⚠️ Vui lòng nhập link video!\nVí dụ: {pn} https://www.tiktok.com/@user/video/123456",
      downloading: "⏳ Đang tải video, vui lòng đợi...",
      success: "✅ Tải video thành công!",
      error: "❌ Không thể tải video. Link có thể bị riêng tư hoặc không hợp lệ.",
      invalidLink: "❌ Link không hợp lệ. Hỗ trợ: TikTok, Facebook, YouTube, Instagram."
    },
    en: {
      missingLink: "⚠️ Please provide a video link!\nExample: {pn} https://www.tiktok.com/@user/video/123456",
      downloading: "⏳ Downloading video, please wait...",
      success: "✅ Video downloaded successfully!",
      error: "❌ Cannot download video. Link may be private or invalid.",
      invalidLink: "❌ Invalid link. Supported: TikTok, Facebook, YouTube, Instagram."
    }
  },

  onStart: async function ({ api, event, args, getLang, message }) {
    const link = args.join(" ");
    
    if (!link) {
      return message.reply(getLang("missingLink"));
    }

    // Kiểm tra link có hợp lệ không
    const supportedPlatforms = [
      /tiktok\.com/i,
      /vm\.tiktok\.com/i,
      /vt\.tiktok\.com/i,
      /facebook\.com|fb\.watch|fb\.com/i,
      /youtube\.com|youtu\.be/i,
      /instagram\.com/i
    ];

    const isValidLink = supportedPlatforms.some(pattern => pattern.test(link));
    
    if (!isValidLink) {
      return message.reply(getLang("invalidLink"));
    }

    const waitMsg = await message.reply(getLang("downloading"));

    try {
      // Danh sách API dự phòng - cập nhật mới
      const apiEndpoints = [
        // API 1: tikwm.com - ổn định cho TikTok
        {
          url: `https://www.tikwm.com/api/?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.data?.play || data?.data?.hdplay || data?.data?.wmplay
        },
        // API 2: tiktokio
        {
          url: `https://api.tiktokio.com/api/v1/download?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.data?.video || data?.video
        },
        // API 3: ryzendesu
        {
          url: `https://api.ryzendesu.vip/api/downloader/alldown?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.data?.medias?.[0]?.url || data?.data?.video || data?.url
        },
        // API 4: tiklydown
        {
          url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(link)}`,
          parser: (data) => data?.video?.noWatermark || data?.video?.watermark
        },
        // API 5: cobalt
        {
          url: `https://co.wuk.sh/api/json`,
          method: 'POST',
          body: { url: link, vCodec: "h264", vQuality: "720", aFormat: "mp3" },
          parser: (data) => data?.url
        },
        // API 6: widipe
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
          let response;
          
          if (endpoint.method === 'POST') {
            response = await axios.post(endpoint.url, endpoint.body, {
              timeout: 30000,
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
              }
            });
          } else {
            response = await axios.get(endpoint.url, {
              timeout: 30000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
              }
            });
          }
          
          if (response.data) {
            videoUrl = endpoint.parser(response.data);
            if (videoUrl) {
              console.log(`[Video] Success with: ${endpoint.url}`);
              break;
            }
          }
        } catch (apiError) {
          lastError = apiError;
          console.log(`[Video] API failed: ${endpoint.url} - ${apiError.message}`);
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
        timeout: 120000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.tiktok.com/'
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
            console.error("[Video] Error deleting file:", e);
          }
        });
      });

      writer.on("error", (err) => {
        console.error("[Video] Write error:", err);
        message.reply(getLang("error"));
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      });

    } catch (error) {
      console.error("[Video] Download error:", error.message);
      return message.reply(getLang("error"));
    }
  }
};
