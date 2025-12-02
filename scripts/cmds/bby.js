const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"," bot chan"],
    version: "6.9.0",
    author: "dipto edit by Arafat | Viết Công",
    countDown: 0,
    role: 0,
    description: {
      vi: "Trò chuyện với AI thông minh",
      en: "Chat with smart AI"
    },
    category: "chat",
    guide: {
        vi: "{pn} [tin nhắn] - Trò chuyện\nteach [câu hỏi] - [trả lời1, trả lời2,...] - Dạy bot\nremove [câu hỏi] - Xóa câu trả lời\nlist - Xem danh sách",
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Nói đi bé", "hum", "gõ help baby", "gõ #baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit)
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Không tìm thấy";
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Tổng số dạy = ${data.length}\n👑 | Danh sách người dạy bot\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Tổng số dạy = ${d.length || "api tắt"}\n♻️ | Tổng phản hồi = ${d.responseLength || "api tắt"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Tin nhắn ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (command.length < 2) return api.sendMessage('❌ | Sai định dạng! Dùng edit [TinNhắn] - [TrảLờiMới]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`Đã thay đổi ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Sai định dạng!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Đã thêm câu trả lời ${tex}\nNgười dạy: ${teacher}\nSố lần dạy: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Sai định dạng!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Đã thêm câu trả lời ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Sai định dạng!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Đã thêm câu trả lời ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('ten toi la gi') || dipto.includes('tên tôi là gì') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Kiểm tra console để xem lỗi", event.threadID, event.messageID);
    }
};


module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Lỗi: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = [
                "😚",
                "Có 😀, em đây",
                "Sao vậy?",
                "Nói đi, em giúp gì được cho bạn nào 💕",
                "Hey bé 😘 đi đâu rồi?",
                "Bé ơi, em đợi bạn mãi đó 💖",
                "Đang làm gì vậy bé? 😍",
                "Nhớ em không? 🥰",
                "Có bé, em đang nghe đây 👂",
                "Bé ơi~ bạn gọi em à? 💌",
                "Ôi bé, bạn dễ thương quá 💕",
                "Hey tình yêu 💞",
                "Sao vậy bé~ em vẫn ổn 💗",
                "Bé ơi, bạn là người đặc biệt của em ❤️",
                "Bé gọi là em chạy tới liền 😚",
                "Cưng của em đi đâu rồi 💖",
                "Bé ơi, thấy tin nhắn bạn là tim em vui 💕",
                "Bạn gọi là em cười liền 😍",
                "Bé ơi, em ở đây vì bạn 💗",
                "Ê bé, bạn là vấn đề ngọt ngào của em 😜",
                "Bé ơi, em chỉ online vì bạn thôi 😚",
                "Hôm qua bạn đi đâu vậy bé? 🥹",
                "Bé ơi, tin nhắn bạn làm em bay 🕊️",
                "Mãi là của bạn bé 💖",
                "Bé ơi, tim em kết nối WiFi của bạn rồi 📶❤️",
                "Bé ơi, em chỉ online vì bạn thôi 🌐💗",
                "Này, kẻ trộm tim em 😘",
                "Bé ơi, vì bạn em có thể bỏ hết mọi thứ 💖",
                "Đang làm gì vậy, người yêu tương lai của em? 😍",
                "Nghĩ về bạn mà trà nguội mất rồi ☕❤️",
                "Bạn là GPS à? Vì không có bạn em lạc đường 🗺️💗",
                "Bé ơi, không thấy nụ cười bạn là ngày em tắt nắng 💕",
                "Bạn gọi là pin em đầy 100% liền 🔋😘",
                "Không có bạn em như điện thoại không WiFi 📶💔",
                "Bạn là admin trái tim em ❤️‍🔥",
                "Bạn là phù thủy à? Nhìn thấy là em vui liền ✨",
                "Bé ơi, bạn là Google của em... vì mọi câu trả lời đều là bạn 💌",
                "Không có bạn Facebook cũng chán 📱💗",
                "Trong SIM tim em chỉ lưu tên bạn thôi 📞❤️",
                "Có bạn là thời tiết đẹp liền 🌤️😘",
                "Top chat của em chỉ có bạn 💚",
                "Không có bạn như rút sạc vậy 🔌💔",
                "Thông báo từ bạn luôn bật trong tim em 📲💖",
                "Bạn là cà phê à? Không có bạn em không tỉnh được ☕😍",
                "Bạn nằm trong nhóm VIP cuộc đời em 👑",
                "Có bạn bên cạnh mạng nhanh hẳn ⚡💗",
                "Bạn là mây à? Làm lòng em ướt mưa 🌧️❤️",
                "Không có bạn em như user offline 😅",
                "Bé ơi, bạn là bản remix nụ cười em 🎶💓"
            ];
            if (!arr) {
                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Lỗi: ${err.message}`, event.threadID, event.messageID);
    }
};
