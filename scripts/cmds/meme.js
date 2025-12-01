const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "meme",
    aliases: ["memes"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "fun",
    description: {
      vi: "Lấy meme ngẫu nhiên",
      en: "Get random meme"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      fetchError: "Không thể lấy meme. Vui lòng thử lại sau.",
      hereMeme: "🐸 | Đây là meme ngẫu nhiên của bạn",
      error: "Đã xảy ra lỗi khi lấy meme."
    },
    en: {
      fetchError: "Could not fetch meme. Please try again later.",
      hereMeme: "🐸 | Here's your random meme",
      error: "An error occurred while fetching meme."
    }
  },

  onStart: async function ({ message, event, api, getLang }) {
    try {
      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/meme`);
      const imageUrl = res.data?.imageUrl;

      if (!imageUrl) {
        return message.reply(getLang("fetchError"));
      }

      const stream = await axios({
        method: "GET",
        url: imageUrl,
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      await api.sendMessage({
        body: getLang("hereMeme"),
        attachment: stream.data
      }, event.threadID, event.messageID);

      return;
    } catch (error) {
      return message.reply(getLang("error"));
    }
  }
};
