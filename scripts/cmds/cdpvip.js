const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "cdpvip",
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    category: "media",
    description: {
      vi: "Lấy ảnh đôi VIP theo danh mục",
      en: "Get VIP couple DP by category"
    },
    guide: {
      vi: "{pn} <danh mục>\n{pn} list",
      en: "{pn} <category>\n{pn} list"
    }
  },

  langs: {
    vi: {
      usage: "⚠ Cách dùng:\n{pn} <danh mục>\n{pn} list",
      noCategories: "⚠ Không tìm thấy danh mục.",
      availableCategories: "🎀 Các danh mục có sẵn:\n",
      categoryNotFound: "🥹 Không tìm thấy danh mục. Các danh mục có sẵn:\n",
      noDPFound: "⚠ Không tìm thấy ảnh đôi trong danh mục \"%1\".",
      allFailed: "❌ Tất cả URL ảnh đều không tải được.",
      hereCDP: "Đây là ảnh đôi %1 ngẫu nhiên của bạn 😘",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      usage: "⚠ Usage:\n{pn} <category>\n{pn} list",
      noCategories: "⚠ No categories found.",
      availableCategories: "🎀 Available categories:\n",
      categoryNotFound: "🥹 Category not found. Available categories:\n",
      noDPFound: "⚠ No DP found in \"%1\" category.",
      allFailed: "❌ All image URLs failed to load.",
      hereCDP: "Here's your random %1 couple DP 😘",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ message, args, event, api, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }
    
    if (!args.length)
      return message.reply(getLang("usage"));

    const command = args[0].toLowerCase();

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

      if (command === "list") {
        const res = await axios.get(`${baseUrl}/list`);
        const summary = res.data?.summary || {};

        if (!Object.keys(summary).length)
          return message.reply(getLang("noCategories"));

        let msg = getLang("availableCategories");
        for (const [cat, count] of Object.entries(summary)) {
          msg += `- ${cat}\n`;
        }
        return message.reply(msg);
      }

      const listRes = await axios.get(`${baseUrl}/list`);
      const availableCategories = Object.keys(listRes.data?.summary || {});

      if (!availableCategories.includes(command)) {
        let msg = getLang("categoryNotFound");
        availableCategories.forEach((cat) => (msg += `- ${cat}\n`));
        return message.reply(msg);
      }

      const res = await axios.get(`${baseUrl}?category=${command}`);
      const groupImages = res.data?.group || [];

      if (!groupImages.length)
        return message.reply(getLang("noDPFound", command));

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
        body: getLang("hereCDP", command),
        attachment: streamAttachments
      });

    } catch (err) {
      console.error("Full error:", err.response?.data || err.message);
      return message.reply(getLang("error"));
    }
  }
};
