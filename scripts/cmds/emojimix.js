const axios = require("axios");
 
const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mix"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    description: {
      vi: "Kết hợp 2 emoji thành 1",
      en: "Mix 2 emojis into 1"
    },
    guide: {
      vi: "{pn} <emoji1> <emoji2>\nVí dụ: {pn} 🙂 😘",
      en: "{pn} <emoji1> <emoji2>\nExample: {pn} 🙂 😘"
    },
    category: "fun"
  },

  langs: {
    vi: {
      error: "Xin lỗi, emoji %1 và %2 không thể kết hợp.",
      success: "Emoji %1 và %2 đã kết hợp thành công!"
    },
    en: {
      error: "Sorry, emoji %1 and %2 can't be mixed.",
      success: "Emoji %1 and %2 mixed successfully!"
    }
  },

  onStart: async function ({ message, args, getLang }) {
    const [emoji1, emoji2] = args;

    if (!emoji1 || !emoji2) return message.SyntaxError();

    const image = await generateEmojimix(emoji1, emoji2);
    if (!image) return message.reply(getLang("error", emoji1, emoji2));

    return message.reply({
    body: getLang("success", emoji1, emoji2),
    attachment: image
      });
     }
   };

async function generateEmojimix(emoji1, emoji2) {
   try {
    const apiUrl = `${await baseApiUrl()}/api/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
    const response = await axios.get(apiUrl, {
    headers: { "Author": module.exports.config.author },
    responseType: "stream"
    });

    if (response.data.error) {
      return null; 
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch emojimix:", error.message);
    return null;
  }
}
