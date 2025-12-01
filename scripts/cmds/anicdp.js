const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "anicdp",
    aliases: ["animecdp"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    category: "media",
    description: {
      vi: "Lấy ảnh đôi anime ngẫu nhiên",
      en: "Get random anime couple DP"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      noDPFound: "⚠ Không tìm thấy ảnh đôi trong danh mục \"anime\".",
      allFailed: "❌ Tất cả URL ảnh đều không tải được.",
      hereCDP: "🎀 Đây là ảnh đôi anime ngẫu nhiên của bạn.",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noDPFound: "⚠ No DP found in \"anime\" category.",
      allFailed: "❌ All image URLs failed to load.",
      hereCDP: "🎀 Here's your random anime couple DP.",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ message, event, api, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }
    try {
      const apiBase = await mahmud();
      const baseUrl = `${apiBase}/api/cdpvip2`;

      const getStream = async (url) => {
        const res = await axios({
          url,
          method: "GET",
          responseType: "stream",
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        return res.data;
      };

      const category = "anime";

      const res = await axios.get(`${baseUrl}?category=${category}`);
      const groupImages = res.data?.group || [];

      if (!groupImages.length)
        return message.reply(getLang("noDPFound"));

      const streamAttachments = [];
      for (const url of groupImages) {
        try {
          const stream = await getStream(url);
          streamAttachments.push(stream);
        } catch {
          console.warn(`⚠ Failed to load image: ${url}`);
        }
      }

      if (!streamAttachments.length)
        return message.reply(getLang("allFailed"));

      return message.reply({
        body: getLang("hereCDP"),
        attachment: streamAttachments
      });

    } catch (err) {
      console.error("Full error:", err.response?.data || err.message);
      return message.reply(getLang("error"));
    }
  }
};
