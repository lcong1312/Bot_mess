const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    countDown: 10,
    role: 0,
    category: "game",
    description: {
      vi: "Trò chơi đố vui",
      en: "Quiz game"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      noQuiz: "❌ Không có câu hỏi nào cho danh mục này.",
      replyAnswer: "Phản hồi với câu trả lời của bạn.",
      notYourQuiz: "🐸 Đây không phải câu hỏi của bạn!",
      correct: "✅ | Chính xác!\nBạn nhận được %1 xu & %2 exp.",
      wrong: "❌ | Sai rồi!\nĐáp án đúng là: %1",
      error: "🥹 Đã xảy ra lỗi, vui lòng thử lại."
    },
    en: {
      noQuiz: "❌ No quiz available for this category.",
      replyAnswer: "Reply with your answer.",
      notYourQuiz: "🐸 This is not your quiz!",
      correct: "✅ | Correct answer!\nYou earned %1 coins & %2 exp.",
      wrong: "❌ | Wrong answer!\nThe correct answer was: %1",
      error: "🥹 Error occurred, please try again."
    }
  },

  onStart: async function ({ api, event, usersData, args, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }
    
    try {
      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`);
      const quiz = res.data;

      if (!quiz) {
        return api.sendMessage(getLang("noQuiz"), event.threadID, event.messageID);
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n${getLang("replyAnswer")}`,
      };

      api.sendMessage(quizMsg, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 40000);
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(getLang("error"), event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData, getLang }) {
    const { correctAnswer, author } = Reply;
    if (event.senderID !== author) return api.sendMessage(getLang("notYourQuiz"), event.threadID, event.messageID);

    await api.unsendMessage(Reply.messageID);
    const userReply = event.body.trim().toLowerCase();

    if (userReply === correctAnswer.toLowerCase()) {
      const rewardCoins = 500;
      const rewardExp = 121;
      const userData = await usersData.get(author);
      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data
      });
      api.sendMessage(getLang("correct", rewardCoins, rewardExp), event.threadID, event.messageID);
    } else {
      api.sendMessage(getLang("wrong", correctAnswer), event.threadID, event.messageID);
    }
  }
};
