const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "2.3.0",
    author: "Arafat | Viết Công",
    countDown: 0,
    role: 0,
    description: {
      vi: "Tự động tải video khi gửi link",
      en: "Auto download when link sent"
    },
    category: "media",
  },

  langs: {
    vi: {
      autoDownloadMode: "Chế độ tự động tải video",
      downloading: "⏳ Đang tải video, vui lòng chờ...",
      downloadSuccess: "✅ Tải video thành công!",
      notFound: "❌ Không tìm thấy video! Link có thể bị riêng tư hoặc không hợp lệ.",
      error: "⚠️ Lỗi: %1"
    },
    en: {
      autoDownloadMode: "Auto download mode",
      downloading: "⏳ Downloading, please wait...",
      downloadSuccess: "✅ Video downloaded successfully!",
      notFound: "❌ Video not found! Link may be private or invalid.",
      error: "⚠️ Error: %1"
    }
  },

  onStart: async function({ api, event, getLang }) {
    api.sendMessage(getLang("autoDownloadMode"), event.threadID);
  },

  onChat: async function({ api, event, getLang }) {
    const text = event.body || "";
    if (!text) return;

    const url = text.match(/https?:\/\/[^\s]+/g)?.[0];
    if (!url) return;

    const supported = [
      "tiktok.com",
      "facebook.com",
      "instagram.com",
      "youtu.be",
      "youtube.com",
      "x.com",
      "twitter.com",
      "fb.watch",
      "vm.tiktok.com",
      "vt.tiktok.com"
    ];

    if (!supported.some(domain => url.includes(domain))) return;

    try {
      const waitMsg = await api.sendMessage(
        getLang("downloading"),
        event.threadID
      );

      // Danh sách API dự phòng - cập nhật mới
      const apiEndpoints = [
        // API 1: tikwm.com - ổn định cho TikTok
        {
          url: `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.data?.play || data?.data?.hdplay || data?.data?.wmplay
        },
        // API 2: tiktokio
        {
          url: `https://api.tiktokio.com/api/v1/download?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.data?.video || data?.video
        },
        // API 3: ryzendesu
        {
          url: `https://api.ryzendesu.vip/api/downloader/alldown?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.data?.medias?.[0]?.url || data?.data?.video || data?.url
        },
        // API 4: tiklydown
        {
          url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.video?.noWatermark || data?.video?.watermark
        },
        // API 5: cobalt
        {
          url: `https://co.wuk.sh/api/json`,
          method: 'POST',
          body: { url: url, vCodec: "h264", vQuality: "720", aFormat: "mp3" },
          parser: (data) => data?.url
        },
        // API 6: widipe
        {
          url: `https://widipe.com/download/alldown?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.result?.url || data?.url
        }
      ];

      let videoUrl = null;
      let lastError = null;

      // Thử từng API
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
              console.log(`[AutoDL] Success with: ${endpoint.url}`);
              break;
            }
          }
        } catch (apiError) {
          lastError = apiError;
          console.log(`[AutoDL] API failed: ${endpoint.url} - ${apiError.message}`);
          continue;
        }
      }

      if (!videoUrl) {
        await api.unsendMessage(waitMsg.messageID);
        return api.sendMessage(getLang("notFound"), event.threadID, event.messageID);
      }

      // Tải video
      const videoBuffer = (await axios.get(videoUrl, { 
        responseType: "arraybuffer",
        timeout: 120000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.tiktok.com/'
        }
      })).data;
      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const videoPath = path.join(cacheDir, `autodl_${Date.now()}.mp4`);
      fs.writeFileSync(videoPath, videoBuffer);

      await api.unsendMessage(waitMsg.messageID);

      await api.sendMessage({
        body: getLang("downloadSuccess"),
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        try {
          fs.unlinkSync(videoPath);
        } catch (e) {
          console.error("[AutoDL] Error deleting file:", e);
        }
      }, event.messageID);

    } catch (err) {
      console.error("[AutoDL] Error:", err.message);
      api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
    }
  }
};
