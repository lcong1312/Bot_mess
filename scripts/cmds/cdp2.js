const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "copuledp2",
    aliases: ["cdp2"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    description: {
      vi: "Lấy ảnh đôi ngẫu nhiên",
      en: "Fetch a random couple DP"
    },
    category: "image",
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      fetchError: "Không thể lấy ảnh đôi. Vui lòng thử lại sau.",
      hereCDP: "Đây là ảnh đôi của bạn 😘",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      fetchError: "Couldn't fetch couple DP. Try again later.",
      hereCDP: "Here is your couple DP 😘",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ message, event, api, getLang }) {try {
      const response = await axios.get(`${await baseApiUrl()}/api/cdp2`, {
        headers: { "author": module.exports.config.author }
      });

      if (response.data.error)
        return message.reply(response.data.error);

      const { male, female } = response.data;
      if (!male || !female)
        return message.reply(getLang("fetchError"));

      const attachments = [
        await global.utils.getStreamFromURL(male),
        await global.utils.getStreamFromURL(female)
      ];

      await message.reply({
        body: getLang("hereCDP"),
        attachment: attachments
      });

    } catch (error) {
      console.error("CDP Fetch Error:", error);
      message.reply(getLang("error"));
    }
  }
};
