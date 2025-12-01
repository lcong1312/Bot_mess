const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "footballgame",
    aliases: ["football"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Đoán tên cầu thủ bóng đá",
      en: "Guess football player name"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      guessPlayer: "Một cầu thủ bóng đá nổi tiếng đã xuất hiện! Hãy đoán tên của họ.",
      notYourQuiz: "🐸 Đây không phải câu hỏi của bạn!",
      correct: "✅ | Chính xác!\nBạn nhận được %1 xu và %2 exp.",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      guessPlayer: "A famous footballer has appeared! Guess their name.",
      notYourQuiz: "🐸 This is not your quiz!",
      correct: "✅ | Correct answer!\nYou have earned %1 coins and %2 exp.",
      wrong: "❌ | Wrong answer!\nCorrect answer was: %1",
      error: "🥹 Error occurred, please try again."
    }
  },

  onReply: async function ({ api, event, Reply, usersData, getLang }) {
    const { footballNames, author, messageID } = Reply;
    const getCoin = 500;
    const getExp = 121;

    if (event.senderID !== author) {
      return api.sendMessage(getLang("notYourQuiz"), event.threadID, event.messageID);
    }

    const reply = event.body.trim().toLowerCase();
    const isCorrect = footballNames.some(name => name.toLowerCase() === reply);
    const userData = await usersData.get(event.senderID);

    await api.unsendMessage(messageID);

    if (isCorrect) {
      try {
        await usersData.set(event.senderID, {
          money: userData.money + getCoin,
          exp: userData.exp + getExp
        });

        return api.sendMessage(
          getLang("correct", getCoin, getExp),
          event.threadID,
          event.messageID
        );
      } catch (err) {
        console.log("Error:", err.message);
      }
    } else {
      return api.sendMessage(
        getLang("wrong", footballNames.join(" / ")),
        event.threadID,
        event.messageID
      );
    }
  },

  onStart: async function ({ api, event, usersData, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }

    try {
      const { senderID } = event;
      const userData = await usersData.get(senderID);

      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/api/football`);
      const { name, imgurLink } = response.data.football;
      const footballNames = Array.isArray(name) ? name : [name];

      const imageStream = await axios({
        url: imgurLink,
        method: "GET",
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      api.sendMessage(
        {
          body: getLang("guessPlayer"),
          attachment: imageStream.data
        },
        event.threadID,
        (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: senderID,
            footballNames
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
