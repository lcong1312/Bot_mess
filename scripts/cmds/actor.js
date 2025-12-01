const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "actor",
    aliases: ["actorgame"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Đoán tên diễn viên",
      en: "Guess actor name"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      guessActor: "Một diễn viên ngẫu nhiên đã xuất hiện! Hãy đoán tên diễn viên.",
      notYourQuestion: "❌ Đây không phải câu hỏi của bạn!",
      correct: "✅ Chính xác!\nBạn nhận được %1 xu & %2 exp.",
      wrong: "🥺 Sai rồi!\nĐáp án đúng: %1",
      sendFailed: "❌ Không thể gửi hình ảnh.",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      guessActor: "A random actor has appeared! Guess the actor name.",
      notYourQuestion: "❌ This is not your question!",
      correct: "✅ Correct answer!\nYou earned %1 coins & %2 exp.",
      wrong: "🥺 Wrong answer!\nCorrect actor: %1",
      sendFailed: "❌ Failed to send image.",
      error: "🥹 Error occurred, please try again."
    }
  },

  onReply: async function ({ api, event, Reply, usersData, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 

    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }

    const { actorNames, author } = Reply;
    const getCoin = 500;
    const getExp = 121;

    const userData = await usersData.get(event.senderID);
    if (event.senderID !== author) {
      return api.sendMessage(getLang("notYourQuestion"), event.threadID, event.messageID);
    }

    const reply = event.body.toLowerCase();
    await api.unsendMessage(Reply.messageID);
    const isCorrect = actorNames.some(name => reply.includes(name.toLowerCase()));
    if (isCorrect) {
      userData.money += getCoin;
      userData.exp += getExp;
      await usersData.set(event.senderID, userData);

      return api.sendMessage(
        getLang("correct", getCoin, getExp),
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage(
        getLang("wrong", actorNames.join(", ")),
        event.threadID,
        event.messageID
      );
    }
  },

  onStart: async function ({ api, event, getLang }) {
    try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/api/actor`);
      const { name, imgurLink } = response.data.actor;

      const actorNames = Array.isArray(name) ? name : [name];
      const imageStream = await axios({
        url: imgurLink,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      api.sendMessage(
        {
          body: getLang("guessActor"),
          attachment: imageStream.data
        },
        event.threadID,
        (err, info) => {
          if (err) return api.sendMessage(getLang("sendFailed"), event.threadID);

          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            actorNames
          });

          setTimeout(() => api.unsendMessage(info.messageID), 40000);
        },
        event.messageID
      );

    } catch (err) {
      console.error("ActorGame Error:", err.message);
      return api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  }
};
