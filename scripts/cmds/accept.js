const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "Arafat | Viết Công",
    countDown: 8,
    role: 2,
    description: {
      vi: "Chấp nhận/từ chối lời mời kết bạn",
      en: "Accept/reject friend requests"
    },
    category: "system",
  },

  langs: {
    vi: {
      selectAction: "Vui lòng chọn <add | del> <số thứ tự | hoặc \"all\">",
      cantFind: "Không tìm thấy số thứ tự %1 trong danh sách",
      successAdd: "» Đã xử lý %1 lời mời kết bạn:\n\n%2",
      successDel: "» Đã xóa %1 lời mời kết bạn:\n\n%2",
      errorList: "\n» Có %1 người gặp lỗi: %2",
      invalidResponse: "Phản hồi không hợp lệ. Vui lòng cung cấp phản hồi hợp lệ.",
      listHeader: "📋 Danh sách lời mời kết bạn:",
      name: "Tên",
      time: "Thời gian",
      replyGuide: "\nPhản hồi tin nhắn này với nội dung: <add | del> <số thứ tự | hoặc \"all\"> để thực hiện"
    },
    en: {
      selectAction: "Please select <add | del> <target number | or \"all\">",
      cantFind: "Can't find stt %1 in the list",
      successAdd: "» Friend request has been processed for %1 people:\n\n%2",
      successDel: "» Friend request deletion has been processed for %1 people:\n\n%2",
      errorList: "\n» The following %1 people encountered errors: %2",
      invalidResponse: "Invalid response. Please provide a valid response.",
      listHeader: "📋 Friend request list:",
      name: "Name",
      time: "Time",
      replyGuide: "\nReply to this message with content: <add | del> <number | or \"all\"> to take action"
    }
  },

  onReply: async function ({ message, Reply, event, api, commandName, getLang }) {
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage(getLang("selectAction"), event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);

    if (args[1] === "all") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(getLang("cantFind", stt));
        continue;
      }
      form.variables.input.friend_requester_id = u.node.id;
      form.variables = JSON.stringify(form.variables);
      newTargetIDs.push(u);
      promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
      form.variables = JSON.parse(form.variables);
    }

    const lengthTarget = newTargetIDs.length;
    for (let i = 0; i < lengthTarget; i++) {
      try {
        const friendRequest = await promiseFriends[i];
        if (JSON.parse(friendRequest).errors) {
          failed.push(newTargetIDs[i].node.name);
        }
        else {
          success.push(newTargetIDs[i].node.name);
        }
      }
      catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      const successMsg = args[0] === 'add' ? getLang("successAdd", success.length, success.join("\n")) : getLang("successDel", success.length, success.join("\n"));
      const errorMsg = failed.length > 0 ? getLang("errorList", failed.length, failed.join("\n")) : "";
      api.sendMessage(successMsg + errorMsg, event.threadID, event.messageID);
    } else {
      api.unsendMessage(messageID);
      return api.sendMessage(getLang("invalidResponse"), event.threadID);
    }

    api.unsendMessage(messageID);
  },

  onStart: async function ({ event, api, commandName, getLang }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
    let msg = getLang("listHeader");
    let i = 0;
    for (const user of listRequest) {
      i++;
      msg += (`\n${i}. ${getLang("name")}: ${user.node.name}`
        + `\nID: ${user.node.id}`
        + `\nUrl: ${user.node.url.replace("www.facebook", "fb")}`
        + `\n${getLang("time")}: ${moment(user.time * 1009).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss")}\n`);
    }
    api.sendMessage(msg + getLang("replyGuide"), event.threadID, (e, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        listRequest,
        author: event.senderID,
        unsendTimeout: setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, this.config.countDown * 1000)
      });
    }, event.messageID);
  }
}
