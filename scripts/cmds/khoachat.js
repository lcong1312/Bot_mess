module.exports = {
  config: {
    name: "khoachat",
    aliases: ["mutechat", "kc"],
    version: "1.0",
    author: "Viết Công",
    countDown: 5,
    role: 1,
    description: {
      vi: "Khóa chat người dùng trong nhóm",
      en: "Mute user in group"
    },
    category: "box chat",
    guide: {
      vi: "{pn} -n @tag - Khóa chat người được tag"
        + "\n{pn} -r @tag - Mở khóa chat người được tag"
        + "\n{pn} list - Xem danh sách người bị khóa chat",
      en: "{pn} -n @tag - Mute tagged user"
        + "\n{pn} -r @tag - Unmute tagged user"
        + "\n{pn} list - View list of muted users"
    }
  },

  langs: {
    vi: {
      noPermission: "⚠️ Chỉ admin nhóm mới có thể sử dụng lệnh này!",
      noTag: "⚠️ Vui lòng tag người cần khóa chat!",
      muted: "✅ Đã khóa chat %1 trong nhóm này\n⚠️ Người này sẽ không thể chat trong nhóm",
      unmuted: "✅ Đã mở khóa chat cho %1",
      notMuted: "⚠️ Người này chưa bị khóa chat",
      listEmpty: "📝 Danh sách người bị khóa chat: Trống",
      listMuted: "📝 Danh sách người bị khóa chat trong nhóm:\n\n%1",
      cantMuteAdmin: "⚠️ Không thể khóa chat admin nhóm!",
      cantMuteSelf: "⚠️ Không thể khóa chat chính mình!",
      alreadyMuted: "⚠️ Người này đã bị khóa chat rồi!"
    },
    en: {
      noPermission: "⚠️ Only group admins can use this command!",
      noTag: "⚠️ Please tag the user to mute!",
      muted: "✅ Muted %1 in this group\n⚠️ This user cannot chat in the group",
      unmuted: "✅ Unmuted %1",
      notMuted: "⚠️ This user is not muted",
      listEmpty: "📝 Muted users list: Empty",
      listMuted: "📝 Muted users in group:\n\n%1",
      cantMuteAdmin: "⚠️ Cannot mute group admin!",
      cantMuteSelf: "⚠️ Cannot mute yourself!",
      alreadyMuted: "⚠️ This user is already muted!"
    }
  },

  onStart: async function ({ args, message, event, threadsData, usersData, getLang, api }) {
    const { threadID, senderID } = event;
    
    // Lấy thông tin thread
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
    
    // Kiểm tra quyền admin
    if (!adminIDs.includes(senderID)) {
      return message.reply(getLang("noPermission"));
    }

    const threadData = await threadsData.get(threadID);
    let mutedUsers = threadData.data?.mutedUsers || [];

    // Xem danh sách
    if (args[0] === "list") {
      if (mutedUsers.length === 0) {
        return message.reply(getLang("listEmpty"));
      }

      let list = "";
      for (let i = 0; i < mutedUsers.length; i++) {
        const userName = await usersData.getName(mutedUsers[i]);
        list += `${i + 1}. ${userName} (${mutedUsers[i]})\n`;
      }

      return message.reply(getLang("listMuted", list));
    }

    // Kiểm tra tag
    const mentions = Object.keys(event.mentions);
    if (mentions.length === 0) {
      return message.reply(getLang("noTag"));
    }

    const targetID = mentions[0];
    const targetName = event.mentions[targetID].replace("@", "");

    // Khóa chat (-n)
    if (args[0] === "-n") {
      // Không cho khóa chính mình
      if (targetID === senderID) {
        return message.reply(getLang("cantMuteSelf"));
      }

      // Không cho khóa admin
      if (adminIDs.includes(targetID)) {
        return message.reply(getLang("cantMuteAdmin"));
      }

      // Kiểm tra đã bị khóa chưa
      if (mutedUsers.includes(targetID)) {
        return message.reply(getLang("alreadyMuted"));
      }

      // Thêm vào danh sách khóa
      mutedUsers.push(targetID);
      await threadsData.set(threadID, {
        ...threadData,
        data: {
          ...threadData.data,
          mutedUsers: mutedUsers
        }
      });

      return message.reply(getLang("muted", targetName));
    }

    // Mở khóa (-r)
    if (args[0] === "-r") {
      const index = mutedUsers.indexOf(targetID);
      
      if (index === -1) {
        return message.reply(getLang("notMuted"));
      }

      // Xóa khỏi danh sách
      mutedUsers.splice(index, 1);
      await threadsData.set(threadID, {
        ...threadData,
        data: {
          ...threadData.data,
          mutedUsers: mutedUsers
        }
      });

      return message.reply(getLang("unmuted", targetName));
    }

    return message.reply(getLang("noTag"));
  },

  onChat: async function ({ event, threadsData, api }) {
    const { threadID, senderID, messageID } = event;
    
    // Lấy danh sách người bị khóa
    const threadData = await threadsData.get(threadID);
    const mutedUsers = threadData.data?.mutedUsers || [];

    // Nếu người gửi bị khóa chat
    if (mutedUsers.includes(senderID)) {
      // Xóa tin nhắn
      api.unsendMessage(messageID);
      
      // Gửi thông báo (tùy chọn)
      // api.sendMessage("⚠️ Bạn đã bị khóa chat trong nhóm này!", threadID);
    }
  }
};
