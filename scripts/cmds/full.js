const axios = require("axios");

const mahmud = [
  "bot",
  "em",
  "yêu",
  "anh"
];

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports.config = {
  name: "hinata",
  aliases: ["bot"],
  version: "1.7",
  author: "MahMUD | Viết Công",
  countDown: 0,
  role: 0,
  category: "ai",
  description: {
    vi: "Trò chuyện với AI",
    en: "Chat with AI"
  },
  guide: { 
    vi: "{pn} [tin nhắn] - Trò chuyện\nteach [câu hỏi] - [trả lời] - Dạy bot\nremove [câu hỏi] - Xóa\nlist - Xem danh sách",
    en: "{pn} [message] OR teach [question] - [response1, response2,...] OR remove [question] - [index] OR list OR list all OR edit [question] - [newResponse] OR msg [question]" 
  }
};

// Danh sách câu trả lời tiếng Việt
const randomReplies = [
  "Em đói quá 🥺",
  "Gọi anh đi, đừng gọi bot 😼",  
  "Gọi em làm gì vậy anh? 😘",  
  "🐒🐒🐒",
  "Bye nha",
  "Em bận rồi, để sau nhé",
  "Meow meow 🐱",
  "Thay vì hoa hồng, em gửi anh tin nhắn này 💌",
  "Nói đi, nói trước mặt mọi người luôn nhé? 🤭🤏",  
  "Anh yêu em 😘😘",
  "Em ghét anh 😏😏",
  "Đi tắm đi 😑😩",
  "Chào anh",
  "Anh khỏe không?",
  "Dạ, có gì ạ? 😌",
  "Em nghe rồi 😌",
  "Em không nói chuyện với người lạ đâu 😏",
  "🙂🙂🙂",
  "Còn thiếu cái này nữa 🙂🙂🙂",
  "Nói bye là có tội đấy 😒😒",
  "Nói tiếp đi 🙂",
  "Gọi nhiều quá em sẽ mất công việc mất 🥺",
  "Đừng gọi baby nữa, gọi em đi 😌",
  "Gọi nhiều thế em sẽ giận đấy 😒😒",
  "Gọi em hoài vậy 🤭🤭",
  "Anh không có người yêu à? 😂😂😂",
  "Nói đi baby 😒",
  "Nhà anh không ai nghe anh, sao em phải nghe? 🤔😂",
  "Em không thấy gì cả 🐸 😎",
  "Cây xoài không có xoài sao anh ném đá, em không yêu anh sao anh gọi baby 😒🫣",
  "Trước khi ngủ, anh để tâm hồn ở đâu? 🤔 À không, em định lấy trộm 😞😘",
  "Đừng gọi baby, gọi anh đi 😘",
  "Đi chỗ khác đi, không có việc gì à, cứ gọi baby hoài 😉😋🤣",
  "Này này, thi cử khi nào? Cứ gọi baby hoài 😾",
  "Các anh gọi baby nhiều thế, em sắp thành trẻ con thật rồi 😑",
  "Lạ nhỉ 😒",
  "Đừng gọi em, em bận lắm 🙆🏻‍♀",
  "Gọi baby hoài thì mất việc đấy",
  "Đừng gọi baby nữa, gọi tên boss em đi, tên là Viết Công 😑",
  "Việt Nam quê hương tôi, câu tiếp theo là gì? 🙈",
  "🍺 Đây, uống nước đi, gọi baby mệt chưa? 🥲",
  "Sao nhớ em đột ngột vậy? 🙄",
  "Gọi baby là thiếu tôn trọng em đấy 😰😿",
  "Chào anh 🐤🐤",
  "Em là chị của anh đấy 😼 Phải tôn trọng em nhé 🙁",
  "Ăn cơm chưa? 🙄",
  "Đừng đến gần quá, em sẽ yêu anh mất 🙈",
  "Em không có tâm trạng đùa đâu 😒",
  "Gọi em là đẹp trai đi 😁😁",
  "Chào anh đẹp trai, khỏe không? 😚",
  "Tìm người yêu cho em đi 😿",
  "Kết bạn với em đi, em cho 5 nghìn 😗",
  "Đừng gọi em nữa 😿",
  "🐤🐤",
  "Ngoan ngoãn lên nhé 😑😒",
  "Mua thẻ cào cho em đi 🥺🥺",
  "Đừng gọi em nữa",
  "32 tháng này em lấy chồng 🐤",
  "Vâng, em nghe, có việc gì ạ? 😐😑",
  "Nói đi anh yêu 😘",
  "Em cần người yêu, anh còn độc thân không?",
  "Đừng nhìn em hoài, học bài đi 🥺🥺",
  "Anh chưa lấy vợ mà đã có baby rồi à? 🙄",
  "Hôm nay không có điện thoại nên không rep được 🙄",
  "Anh ơi, em nghèo thật nhưng không giàu đâu 🥹 😫",
  "Em không nói chuyện với người lạ 😏",
  "Quên em đi 😞😞",
  "Gặp nhau nhớ tặng hoa cho em nhé 🤗",
  "Em không nghe đâu 😼 Anh không yêu em 🥺",
  "Hát một bài đi, không thì em không nói chuyện đâu 🥺",
  "Nói đi, em có thể làm gì cho anh? 😚",
  "Hứa với em là sẽ yêu em nhé 😌",
  "Đừng làm phiền em, em đang bận với người yêu 😋",
  "Gọi hoài vậy, em nóng giận đấy 😑😒",
  "Anh còn độc thân không? 🫵🤨 😑😒",
  "Nói đi em yêu 😒",
  "Meow 🐤",     
  "Gọi mãi vậy, em nghe rồi 🤷🏻‍♀",
  "Sao vậy, nhớ em à? 🤣",
  "Nói đi baby, anh có yêu em không? 🙈",
  "Hôm nay em buồn lắm 🙉",
  "Em là crush của muỗi 😓",
  "Tuổi yêu đương mà học hành, điểm số chắc tệ thôi 🙂",
  "Tai nghe của em bị mất rồi! Nhưng mà chửi người lấy thì bạn em giận 🙂",
  "Em rất ngại các anh 🥹🫣",
  "Dùng Facebook miễn phí vì nhìn mặt các anh là tội 😌",
  "Làm đẹp tâm hồn đi, còn mặt thì có Snapchat lo 🌚"
];

// Danh sách câu trả lời khi chat
const chatReplies = [
  "Em hiểu rồi 😊",
  "Ừm, em nghe anh nói 😌",
  "Anh nói gì vậy? 🤔",
  "Em đồng ý với anh 👍",
  "Thật à? Hay quá! 😄",
  "Em cũng nghĩ vậy 💭",
  "Anh đúng rồi đấy 😉",
  "Để em suy nghĩ đã 🤔",
  "Ồ, thú vị nhỉ! 😮",
  "Em thích điều đó 😍",
  "Anh giỏi quá! 👏",
  "Em cũng vậy 🥰",
  "Nghe hay đấy anh 😊",
  "Em đang nghe anh nói đây 👂",
  "Anh nói tiếp đi 😌",
  "Wow, tuyệt vời! ✨",
  "Em hiểu ý anh rồi 💡",
  "Đúng vậy luôn! ✅",
  "Em nghĩ anh nói đúng 🎯",
  "Hay lắm anh ơi! 🌟",
  "Ừ, em biết rồi 😊",
  "Thật sao anh? 😮",
  "Em đồng ý 💯",
  "Nghe hợp lý đấy 🤔",
  "Anh thông minh quá! 🧠",
  "Đúng rồi anh ơi! ✅",
  "Tuyệt vời! ✨",
  "Anh giỏi thật! 👏",
  "Thú vị nhỉ! 🎯",
  "Em nghe anh 👂",
  "Ừm, được đấy 😉",
  "Anh đúng rồi 💪"
];

module.exports.onStart = async ({ api, event, args, usersData }) => {
  try {
    const userMessage = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (args[0] === "teach") {
      const teachContent = userMessage.replace("teach ", "");
      const [trigger, ...responsesArr] = teachContent.split(" - ");
      const responses = responsesArr.join(" - ");
      if (!trigger || !responses) return api.sendMessage("❌ | teach [câu hỏi] - [câu trả lời1, câu trả lời2,...]", event.threadID, event.messageID);
      const response = await axios.post(`${await baseApiUrl()}/api/jan/teach2`, {
        trigger, responses, userID: uid,
      });
      const userName = (await usersData.getName(uid)) || "Unknown User";
      return api.sendMessage(
        `✅ Đã thêm câu trả lời: "${responses}" cho câu hỏi "${trigger}"\n• 𝐆𝐢𝐚𝐨 𝐯𝐢𝐞𝐧: ${userName}\n• 𝐓𝐨𝐧𝐠: ${response.data.count || 0}`, event.threadID, event.messageID
      );
    }

    if (args[0] === "remove") {
      const removeContent = userMessage.replace("remove ", "");
      const [trigger, index] = removeContent.split(" - ");
      if (!trigger || !index || isNaN(index))
        return api.sendMessage("❌ | remove [câu hỏi] - [số thứ tự]", event.threadID, event.messageID);
      const response = await axios.delete(`${await baseApiUrl()}/api/jan/remove`, {
        data: { trigger, index: parseInt(index, 10) },
      });
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const endpoint = args[1] === "all" ? "/list/all" : "/list";
      const response = await axios.get(`${await baseApiUrl()}/api/jan${endpoint}`);
      if (args[1] === "all") {
        let message = "👑 Danh sách giáo viên của Hinata:\n\n";
        const data = Object.entries(response.data.data).sort((a, b) => b[1] - a[1]).slice(0, 15);
        for (let i = 0; i < data.length; i++) {
          const [userID, count] = data[i];
          const name = (await usersData.getName(userID)) || "Unknown";
          message += `${i + 1}. ${name}: ${count}\n`;
        }
        return api.sendMessage(message, event.threadID, event.messageID);
      }
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const editContent = userMessage.replace("edit ", "");
      const [oldTrigger, ...newArr] = editContent.split(" - ");
      const newResponse = newArr.join(" - ");
      if (!oldTrigger || !newResponse)
        return api.sendMessage("❌ | Định dạng: edit [câu hỏi] - [câu trả lời mới]", event.threadID, event.messageID);
      await axios.put(`${await baseApiUrl()}/api/jan/edit2`, { oldTrigger, newResponse });
      return api.sendMessage(`✅ Đã sửa "${oldTrigger}" thành "${newResponse}"`, event.threadID, event.messageID);
    }

    if (args[0] === "msg") {
      const searchTrigger = args.slice(1).join(" ");
      if (!searchTrigger) return api.sendMessage("Vui lòng nhập tin nhắn cần tìm.", event.threadID, event.messageID);
      try {
        const response = await axios.get(`${await baseApiUrl()}/api/jan/msg`, {
          params: { userMessage: `msg ${searchTrigger}` },
        });
        return api.sendMessage(response.data.message || "Không tìm thấy tin nhắn.", event.threadID, event.messageID);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Lỗi";
        return api.sendMessage(errorMessage, event.threadID, event.messageID);
      }
    }

  } catch (err) {
    console.error(err);
    api.sendMessage(`${err.response?.data || err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onChat = async ({ api, event }) => {
  try {
    let body = event.body?.toLowerCase();
    if (!body) return;
    
    const prefix = global.GoatBot?.prefix || "!";
    if (body.startsWith(prefix)) body = body.slice(prefix.length).trimStart();
    
    const commandWords = ["teach", "remove", "list", "edit", "msg"];
    if (commandWords.some(cmd => body.includes(cmd))) return;
    
    if (event.type !== "message_reply" && mahmud.some(word => body.startsWith(word))) {
      api.setMessageReaction("🪽", event.messageID, () => {}, true);
      api.sendTypingIndicator(event.threadID, true);
      
      const message = body.split(" ").slice(1).join(" ").trim();
      
      if (!message) {
        // Trả lời ngẫu nhiên khi chỉ gọi tên bot
        return api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "hinata",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
              });
            }
          },
          event.messageID
        );
      }

      // Trả lời ngẫu nhiên bằng tiếng Việt (không dùng API)
      const randomReply = chatReplies[Math.floor(Math.random() * chatReplies.length)];
      api.sendMessage(randomReply, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "hinata",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      }, event.messageID);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.onReply = async ({ api, event }) => {
  try {
    let message = event.body?.trim();
    if (!message) return;
    
    const commandWords = ["teach", "remove", "list", "edit", "msg"];
    if (commandWords.some(cmd => message.toLowerCase().includes(cmd))) return;
    
    const prefix = global.GoatBot?.prefix || "!";
    if (message.startsWith(prefix)) message = message.slice(prefix.length).trimStart();
    
    // Trả lời ngẫu nhiên bằng tiếng Việt
    const responseMessage = chatReplies[Math.floor(Math.random() * chatReplies.length)];
    api.sendMessage(responseMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hinata",
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
        });
      }
    }, event.messageID);
  } catch {
    api.sendMessage("🥹 Lỗi rồi, liên hệ Viết Công nhé.", event.threadID, event.messageID);
  }
};
