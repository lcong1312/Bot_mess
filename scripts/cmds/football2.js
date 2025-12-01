const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "football2",
    aliases: ["fball2", "footqz2", "footballqz2"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Trò chơi đố vui bóng đá",
      en: "Football quiz game"
    },
    guide: {
      vi: "{pn} [en/bn]",
      en: "{pn} [en/bn]"
    }
  },

  langs: {
    vi: {
      noQuiz: "❌ Không có câu hỏi nào cho danh mục này.",
      replyAnswer: "Phản hồi với câu trả lời của bạn.",
      notYourQuiz: "⚠️ Đây không phải câu hỏi của bạn! 🐸",
      correct: "✅ | Chính xác!\nBạn nhận được +%1 xu & +%2 exp!",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noQuiz: "❌ No quiz available for this category.",
      replyAnswer: "Reply with your answer.",
      notYourQuiz: "⚠️ This quiz isn't yours! 🐸",
      correct: "✅ | Correct answer!\nYou earned +%1 coins & +%2 exp!",
      wrong: "❌ | Wrong answer!\nThe correct answer was: %1",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, usersData, args, getLang }) {try {
      const input = args[0]?.toLowerCase() || "bn";
      const category = (input === "en" || input === "english") ? "english" : "bangla";

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/football2?category=${category}`);
      const quiz = res.data?.data || res.data;

      if (!quiz || !quiz.question)
        return api.sendMessage(getLang("noQuiz"), event.threadID, event.messageID);

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;

      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n${getLang("replyAnswer")}`
      };

      api.sendMessage(quizMsg, event.threadID, (err, info) => {
        if (err) return;

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "football2",
          author: event.senderID,
          correctAnswer,
          messageID: info.messageID
        });

        setTimeout(() => api.unsendMessage(info.messageID), 40000);
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData, getLang }) {
    const { correctAnswer, author, messageID } = Reply;
    if (event.senderID !== author)
      return api.sendMessage(getLang("notYourQuiz"), event.threadID, event.messageID);

    await api.unsendMessage(messageID);

    const userReply = event.body.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();
    const userData = await usersData.get(author);

    if (userReply === correct || userReply === correct[0]) {
      const rewardCoins = 500, rewardExp = 121;
      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data
      });
      return api.sendMessage(getLang("correct", rewardCoins, rewardExp), event.threadID, event.messageID);
    } else {
      return api.sendMessage(getLang("wrong", correctAnswer), event.threadID, event.messageID);
    }
  }
};
