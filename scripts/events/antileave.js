const { getTime } = global.utils;

module.exports = {
	config: {
		name: "antileave",
		version: "1.0",
		author: "Kiro Assistant",
		category: "events"
	},

	langs: {
		vi: {
			addedBack: "🔄 %1 đã tự rời nhóm và đã được thêm lại!\n(Chế độ chống rời nhóm đang bật)",
			cantAddBack: "⚠️ %1 đã tự rời nhóm nhưng không thể thêm lại.\nLý do: Người dùng đã chặn bot hoặc chặn người lạ thêm vào nhóm."
		},
		en: {
			addedBack: "🔄 %1 left the group and has been added back!\n(Anti-leave mode is ON)",
			cantAddBack: "⚠️ %1 left the group but couldn't be added back.\nReason: User blocked the bot or blocked strangers from adding to group."
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		// Chỉ xử lý khi có người rời nhóm
		if (event.logMessageType !== "log:unsubscribe") return;

		return async function () {
			const { threadID } = event;
			const { leftParticipantFbId } = event.logMessageData;
			
			// Bỏ qua nếu bot bị kick
			if (leftParticipantFbId == api.getCurrentUserID()) return;
			
			// Kiểm tra xem có phải tự rời không (không phải bị kick)
			// Nếu author === leftParticipantFbId thì là tự rời
			const isSelfLeave = event.author === leftParticipantFbId;
			
			// Chỉ xử lý khi tự rời nhóm
			if (!isSelfLeave) return;

			// Kiểm tra xem nhóm có bật anti-leave không
			const threadData = await threadsData.get(threadID);
			const antiLeave = threadData.data?.antiLeave || false;

			if (!antiLeave) return;

			// Lấy tên người dùng
			const userName = await usersData.getName(leftParticipantFbId);

			// Thử thêm lại người dùng vào nhóm
			try {
				await api.addUserToGroup(leftParticipantFbId, threadID);
				message.send(getLang("addedBack", userName));
			} catch (error) {
				message.send(getLang("cantAddBack", userName));
			}
		};
	}
};
