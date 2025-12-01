module.exports = {
	config: {
		name: "antileave",
		aliases: ["chongroi", "khoaroi"],
		version: "1.0",
		author: "Kiro Assistant",
		countDown: 5,
		role: 1,
		shortDescription: {
			vi: "Chống thành viên tự rời nhóm",
			en: "Prevent members from leaving group"
		},
		longDescription: {
			vi: "Bật/tắt chế độ chống thành viên tự rời nhóm. Khi bật, nếu ai đó tự rời nhóm sẽ bị thêm lại ngay lập tức.",
			en: "Turn on/off anti-leave mode. When enabled, if someone leaves the group, they will be added back immediately."
		},
		category: "box chat",
		guide: {
			vi: "   {pn} on: Bật chống rời nhóm"
				+ "\n   {pn} off: Tắt chống rời nhóm"
				+ "\n   {pn} [để trống]: Xem trạng thái hiện tại",
			en: "   {pn} on: Turn on anti-leave"
				+ "\n   {pn} off: Turn off anti-leave"
				+ "\n   {pn} [empty]: View current status"
		}
	},

	langs: {
		vi: {
			turnedOn: "✅ Đã bật chế độ chống rời nhóm!\nNếu ai đó tự rời nhóm sẽ bị thêm lại ngay lập tức.",
			turnedOff: "❌ Đã tắt chế độ chống rời nhóm.",
			alreadyOn: "⚠️ Chế độ chống rời nhóm đã được bật từ trước.",
			alreadyOff: "⚠️ Chế độ chống rời nhóm đã được tắt từ trước.",
			currentStatus: "📊 Trạng thái chống rời nhóm: %1",
			statusOn: "🟢 Đang bật",
			statusOff: "🔴 Đang tắt",
			syntaxError: "⚠️ Sai cú pháp! Sử dụng:\n   {pn} on - Bật\n   {pn} off - Tắt",
			addedBack: "🔄 %1 đã tự rời nhóm và đã được thêm lại!\n(Chế độ chống rời nhóm đang bật)",
			cantAddBack: "⚠️ %1 đã tự rời nhóm nhưng không thể thêm lại.\nLý do: Người dùng đã chặn bot hoặc chặn người lạ thêm vào nhóm."
		},
		en: {
			turnedOn: "✅ Anti-leave mode is now ON!\nIf someone leaves the group, they will be added back immediately.",
			turnedOff: "❌ Anti-leave mode is now OFF.",
			alreadyOn: "⚠️ Anti-leave mode is already ON.",
			alreadyOff: "⚠️ Anti-leave mode is already OFF.",
			currentStatus: "📊 Anti-leave status: %1",
			statusOn: "🟢 ON",
			statusOff: "🔴 OFF",
			syntaxError: "⚠️ Wrong syntax! Use:\n   {pn} on - Turn on\n   {pn} off - Turn off",
			addedBack: "🔄 %1 left the group and has been added back!\n(Anti-leave mode is ON)",
			cantAddBack: "⚠️ %1 left the group but couldn't be added back.\nReason: User blocked the bot or blocked strangers from adding to group."
		}
	},

	onStart: async function ({ args, message, event, threadsData, getLang }) {
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const antiLeave = threadData.data.antiLeave || false;

		if (!args[0]) {
			const status = antiLeave ? getLang("statusOn") : getLang("statusOff");
			return message.reply(getLang("currentStatus", status));
		}

		const action = args[0].toLowerCase();

		if (action === "on") {
			if (antiLeave) {
				return message.reply(getLang("alreadyOn"));
			}
			await threadsData.set(threadID, true, "data.antiLeave");
			return message.reply(getLang("turnedOn"));
		}
		else if (action === "off") {
			if (!antiLeave) {
				return message.reply(getLang("alreadyOff"));
			}
			await threadsData.set(threadID, false, "data.antiLeave");
			return message.reply(getLang("turnedOff"));
		}
		else {
			return message.reply(getLang("syntaxError"));
		}
	}
};
