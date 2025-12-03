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
    
    if (!body || !body.trim()) return;
    
    const lowerBody = body.toLowerCase().trim();
    
    // Ai chat "Đức", "Gosu", "Nguyễn Minh Đức" đều bị chửi (không cần trong danh sách spam)
    if (lowerBody === "đức" || lowerBody === "duc" || lowerBody === "gosu" || lowerBody === "nguyễn minh đức" || lowerBody === "nguyen minh duc") {
      const chuiDuc = [
        "Đức ngu vl",
        "Gosu óc chó",
        "Đức đần thế",
        "Nguyễn Minh Đức ngu như bò",
        "Gosu não cá vàng",
        "Đức vô dụng vl",
        "Gosu thằng rác",
        "Gosu ngu vcl"
      ];
      const randomChui = chuiDuc[Math.floor(Math.random() * chuiDuc.length)];
      return api.sendMessage(randomChui, threadID, () => {}, messageID);
    }
    
    // Phần dưới chỉ áp dụng cho người trong danh sách spam
    if (!global.temp.spamList[threadID]) return;
    if (!global.temp.spamList[threadID][senderID]) return;
    
    // Check nếu nhắn "Công", "Cong"
    if (lowerBody === "công" || lowerBody === "cong") {
      return api.sendMessage("vip pro 😎", threadID, () => {}, messageID);
    }
    
    const replies = [
      // Chế giễu
      "Bị ngu à",
      "Đần thế",
      "Gosu óc",
      "Có trình không ?",
      "Nói gì vậy trời 😂",
      "Ủa rồi sao",
      "Thế à, rồi sao nữa?",
      "Nói như đúng rồi ấy",
      "Ai hỏi ý kiến m chưa?",
      "Tự nhiên nói",
      "Ê ê, ai cho phép nói đấy",
      "Nói ít thôi bạn ơi",
      "Lại bạn à, mệt ghê",
      "Spam gì nữa đây",
      "Nói hoài không chán hả",
      "Bớt nói đi nào",
      "Im đi cho người ta nhờ",
      "Nói nhiều quá trời",
      "Lại m nữa hả 🙄",
      "Chưa đủ drama à",
      "Ơ kìa, lại xuất hiện",
      "Ai kêu m nói đâu",
      "Nói gì mà nói hoài vậy",
      "Thôi đi bạn ơi",
      "Mệt với bạn quá",
      "Lại bạn, lại bạn",
      "Nói xong chưa?",
      "Còn gì nữa không?",
      "Hết chưa đấy?",
      "Xong chưa bạn ơi",
      // Chửi
      "Đ** mẹ m",
      "Cút đi",
      "Ngu vl",
      "Óc chó",
      "Đồ ngu",
      "Ngu như bò",
      "Não cá vàng à",
      "Đần độn vl",
      "Thằng ngu",
      "Con ngu",
      "Câm mẹ m đi",
      "Im mẹ m đi",
      "Biến đi",
      "Ngu vcl",
      "Đ** má",
      "Thằng khùng",
      "Con điên",
      "Ngu như lợn",
      "Óc bã đậu",
      "Não tôm à",
      "Đồ rác",
      "Thằng rác",
      "Vô dụng vl",
      "Đồ vô dụng",
      "Ngu thấy mẹ",
      "Ngu thấy bà",
      "Đ** mày",
      "Cái l** m",
      "Thằng chó",
      "Con chó",
      "Mày ngu lắm",
      "Ngu quá trời",
      "Đồ khùng",
      "Thằng điên",
      "Mày bị ngu à",
      "Ngu như con c**",
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(randomReply, threadID, () => {}, messageID);
  }
};
