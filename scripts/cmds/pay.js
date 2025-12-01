module.exports = {
	config: {
		name: "pay",
		aliases: ["cong", "congtien", "addmoney"],
		version: "1.0",
		author: "Kiro Assistant",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Cộng/trừ tiền cho người dùng",
			en: "Add/subtract money to user"
		},
		longDescription: {
			vi: "Cộng/trừ tiền cho người dùng (chỉ admin bot)",
			en: "Add/subtract money to user (admin bot only)"
		},
		category: "economy",
		guide: {
			vi: "{pn} <@tag | uid> <số tiền>"
				+ "\n   Ví dụ:"
				+ "\n    {pn} @tag 1000 (cộng 1000$)"
				+ "\n    {pn} @tag -500 (trừ 500$)"
				+ "\n    {pn} 100057376711750 5000",
			en: "{pn} <@tag | uid> <amount>"
				+ "\n   Example:"
				+ "\n    {pn} @tag 1000"
		}
	},

	langs: {
		vi: {
			missingTarget: "⚠️ Vui lòng tag người dùng hoặc nhập uid cần cộng/trừ tiền",
			missingAmount: "⚠️ Vui lòng nhập số tiền cần cộng/trừ\nVí dụ: {pn} @tag 1000 hoặc {pn} @tag -500",
			invalidAmount: "⚠️ Số tiền phải là số nguyên (khác 0)",
			success: "✅ Đã %1 %2$ %3 người dùng %4\n💰 Số dư mới: %5$",
			notFound: "⚠️ Không tìm thấy người dùng với ID: %1"
		},
		en: {
			missingTarget: "⚠️ Please tag user or enter uid to add money",
			missingAmount: "⚠️ Please enter amount to add\nExample: {pn} @tag 1000",
			invalidAmount: "⚠️ Amount must be a positive integer",
			success: "✅ Added %1$ to user %2\n💰 New balance: %3$",
			notFound: "⚠️ User not found with ID: %1"
		}
	},

	onStart: async function ({ args, message, event, usersData, getLang, commandName }) {
		const { senderID, mentions } = event;

		// Lấy target user
		let targetID;
		let amountIndex = 1; // Vị trí của số tiền trong args
		
		if (Object.keys(mentions).length > 0) {
			targetID = Object.keys(mentions)[0];
			// Khi có mention, số tiền sẽ ở cuối cùng
			amountIndex = args.length - 1;
		} else if (args[0]) {
			targetID = args[0];
			amountIndex = 1;
		} else {
			return message.reply(getLang("missingTarget"));
		}

		// Kiểm tra số tiền
		const amount = parseInt(args[amountIndex]);
		
		if (!args[amountIndex]) {
			return message.reply(getLang("missingAmount").replace("{pn}", `/${commandName}`));
		}

		if (isNaN(amount) || amount === 0) {
			return message.reply(getLang("invalidAmount"));
		}

		// Kiểm tra user có tồn tại không
		try {
			const userData = await usersData.get(targetID);
			
			if (!userData) {
				return message.reply(getLang("notFound", targetID));
			}

			const currentMoney = userData.money || 0;
			const newMoney = currentMoney + amount;

			// Cập nhật số dư
			await usersData.set(targetID, {
				money: newMoney,
				data: userData.data
			});

			// Lấy tên người dùng
			const userName = userData.name || "Unknown";
			
			// Xác định hành động (cộng/trừ)
			const action = amount > 0 ? "cộng" : "trừ";
			const preposition = amount > 0 ? "cho" : "của";
			const absAmount = Math.abs(amount);

			return message.reply(getLang("success", action, absAmount, preposition, userName, newMoney));
		} catch (error) {
			return message.reply(getLang("notFound", targetID));
		}
	}
};
