const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "cat",
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "image",
    description: {
      vi: "Lấy hình ảnh mèo ngẫu nhiên",
      en: "Get random cat images"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      noImages: "Không tìm thấy hình ảnh mèo từ API.",
      hereCat: "🐱 | Đây là hình ảnh mèo ngẫu nhiên của bạn",
      error: "Đã xảy ra lỗi khi lấy hình ảnh mèo."
    },
    en: {
      noImages: "No cat images found from API.",
      hereCat: "🐱 | Here's your random cat images",
      error: "An error occurred while fetching cat images."
    }
  },

  onStart: async function ({ message, event, api, getLang }) {
    try {
      const apiUrl = await baseApiUrl();
      const res = await axios.get(`${apiUrl}/api/catimg/random-cats`);
      const images = res.data?.images;
      
      if (!images || images.length === 0) 
        return message.reply(getLang("noImages"));

      const attachments = await Promise.all(images.map(url => getStreamFromURL(url)));
      
      await api.sendMessage({
        body: getLang("hereCat"),
        attachment: attachments
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }

    async function getStreamFromURL(url) {
      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      return response.data;
    }
  }
};
