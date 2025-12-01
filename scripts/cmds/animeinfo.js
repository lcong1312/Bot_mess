const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "animeinfo",
    aliases: ["aniinfo"],
    version: "1.0",
    category: "anime",
    description: {
      vi: "Lấy thông tin anime",
      en: "Anime info fetcher"
    },
    cooldown: 5,
    author: "MahMUD | Viết Công",
    guide: {
      vi: "{pn} <tên anime>",
      en: "{pn} <anime name>"
    }
  },

  langs: {
    vi: {
      missingName: "⚠️ Vui lòng nhập tên anime",
      notFound: "❌ Không tìm thấy",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      missingName: "⚠️ Please enter an anime name",
      notFound: "❌ Not found",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, args, getLang }) {
    if (!args[0]) return api.sendMessage(getLang("missingName"), event.threadID, event.messageID);

    try {
      const url = `${await mahmud()}/api/animeinfo?animeName=${encodeURIComponent(args.join(" "))}`;
      const res = await axios.get(url);
      const { formatted_message, data } = res.data;

      if (!res.data || !data) return api.sendMessage(getLang("notFound"), event.threadID, event.messageID);

      api.sendMessage({
        body: formatted_message,
        attachment: await global.utils.getStreamFromURL(data.image_url)
      }, event.threadID, event.messageID);

    } catch (e) {
      console.error(e);
      api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  }
};
