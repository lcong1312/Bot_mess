const axios = require('axios');

const maxStorageMessage = 4;

if (!global.temp.openAIUsing)
	global.temp.openAIUsing = {};

module.exports = {
	config: {
		name: "gpt",
		version: "1.6",
		author: "NTKhang | Viết Công",
		countDown: 5,
		role: 0,
		description: {
			vi: "GPT chat",
			en: "GPT chat"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} <clear> - xoa lich su chat voi gpt\n   {pn} <noi dung> - chat voi gpt",
			en: "   {pn} <clear> - clear chat history with gpt\n   {pn} <content> - chat with gpt"
		}
	},

	langs: {
		vi: {
			invalidContent: "Vui long nhap noi dung ban muon chat",
			yourAreUsing: "Ban dang su dung gpt chat, vui long cho",
			error: "Da co loi xay ra\n%1",
			clearHistory: "Da xoa lich su chat cua ban voi gpt"
		},
		en: {
			invalidContent: "Please enter the content you want to chat",
			yourAreUsing: "You are using gpt chat, please wait",
			error: "An error has occurred\n%1",
			clearHistory: "Your chat history with gpt has been deleted"
		}
	},

	onStart: async function ({ message, event, args, getLang, commandName, usersData }) {
		switch (args[0]) {
			case 'clear': {
				await usersData.set(event.senderID, [], "data.gptHistory");
				return message.reply(getLang('clearHistory'));
			}
			default: {
				if (!args[0])
					return message.reply(getLang('invalidContent'));

				if (global.temp.openAIUsing[event.senderID])
					return message.reply(getLang("yourAreUsing"));

				handleGpt(event, message, args, getLang, commandName, usersData);
			}
		}
	},

	onReply: async function ({ Reply, message, event, args, getLang, commandName, usersData }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;

		handleGpt(event, message, args, getLang, commandName, usersData);
	}
};

async function askGpt(prompt, history) {
	const response = await axios({
		url: "https://api.deepinfra.com/v1/openai/chat/completions",
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
			messages: [
				{ role: "system", content: "Ban la mot tro ly AI thong minh, huu ich. Tra loi ngan gon, chinh xac." },
				...history,
				{ role: "user", content: prompt }
			],
			max_tokens: 1024,
			temperature: 0.7
		}
	});
	return response.data.choices[0].message.content;
}

async function handleGpt(event, message, args, getLang, commandName, usersData) {
	try {
		global.temp.openAIUsing[event.senderID] = true;

		// Lấy history từ database
		const userData = await usersData.get(event.senderID);
		let history = userData.data.gptHistory || [];
		if (!Array.isArray(history)) history = [];

		const prompt = args.join(' ');
		const text = await askGpt(prompt, history);

		history.push({ role: 'user', content: prompt });
		history.push({ role: 'assistant', content: text });

		// Giới hạn số lượng tin nhắn lưu trữ
		if (history.length > maxStorageMessage * 2)
			history = history.slice(-maxStorageMessage * 2);

		// Lưu history vào database
		await usersData.set(event.senderID, history, "data.gptHistory");

		return message.reply(text, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				author: event.senderID,
				messageID: info.messageID
			});
		});
	}
	catch (err) {
		const errorMessage = err.response?.data?.error?.message || err.message || "";
		return message.reply(getLang('error', errorMessage));
	}
	finally {
		delete global.temp.openAIUsing[event.senderID];
	}
}
