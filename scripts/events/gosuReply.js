module.exports = {
  config: {
    name: "gosuReply",
    version: "1.0",
    author: "Viết Công",
    category: "events",
    description: {
      vi: "Tự động reply khi chat gosu",
      en: "Auto reply when chat gosu/goso"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
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
