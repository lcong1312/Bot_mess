const axios = require("axios");
const fs = require("fs");
const ytSearch = require("yt-search");

const apiBase = "https://you-tube-video-api-by-arafat.vercel.app/yt";

async function downloadFile(url, fileName) {
  const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(fileName, Buffer.from(response));
  return fs.createReadStream(fileName);
}

async function getThumbnailStream(url) {
  const response = await axios.get(url, { responseType: "stream" });
  return response.data;
}

module.exports = {
  config: {
    name: "sing",
    version: "1.8.0",
    aliases: ["music", "play"],
    author: "Arafat | Viết Công",
    countDown: 5,
    role: 0,
    description: {
      vi: "Tìm kiếm và tải nhạc từ YouTube",
      en: "Search and download audio from YouTube"
    },
    category: "media",
    guide: {
      vi: "{pn} [tên bài hát]\nVí dụ: {pn} Despacito",
      en: "{pn} [song name]\nExample: {pn} Despacito"
    }
  },

  langs: {
    vi: {
      missingKeyword: "❌ Vui lòng nhập tên bài hát.",
      noResults: "⭕ Không tìm thấy kết quả cho: %1",
      searchResults: "🎶 Kết quả tìm kiếm:\n\n",
      duration: "⏱ Thời lượng",
      channel: "👤 Kênh",
      replyGuide: "➡ Phản hồi với số (1-6) để tải nhạc.",
      invalidChoice: "❌ Lựa chọn không hợp lệ. Nhập số từ 1-6.",
      downloadFailed: "❌ Không thể tải nhạc.",
      searchFailed: "❌ Không thể tìm kiếm YouTube.",
      downloaded: "🎵 Đã tải: %1"
    },
    en: {
      missingKeyword: "❌ Please provide a song name.",
      noResults: "⭕ No results found for: %1",
      searchResults: "🎶 Search Results:\n\n",
      duration: "⏱ Duration",
      channel: "👤 Channel",
      replyGuide: "➡ Reply with a number (1-6) to download the audio.",
      invalidChoice: "❌ Invalid choice. Enter a number between 1-6.",
      downloadFailed: "❌ Failed to download audio.",
      searchFailed: "❌ Failed to search YouTube.",
      downloaded: "🎵 Downloaded: %1"
    }
  },

  onStart: async ({ api, args, event, commandName, getLang }) => {
    const keyword = args.join(" ");
    if (!keyword) return api.sendMessage(getLang("missingKeyword"), event.threadID, event.messageID);

    try {
      const searchResults = (await ytSearch(keyword)).videos.slice(0, 6);
      if (!searchResults || searchResults.length === 0)
        return api.sendMessage(getLang("noResults", keyword), event.threadID, event.messageID);

      let msg = getLang("searchResults");
      for (let i = 0; i < searchResults.length; i++) {
        const video = searchResults[i];
        msg += `✨ ${i + 1}. ${video.title}\n${getLang("duration")}: ${video.timestamp}\n${getLang("channel")}: ${video.author.name}\n\n`;
      }

      const thumbnails = await Promise.all(searchResults.map(v => getThumbnailStream(v.thumbnail)));

      api.sendMessage(
        { body: msg + getLang("replyGuide"), attachment: thumbnails },
        event.threadID,
        (err, infoMsg) => {
          global.GoatBot.onReply.set(infoMsg.messageID, {
            commandName,
            messageID: infoMsg.messageID,
            author: event.senderID,
            results: searchResults
          });
        },
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage(getLang("searchFailed"), event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, getLang }) => {
    try {
      const { results } = Reply;
      const choice = parseInt(event.body);

      if (isNaN(choice) || choice < 1 || choice > results.length)
        return api.sendMessage(getLang("invalidChoice"), event.threadID, event.messageID);

      const video = results[choice - 1];
      const videoURL = video.url;

      const { data } = await axios.get(`${apiBase}?url=${encodeURIComponent(videoURL)}&type=mp3`);
      if (!data.status || !data.download_url)
        return api.sendMessage(getLang("downloadFailed"), event.threadID, event.messageID);

      const fileName = "audio.mp3";
      await downloadFile(data.download_url, fileName);

      await api.unsendMessage(Reply.messageID);
      api.sendMessage(
        { body: getLang("downloaded", video.title), attachment: fs.createReadStream(fileName) },
        event.threadID,
        () => fs.unlinkSync(fileName),
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage(getLang("downloadFailed"), event.threadID, event.messageID);
    }
  }
};
