module.exports = {
  config: {
    name: "gosu",
    version: "1.0",
    author: "Viết Công",
    countDown: 0,
    role: 0,
    description: {
      vi: "Tự động reply khi chat gosu/goso",
      en: "Auto reply when chat gosu/goso"
    },
    category: "fun",
    guide: {
      vi: "Tự động kích hoạt khi chat gosu hoặc goso",
      en: "Auto trigger when chat gosu or goso"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {
    const body = event.body ? event.body.toLowerCase().trim() : "";
    
    if (body.includes("gosu") || body.includes("su")) {
      const replies = [
        "Gosu bị ngu 🤣",
        "Gosu bị đần 😂",
        "Gosu ngu vãi 🤪",
        "Gosu đần quá trời 😜",
        "Ai gọi Gosu ngu kìa 🤭",
        "Gosu = Ngu + Đần 🧠❌",
        "Gosu IQ âm 🤡"
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      return api.sendMessage(randomReply, event.threadID, event.messageID);
    }
  }
};
