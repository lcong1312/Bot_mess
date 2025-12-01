const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pair",
    version: "1.7",
    author: "MahMUD | Viết Công",
    category: "love",
    description: {
      vi: "Ghép đôi ngẫu nhiên trong nhóm",
      en: "Random pairing in group"
    },
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      cantDetermineGender: "❌ Không thể xác định giới tính của bạn. Vui lòng cập nhật hồ sơ.",
      noOppositeGender: "❌ Không tìm thấy thành viên %1 trong nhóm này.",
      male: "nam",
      female: "nữ",
      pairAlert: `
💖✨ 𝗖ặ𝗽 Đô𝗶 𝗠ớ𝗶! ✨💖

🎉 𝐌ọ𝐢 𝐧𝐠ườ𝐢, 𝐡ã𝐲 𝐜𝐡ú𝐜 𝐦ừ𝐧𝐠 𝐜ặ𝐩 đô𝐢 𝐦ớ𝐢 𝐜ủ𝐚 𝐜𝐡ú𝐧𝐠 𝐭𝐚

• %1  
• %2

❤  𝐓ỷ 𝐥ệ 𝐲ê𝐮: %3%  
🌟 𝐓ươ𝐧𝐠 𝐭𝐡í𝐜𝐡: %4%

💍 𝐂𝐡ú𝐜 𝐭ì𝐧𝐡 𝐲ê𝐮 𝐜ủ𝐚 𝐛ạ𝐧 𝐦ã𝐢 𝐧ở 𝐫ộ`
    },
    en: {
      cantDetermineGender: "❌ Couldn't determine your gender. Please update your profile.",
      noOppositeGender: "❌ No %1 members found in this group.",
      male: "male",
      female: "female",
      pairAlert: `
💖✨ 𝗡𝗲𝘄 𝗣𝗮𝗶𝗿 𝗔𝗹𝗲𝗿𝘁! ✨💖

🎉 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞, 𝐥𝐞𝐭'𝐬 𝐜𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐞 𝐨𝐮𝐫 𝐥𝐨𝐯𝐞𝐥𝐲 𝐧𝐞𝐰 𝐜𝐨𝐮𝐩𝐥𝐞

• %1  
• %2

❤  𝐋𝐨𝐯𝐞 𝐏𝐞𝐫𝐜𝐞𝐧𝐭𝐚𝐠𝐞: %3%  
🌟 𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲: %4%

💍 𝐌𝐚𝐲 𝐲𝐨𝐮𝐫 𝐥𝐨𝐯𝐞 𝐛𝐥𝐨𝐨𝐦 𝐟𝐨𝐫𝐞𝐯𝐞𝐫`
    }
  },

  onStart: async function ({ event, threadsData, message, usersData, api, getLang }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("Bạn không được phép thay đổi tên tác giả.", event.threadID, event.messageID);
    }

    const uidI = event.senderID;
    const name1 = await usersData.getName(uidI);
    const avatarUrl1 = await usersData.getAvatarUrl(uidI);
    const threadData = await threadsData.get(event.threadID);

    const senderInfo = threadData.members.find(mem => mem.userID == uidI);
    const gender1 = senderInfo?.gender;

    if (!gender1 || (gender1 !== "MALE" && gender1 !== "FEMALE")) {
      return message.reply(getLang("cantDetermineGender"));
    }

    const oppositeGender = gender1 === "MALE" ? "FEMALE" : "MALE";
    const oppositeGenderText = oppositeGender === "MALE" ? getLang("male") : getLang("female");

    const candidates = threadData.members.filter(
      member => member.gender === oppositeGender && member.inGroup && member.userID !== uidI
    );

    if (candidates.length === 0) {
      return message.reply(getLang("noOppositeGender", oppositeGenderText));
    }

    const matched = candidates[Math.floor(Math.random() * candidates.length)];

    const name2 = await usersData.getName(matched.userID);
    const avatarUrl2 = await usersData.getAvatarUrl(matched.userID);

    const lovePercent = Math.floor(Math.random() * 36) + 65;
    const compatibility = Math.floor(Math.random() * 36) + 65;

    function toBoldUnicode(name) {
      const boldAlphabet = {
        "a": "𝐚", "b": "𝐛", "c": "𝐜", "d": "𝐝", "e": "𝐞", "f": "𝐟", "g": "𝐠", "h": "𝐡", "i": "𝐢", "j": "𝐣",
        "k": "𝐤", "l": "𝐥", "m": "𝐦", "n": "𝐧", "o": "𝐨", "p": "𝐩", "q": "𝐪", "r": "𝐫", "s": "𝐬", "t": "𝐭",
        "u": "𝐮", "v": "𝐯", "w": "𝐰", "x": "𝐱", "y": "𝐲", "z": "𝐳", "A": "𝐀", "B": "𝐁", "C": "𝐂", "D": "𝐃",
        "E": "𝐄", "F": "𝐅", "G": "𝐆", "H": "𝐇", "I": "𝐈", "J": "𝐉", "K": "𝐊", "L": "𝐋", "M": "𝐌", "N": "𝐍",
        "O": "𝐎", "P": "𝐏", "Q": "𝐐", "R": "𝐑", "S": "𝐒", "T": "𝐓", "U": "𝐔", "V": "𝐕", "W": "𝐖", "X": "𝐗",
        "Y": "𝐘", "Z": "𝐙", "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8",
        "9": "9", " ": " ", "'": "'", ",": ",", ".": ".", "-": "-", "!": "!", "?": "?"
      };
      return name.split('').map(char => boldAlphabet[char] || char).join('');
    }

    const styledName1 = toBoldUnicode(name1);
    const styledName2 = toBoldUnicode(name2);

    const styledMessage = getLang("pairAlert", styledName1, styledName2, lovePercent, compatibility);

    return message.reply({
      body: styledMessage,
      attachment: [
        await getStreamFromURL(avatarUrl1),
        await getStreamFromURL(avatarUrl2)
      ]
    });
  }
};
