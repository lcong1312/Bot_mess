const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "cdp",
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    category: "love",
    description: {
      vi: "Lấy ảnh đôi ngẫu nhiên",
      en: "Get random couple DP"
    },
    guide: {
      vi: "{pn} Lấy ảnh đôi ngẫu nhiên\n{pn} list Xem tổng số ảnh đôi",
      en: "{pn} Get a random Couple DP\n{pn} list Show total number of Couple DPs"
    }
  },

  langs: {
    vi: {
      totalCDP: "🎀 Tổng số ảnh đôi: %1",
      noCDP: "⚠ Không tìm thấy ảnh đôi.",
      hereCDP: "🎀 | Đây là ảnh đôi của bạn",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      totalCDP: "🎀 Total Couple DP: %1",
      noCDP: "⚠ No Couple DP found.",
      hereCDP: "🎀 | Here's your couple DP",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ message, args, event, api, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }

    try {
      const baseURL = await mahmud();

      if (args[0] === "list") {
        const res = await axios.get(`${baseURL}/api/cdp/list`);
        const { total } = res.data;
        return message.reply(getLang("totalCDP", total));
      }

      const res = await axios.get(`${baseURL}/api/cdp`);
      const { boy, girl } = res.data;
      if (!boy || !girl) return message.reply(getLang("noCDP"));

      const getStream = async (url) => {
        const response = await axios({
          method: "GET",
          url,
          responseType: "stream",
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        return response.data;
      };

      const attachments = [
        await getStream(boy),
        await getStream(girl)
      ];

      message.reply({
        body: getLang("hereCDP"),
        attachment: attachments
      });

    } catch (error) {
      console.error("CDP command error:", error.message || error);
      message.reply(getLang("error"));
    }
  }
};
