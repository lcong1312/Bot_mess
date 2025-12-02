const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud
};

module.exports = {
  config: {
    name: "say",
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    category: "media",
    description: {
      vi: "Chuyển văn bản thành giọng nói",
      en: "Convert text to speech"
    },
    guide: {
      vi: "{pn} <văn bản> hoặc reply tin nhắn",
      en: "{pn} <text> or reply to a message"
    }
  },

  onStart: async function ({ api, message, args, event }) {
    let text = args.join(" ");

    if (event.type === "message_reply" && event.messageReply.body) {
      text = event.messageReply.body;
    }

    if (!text) {
      return message.reply("⚠️ Vui lòng nhập văn bản hoặc reply một tin nhắn!");
    }

    try {
      const baseUrl = await baseApiUrl();
      const response = await axios.get(`${baseUrl}/api/say`, {
        params: { text },
        headers: { "Author": module.exports.config.author },
        responseType: "stream",
      });

      if (response.data.error) {
        return message.reply(`${response.data.error}`);
      }

      message.reply({
        body: "",
        attachment: response.data,
      });

    } catch (e) {
      console.error("API Error:", e.response ? e.response.data : e.message);
      message.reply("🥹 Lỗi, liên hệ admin.\n" + (e.response?.data?.error || e.message));
    }
  },
};
