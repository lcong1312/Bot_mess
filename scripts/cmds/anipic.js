const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "anipic",
    aliases: ["animepic"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    category: "anime",
    description: {
      vi: "Lấy ảnh anime theo danh mục",
      en: "Get anime picture by category"
    },
    guide: {
      vi: "{pn} <danh mục>",
      en: "{pn} <category>"
    }
  },

  langs: {
    vi: {
      selectCategory: "Vui lòng chọn một danh mục:\n• %1",
      invalidCategory: "Danh mục không hợp lệ! Chọn một trong:\n%1",
      hereImage: "Đây là ảnh %1 của bạn 😘",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      selectCategory: "Please select a category:\n• %1",
      invalidCategory: "Invalid category! Choose one from:\n%1",
      hereImage: "Here's your %1 image 😘",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ event, args, api, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage(
        "Bạn không được phép thay đổi tên tác giả.",
        event.threadID,
        event.messageID
      );
    }

    const categories = ["gojo", "naruto", "goku", "luffy", "itachi", "madara", "ichigo", "aizen"];

    if (!args[0]) {
      return api.sendMessage(
        getLang("selectCategory", categories.join("\n• ")),
        event.threadID,
        event.messageID
      );
    }

    const category = args[0].toLowerCase();
    if (!categories.includes(category)) {
      return api.sendMessage(
        getLang("invalidCategory", categories.join(", ")),
        event.threadID,
        event.messageID
      );
    }

    try {
      const baseURL = await mahmud();

      const imageStream = await axios({
        method: "GET",
        url: `${baseURL}/api/anipic?category=${category}`,
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      api.sendMessage(
        { body: getLang("hereImage", category), attachment: imageStream.data },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      api.sendMessage(
        getLang("error"),
        event.threadID,
        event.messageID
      );
    }
  }
};
