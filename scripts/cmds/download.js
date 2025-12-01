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

      const PROXY_BASE = "https://arafat-video-downlod-api.vercel.app";
      const PROXY_KEY = "my_super_secret_key_123";

      const { data } = await axios.get(`${PROXY_BASE}/alldl`, {
        params: { url: url, key: PROXY_KEY },
        timeout: 30000
      });

      if (!data?.result) throw new Error(getLang("notFound"));

      const videoBuffer = (await axios.get(data.result, { responseType: "arraybuffer" })).data;
      const videoPath = path.join(__dirname, "cache", `autodl_${Date.now()}.mp4`);
      fs.writeFileSync(videoPath, videoBuffer);

      await api.unsendMessage(waitMsg.messageID);

      await api.sendMessage({
        body: `${data.cp || getLang("downloadSuccess")}`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

    } catch (err) {
      api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
    }
  }
};
