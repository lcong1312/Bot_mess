module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt"],
    version: "1.7",
    author: "MahMUD | Viết Công",
    role: 0,
    category: "general",
    guide: {
      vi: "Sử dụng {p}uptime để xem thời gian hoạt động của bot.",
      en: "Use {p}uptime to display bot's uptime and user stats."
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const days = Math.floor(uptime / (60 * 60 * 24));
      const hours = Math.floor((uptime % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);

      const uptimeString = `${days} ngày ${hours} giờ ${minutes} phút`;

      const msg = 
`╭─🎀 𝗧𝗛𝗢̛̀𝗜 𝗚𝗜𝗔𝗡 𝗛𝗢𝗔̣𝗧 Đ𝗢̣̂𝗡𝗚
│
├🐤 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${uptimeString}  
├👥 𝗧𝗼̂̉𝗻𝗴 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: ${allUsers.length.toLocaleString()}  
├💬 𝗧𝗼̂̉𝗻𝗴 𝗻𝗵𝗼́𝗺: ${allThreads.length.toLocaleString()}  
│
╰───────────────◉`;

      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Đã xảy ra lỗi khi lấy dữ liệu.", event.threadID, event.messageID);
    }
  }
};
