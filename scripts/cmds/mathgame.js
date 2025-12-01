const axios = require("axios");

const getBaseApi = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "mathgame",
    aliases: ["math"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    role: 0,
    category: "game",
    description: {
      vi: "Trò chơi toán học",
      en: "Math game"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      noQuiz: "❌ Không tìm thấy câu hỏi hợp lệ từ API.",
      replyAnswer: "Phản hồi với câu trả lời của bạn.",
      notYourQuiz: "❌ Đây không phải câu hỏi toán của bạn!",
      alreadyAnswered: "❌ Bạn đã trả lời câu hỏi này rồi!",
      correct: "✅ | Chính xác!\nBạn nhận được +%1 xu & +%2 exp!",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noQuiz: "❌ No valid quiz found from API.",
      replyAnswer: "Reply with your answer.",
      notYourQuiz: "❌ This isn't your math quiz!",
      alreadyAnswered: "❌ You've already answered this quiz!",
      correct: "✅ | Correct answer!\nYou earned +%1 coins & +%2 exp!",
      wrong: "❌ | Wrong answer!\nThe correct answer was: %1",
      error: "Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, usersData, getLang }) {const { senderID, threadID, messageID } = event;

    let quiz;
    try {
      const apiUrl = await getBaseApi();
      const res = await axios.get(`${apiUrl}/api/math`);
      const apiData = res.data;
      quiz = apiData?.data || apiData;

      if (!quiz || !quiz.question || !quiz.options || !quiz.correctAnswer) {
        return api.sendMessage(getLang("noQuiz"), threadID, messageID);
      }
    } catch (err) {
      return api.sendMessage(getLang("error"), threadID, messageID);
    }

    const { question, correctAnswer, options } = quiz;
    const { a, b, c, d } = options;

    const quizMsg = {
      body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n${getLang("replyAnswer")}`
    };

    api.sendMessage(quizMsg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        type: "mathquiz",
        commandName: "mathgame",
        author: senderID,
        messageID: info.messageID,
        correctAnswer,
        answered: false
      });
    }, messageID);
  },

  onReply: async function ({ event, api, Reply, usersData, getLang }) {
    const { correctAnswer, author } = Reply;

    if (event.senderID !== author)
      return api.sendMessage(getLang("notYourQuiz"), event.threadID, event.messageID);

    if (Reply.answered)
      return api.sendMessage(getLang("alreadyAnswered"), event.threadID, event.messageID);

    Reply.answered = true;

    const reply = event.body.trim().toLowerCase();
    const correctAns = correctAnswer.toLowerCase();

    const userData = await usersData.get(author);
    const rewardCoins = 500;
    const rewardExp = 121;

    await api.unsendMessage(Reply.messageID);
    if (reply === correctAns) {
      userData.money += rewardCoins;
      userData.exp += rewardExp;
      await usersData.set(author, userData);

      return api.sendMessage(
        getLang("correct", rewardCoins, rewardExp),
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage(
        getLang("wrong", correctAnswer),
        event.threadID,
        event.messageID
      );
    }
  }
};
