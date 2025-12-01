const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "2.2.0",
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
      downloading: "Đang tải xuống, vui lòng chờ......!!",
      downloadSuccess: "Tải video thành công ✅",
      notFound: "Không tìm thấy video!",
      error: "⚠️ Lỗi: %1"
    },
    en: {
      autoDownloadMode: "Auto download mode",
      downloading: "Downloading please wait a few moment......!!",
      downloadSuccess: "Video Download successfully ✅",
      notFound: "Not Found.....!!",
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
      "fb.watch"
    ];

    if (!supported.some(domain => url.includes(domain))) return;

    try {
      const waitMsg = await api.sendMessage(
        getLang("downloading"),
        event.threadID
      );

      // Danh sách API dự phòng
      const apiEndpoints = [
        {
          url: `https://api.ryzendesu.vip/api/downloader/alldown?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.data?.medias?.[0]?.url || data?.data?.video || data?.url
        },
        {
          url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.video?.noWatermark || data?.video?.watermark
        },
        {
          url: `https://widipe.com/download/alldown?url=${encodeURIComponent(url)}`,
          parser: (data) => data?.result?.url || data?.url
        },
        {
          url: `https://api.neoxr.eu/api/download?url=${encodeURIComponent(url)}&apikey=kanna`,
          parser: (data) => data?.data?.url || data?.url
        }
      ];

      let videoUrl = null;
      let lastError = null;

      // Thử từng API
      for (const endpoint of apiEndpoints) {
        try {
          const { data } = await axios.get(endpoint.url, {
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          videoUrl = endpoint.parser(data);
          if (videoUrl) break;
        } catch (apiError) {
          lastError = apiError;
          console.log(`API failed: ${endpoint.url} - ${apiError.message}`);
          continue;
        }
      }

      if (!videoUrl) {
        await api.unsendMessage(waitMsg.messageID);
        const errorMsg = lastError?.response?.status === 500
          ? "❌ | API đang gặp sự cố (Error 500). Vui lòng thử lại sau."
          : getLang("notFound");
        return api.sendMessage(errorMsg, event.threadID, event.messageID);
      }

      const videoBuffer = (await axios.get(videoUrl, { 
        responseType: "arraybuffer",
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
          console.error("Error deleting file:", e);
        }
      }, event.messageID);

    } catch (err) {
      const errorMsg = err.response?.status === 500
        ? "❌ | Lỗi 500: API đang gặp sự cố. Vui lòng thử lại sau."
        : getLang("error", err.message);
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
