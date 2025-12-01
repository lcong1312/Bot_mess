const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: 'pinterest',
    aliases: ['pin', 'pinterestsearch'],
    version: '1.0.2',
    author: 'Arafat',
    cooldown: 5,
    role: 0,
    description: {
      vi: "Tìm kiếm hình ảnh từ Pinterest",
      en: "Search images from Pinterest"
    },
    category: 'search',
    guide: {
      vi: "{pn} <từ khóa> [số lượng]\nVí dụ: {pn} naruto 10",
      en: "{pn} <keyword> [amount]\nExample: {pn} naruto 10"
    }
  },

  langs: {
    vi: {
      usage: "📌 Cách dùng: {pn} <từ khóa> [số lượng]\nVí dụ: {pn} naruto 50",
      searching: "🔍 Đang tìm kiếm '%1'\nVui lòng chờ... (Số lượng: %2)",
      noImages: "❌ Không tìm thấy hình ảnh cho '%1'.",
      foundImages: "📷 Đây là %1 hình ảnh cho '%2':",
      imageLink: "🔗 Link ảnh: %1",
      serverError: "❌ Lỗi server. Vui lòng thử lại."
    },
    en: {
      usage: "📌 Usage: {pn} <keyword> [amount]\nExample: {pn} naruto 50",
      searching: "🔍 Searching for '%1'\nPlease wait... (Amount: %2)",
      noImages: "❌ No images found for '%1'.",
      foundImages: "📷 Here are %1 images for '%2':",
      imageLink: "🔗 Image Link: %1",
      serverError: "❌ Server Error. Try Again."
    }
  },

  onStart: async function ({ api, args, event, utils, getLang, prefix }) {
    const threadID = event.threadID;

    try {
      if (!args || args.length === 0) {
        return api.sendMessage(
          getLang("usage").replace("{pn}", prefix + this.config.name),
          threadID
        );
      }

      let limit = 6;
      let query = args.join(' ');
      const lastArg = args[args.length - 1];
      const parsed = parseInt(lastArg, 10);

      if (!isNaN(parsed) && args.length > 1) {
        limit = parsed;  
        query = args.slice(0, -1).join(' ');
      }

      const apiBase = 'https://arafat-pinterest-api.vercel.app/pinterest';
      const url = `${apiBase}?search=${encodeURIComponent(query)}&limit=${limit}`;

      const loadingMsg = await api.sendMessage(
        getLang("searching", query, limit),
        threadID
      );

      const resp = await axios.get(url, { timeout: 15000 });
      const respData = resp.data;

      let images = [];

      if (Array.isArray(respData)) images = respData.filter(u => typeof u === 'string');
      else if (respData && Array.isArray(respData.data)) images = respData.data.filter(u => typeof u === 'string');
      else if (respData && Array.isArray(respData.results)) images = respData.results.filter(u => typeof u === 'string');

      if (!images || images.length === 0) {
        try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
        return api.sendMessage(getLang("noImages", query), threadID);
      }

      const sendLimit = Math.min(limit, images.length);
      const batches = [];

      for (let i = 0; i < sendLimit; i += 5) {
        batches.push(images.slice(i, i + 5));
      }

      for (const batch of batches) {
        const attachments = [];

        for (const imgUrl of batch) {
          try {
            if (utils && typeof utils.getStreamFromURL === 'function') {
              attachments.push(await utils.getStreamFromURL(imgUrl));
            } else {
              attachments.push(imgUrl);
            }
          } catch {
            attachments.push(null);
          }
        }

        try {
          const valid = attachments.filter(a => !!a);

          if (valid.length > 0) {
            await api.sendMessage(
              { body: getLang("foundImages", valid.length, query), attachment: valid },
              threadID
            );
          }

          const failed = batch.filter((_, i) => !attachments[i]);
          for (const urlFail of failed) {
            await api.sendMessage(getLang("imageLink", urlFail), threadID);
          }

        } catch {
          for (const imgUrl of batch) {
            await api.sendMessage(getLang("imageLink", imgUrl), threadID);
          }
        }
      }

      try { await api.unsendMessage(loadingMsg.messageID); } catch {}

    } catch (error) {
      console.error('Pinterest Error:', error);
      try {
        if (event && event.threadID) {
          await api.sendMessage(getLang("serverError"), event.threadID);
        }
      } catch {}
    }
  }
};
