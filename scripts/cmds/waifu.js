const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};module.exports = {
  config: {
    name: "waifugame",
    aliases: ["waifu"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Đoán tên waifu",
      en: "Guess waifu name"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      guessWaifu: "Một waifu ngẫu nhiên đã xuất hiện! Hãy đoán tên waifu.",
      notYourQuiz: "🐸 Đây không phải câu hỏi của bạn!",
      correct: "✅ | Chính xác!\nBạn nhận được %1 xu và %2 exp.",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      guessWaifu: "A random waifu has appeared! Guess the waifu name.",
      notYourQuiz: "🐸 This is not your quiz!",
      correct: "✅ | Correct answer!\nYou have earned %1 coins and %2 exp.",
      wrong: "❌ | Wrong answer!\nCorrect answer was: %1",
      error: "🥹 Error occurred, please try again."
    }
  },

  onReply: async function ({ api, event, Reply, usersData, getLang }) {const { waifu, author, messageID } = Reply;
    const getCoin = 500;
    const getExp = 121;

    if (event.senderID !== author) {
      return api.sendMessage(getLang("notYourQuiz"), event.threadID, event.messageID);
    }

    const reply = event.body.toLowerCase();
    const userData = await usersData.get(event.senderID);

    if (reply === waifu.toLowerCase()) {
      await api.unsendMessage(messageID);
      await usersData.set(event.senderID, {
        money: userData.money + getCoin,
        exp: userData.exp + getExp
      });
      return api.sendMessage(getLang("correct", getCoin, getExp), event.threadID, event.messageID);
    } else {
      await api.unsendMessage(messageID);
      return api.sendMessage(getLang("wrong", waifu), event.threadID, event.messageID);
    }
  },

  onStart: async function ({ api, event, getLang }) {try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/api/waifu`);
      const { name, imgurLink } = response.data.waifu;

      const imageStream = await axios({
        url: imgurLink,
        method: "GET",
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      api.sendMessage(
        {
          body: getLang("guessWaifu"),
          attachment: imageStream.data
        },
        event.threadID,
        (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            waifu: name
          });

          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 40000);
        },
        event.messageID
      );
    } catch (error) {
      console.error("Error:", error.message);
      api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  }
};
