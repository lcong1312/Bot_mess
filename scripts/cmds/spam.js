if (!global.temp.spamList)
  global.temp.spamList = {};

module.exports = {
  config: {
    name: "spam",
    version: "1.0",
    author: "Viết Công",
    countDown: 1,
    role: {
      onStart: 2,
      onChat: 0
    },
    description: {
      vi: "Spam reply tin nhắn của người được tag",
      en: "Spam reply messages of tagged user"
    },
    category: "fun",
    guide: {
      vi: "{pn} -n @tag : Bật spam\n{pn} -r @tag : Xóa khỏi danh sách\n{pn} -list : Xem danh sách",
      en: "{pn} -n @tag : Enable spam\n{pn} -r @tag : Remove from list\n{pn} -list : View list"
    }
  },

  onStart: async function ({ event, args, message, usersData }) {
    const { threadID, mentions } = event;
    
    if (!global.temp.spamList[threadID])
      global.temp.spamList[threadID] = {};

    const option = args[0];

    if (option === "-list") {
      const list = global.temp.spamList[threadID];
      const uids = Object.keys(list);
      
      if (uids.length === 0)
        return message.reply("📋 Không có ai trong danh sách spam.");
      
      let msg = "📋 Danh sách đang bị spam:\n";
      for (const uid of uids) {
        const name = await usersData.getName(uid);
        msg += "• " + name + " (" + uid + ")\n";
      }
      return message.reply(msg);
    }

    if (option === "-r") {
      const mentionIds = Object.keys(mentions);
      
      if (mentionIds.length === 0)
        return message.reply("⚠️ Vui lòng tag người muốn xóa.");
      
      let removed = [];
      for (const uid of mentionIds) {
        if (global.temp.spamList[threadID][uid]) {
          delete global.temp.spamList[threadID][uid];
          removed.push(uid);
        }
      }
      
      if (removed.length === 0)
        return message.reply("⚠️ Người được tag không có trong danh sách.");
      
      return message.reply("✅ Đã xóa khỏi danh sách spam.");
    }

    if (option === "-n") {
      const mentionIds = Object.keys(mentions);
      
      if (mentionIds.length === 0)
        return message.reply("⚠️ Vui lòng tag người muốn spam.");
      
      for (const uid of mentionIds) {
        global.temp.spamList[threadID][uid] = true;
      }
      
      return message.reply("✅ Đã bật spam reply. Mỗi khi họ nhắn tin sẽ bị reply lại.");
    }

    return message.reply("📖 Cách dùng:\n• /spam -n @tag : Bật spam\n• /spam -r @tag : Xóa khỏi danh sách\n• /spam -list : Xem danh sách");
  },

  onChat: async function ({ api, event }) {
    const { threadID, senderID, body, messageID } = event;
    
    if (!global.temp.spamList[threadID]) return;
    if (!global.temp.spamList[threadID][senderID]) return;
    
    if (body && body.trim()) {
      const replies = [
        "Bị ngu à",
        "Đần thế",
        "Gosu óc",
        "Có trình không ?"
        // body + " " + body,
        // body + "???",
        // "Ê, " + body + " là sao? 😂",
        // "Lại " + body + " nữa à 😜"
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, threadID, () => {}, messageID);
    }
  }
};
