if (!global.temp.spamList)
  global.temp.spamList = {};

module.exports = {
  config: {
    name: "spam",
    version: "1.1",
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

  onLoad: async function ({ globalData }) {
    // Load danh sách spam từ database khi bot khởi động
    const spamData = await globalData.get("spamList", "data", {});
    global.temp.spamList = spamData;
  },

  onStart: async function ({ event, args, message, usersData, globalData }) {
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
      
      // Lưu vào database
      await globalData.set("spamList", global.temp.spamList, "data");
      return message.reply("✅ Đã xóa khỏi danh sách spam.");
    }

    if (option === "-n") {
      const mentionIds = Object.keys(mentions);
      
      if (mentionIds.length === 0)
        return message.reply("⚠️ Vui lòng tag người muốn spam.");
      
      for (const uid of mentionIds) {
        global.temp.spamList[threadID][uid] = true;
      }
      
      // Lưu vào database
      await globalData.set("spamList", global.temp.spamList, "data");
      return message.reply("✅ Đã bật spam reply. Mỗi khi họ nhắn tin sẽ bị reply lại.");
    }

    return message.reply("📖 Cách dùng:\n• /spam -n @tag : Bật spam\n• /spam -r @tag : Xóa khỏi danh sách\n• /spam -list : Xem danh sách");
  },

  onChat: async function ({ api, event }) {
    const { threadID, senderID, body, messageID } = event;
    
    if (!global.temp.spamList[threadID]) return;
    if (!global.temp.spamList[threadID][senderID]) return;
    
    if (body && body.trim()) {
      const lowerBody = body.toLowerCase().trim();
      // Check nếu nhắn "Công", "Cong"
      if (lowerBody === "công" || lowerBody === "cong") {
        return api.sendMessage("vip pro 😎", threadID, () => {}, messageID);
      }
      if (lowerBody === "đức" || lowerBody === "duc" || lowerBody === "gosu" || lowerBody === "nguyễn minh đức" || lowerBody === "nguyen minh duc") {
        const chuiDuc = [
          "Đức ngu vl",
          "Gosu óc chó",
          "Đức đần thế",
          "Đức ngu như bò"
        ];
        const randomChui = chuiDuc[Math.floor(Math.random() * chuiDuc.length)];
        return api.sendMessage(randomChui, threadID, () => {}, messageID);
      }
      const replies = [
          "Đức ngu vl",
          "Gosu óc chó",
          "Đức đần thế",
          "Nguyễn Minh Đức ngu như bò",
          "Gosu não cá vàng",
          "Đức vô dụng vl",
          "Gosu thằng rác",
          "Đức mày ngu lắm",
          "Gosu đồ khùng",
          "Nguyễn Minh Đức thằng ngu",
          "Đức câm mẹ m đi",
          "Gosu biến đi",
          "Đức đồ ngu",
          "Gosu ngu vcl"
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, threadID, () => {}, messageID);
    }
  }
};
