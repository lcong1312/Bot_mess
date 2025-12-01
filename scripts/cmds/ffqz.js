const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "freefire",
    aliases: ["ffqz", "ffgame", "ffquiz", "ff"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Đoán tên nhân vật Free Fire",
      en: "Guess Free Fire character name"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      guessCharacter: "Một nhân vật Free Fire ngẫu nhiên đã xuất hiện! Hãy đoán tên nhân vật.",
      correct: "✅ | Chính xác!\nBạn nhận được %1 xu và %2 exp.",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      guessCharacter: "A random Free Fire character has appeared! Guess the character name.",
      correct: "✅ | Correct answer!\nYou have earned %1 coins and %2 exp.",
      wrong: "❌ | Wrong answer!\nThe correct answer was: %1",
      error: "🥹 Error occurred, please try again."
    }
  },

  onReply: async function ({ api, event, Reply, usersData, getLang }) {
    const { character, author } = Reply;
    const getCoin = 500;
    const getExp = 121;
    const userData = await usersData.get(event.senderID);

    if (event.senderID !== author) return;

    const reply = event.body.toLowerCase();
    if (reply === character.toLowerCase()) {
      await api.unsendMessage(Reply.messageID);
      userData.money += getCoin;
      userData.exp += getExp;
      await usersData.set(event.senderID, userData);
      api.sendMessage(
        getLang("correct", getCoin, getExp),
        event.threadID,
        event.messageID
      );
    } else {
      await api.unsendMessage(Reply.messageID);
      api.sendMessage(
        getLang("wrong", character),
        event.threadID,
        event.messageID
      );
    }
  },

  onStart: async function ({ api, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    try {
      const apiUrl = await baseApiUrl();
      const apiRes = await axios.get(`${apiUrl}/api/freefire`);
      const randomCharacter = apiRes.data?.freefire;

      if (
        !randomCharacter ||
        !randomCharacter.name ||
        !randomCharacter.imgurLink ||
        !/^https?:\/\//.test(randomCharacter.imgurLink)
      )
        return;

      const imageStream = await axios({
        url: randomCharacter.imgurLink,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      api.sendMessage(
        {
          body: getLang("guessCharacter"),
          attachment: imageStream.data
        },
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: senderID,
            character: randomCharacter.name
          });

          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, 40000);
        },
        event.messageID
      );
    } catch (error) {
      api.sendMessage(
        getLang("error"),
        event.threadID,
        event.messageID
      );
    }
  }
};
