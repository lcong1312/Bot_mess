const axios = require("axios");
const fs = require("fs-extra");
module.exports = {
  config: {
    name: "v2a",
    aliases: ["convert"],
    version: "1.2",
    author: "dipto",
    countDown: 20,
    description: {
      vi: "Chuyển đổi video thành audio",
      en: "Convert video to audio"
    },
    category: "media",
    guide: {
      vi: "Reply video để chuyển thành audio",
      en: "Reply to a video to convert to audio"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        message.reply("⚠️ Vui lòng reply một video để chuyển thành audio.");
        return;
      }

      const dipto = event.messageReply.attachments[0];
      if (dipto.type !== "video") {
        message.reply("⚠️ Nội dung reply phải là video.");
        return;
      }
      const { data } = await axios.get(dipto.url, { method: 'GET', responseType: 'arraybuffer' });
 const path = __dirname + `/cache/dvia.m4a`
            if(!fs.existsSync(path)){
        fs.mkdir(__dirname + '/cache');
      }
      fs.writeFileSync(path, Buffer.from(data, 'utf-8'));

      const audioReadStream = fs.createReadStream(path);
      const msg = { body: "", attachment: [audioReadStream] };
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
      console.log(e);
message.reply(e.message)
    }
  },
};
