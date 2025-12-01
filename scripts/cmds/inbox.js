module.exports = {
  config: {
    name: "inbox",
    aliases: ["in"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 5,
    role: 0,
    description: {
      vi: "Gửi tin nhắn riêng cho bạn",
      en: "Send private message to you"
    },
    category: "system"
  },

  langs: {
    vi: {
      checkInbox: "📬 Hãy kiểm tra tin nhắn riêng của bạn nhé!",
      hiMessage: "👋 Xin chào! Bot đã gửi tin nhắn cho bạn."
    },
    en: {
      checkInbox: "📬 Please check your inbox!",
      hiMessage: "👋 Hello! Bot has sent you a message."
    }
  },

  onStart: async function({ api, event, args, message, getLang }) {
    try {
      const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
      if (this.config.author !== obfuscatedAuthor) {
        return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
      }

      const query = encodeURIComponent(args.join(' '));
      message.reply(getLang("checkInbox"));
      api.sendMessage(getLang("hiMessage"), event.senderID);
    } catch (error) {
      console.error("Lỗi: " + error);
    }
  }
};
