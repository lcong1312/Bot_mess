module.exports = {
	config: {
		name: "taixiu",
		aliases: ["tx"],
		version: "1.0",
		author: "Viết Công",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Chơi game tài xỉu",
			en: "Play dice game"
		},
		longDescription: {
			vi: "Chơi game tài xỉu với tiền của bạn",
			en: "Play dice game with your money"
		},
		category: "game",
		guide: {
			vi: "{pn} <tài/xỉu/t/x> <số tiền>"
				+ "\n   Ví dụ:"
				+ "\n    {pn} tài 100"
				+ "\n    {pn} t 500"
				+ "\n    {pn} xỉu 200"
				+ "\n    {pn} x 1000",
			en: "{pn} <tai/xiu/t/x> <amount>"
				+ "\n   Example:"
				+ "\n    {pn} tai 100"
				+ "\n    {pn} t 500"
		}
	},

	langs: {
		vi: {
			missingInput: "⚠️ Vui lòng nhập đầy đủ: {pn} <tài/xỉu> <số tiền>\nVí dụ: {pn} tài 100",
			invalidChoice: "⚠️ Vui lòng chọn 'tài' hoặc 'xỉu' (hoặc 't'/'x')",
			invalidAmount: "⚠️ Số tiền phải là số nguyên dương",
			minAmount: "⚠️ Số tiền đặt cược tối thiểu là 10$",
			notEnoughMoney: "⚠️ Bạn không đủ tiền! Số dư hiện tại: %1$",
			rolling: "🎲 Đang lắc xúc xắc...",
			result: "🎲 Kết quả: %1 - %2 - %3 = %4 điểm\n"
				+ "📊 Kết quả: %5\n"
				+ "━━━━━━━━━━━━━━━\n"
				+ "%6",
			win: "🎉 Chúc mừng! Bạn đã thắng!\n💰 +%1$ (Tổng: %2$)",
			lose: "😢 Bạn đã thua!\n💸 -%1$ (Còn lại: %2$)",
			tai: "TÀI (11-17 điểm)",
			xiu: "XỈU (4-10 điểm)"
		},
		en: {
			missingInput: "⚠️ Please enter: {pn} <tai/xiu> <amount>\nExample: {pn} tai 100",
			invalidChoice: "⚠️ Please choose 'tai' or 'xiu' (or 't'/'x')",
			invalidAmount: "⚠️ Amount must be a positive integer",
			minAmount: "⚠️ Minimum bet amount is 10$",
			notEnoughMoney: "⚠️ You don't have enough money! Current balance: %1$",
			rolling: "🎲 Rolling dice...",
			result: "🎲 Result: %1 - %2 - %3 = %4 points\n"
				+ "📊 Result: %5\n"
				+ "━━━━━━━━━━━━━━━\n"
				+ "%6",
			win: "🎉 Congratulations! You won!\n💰 +%1$ (Total: %2$)",
			lose: "😢 You lost!\n💸 -%1$ (Remaining: %2$)",
			tai: "TAI (11-17 points)",
			xiu: "XIU (4-10 points)"
		}
	},

	onStart: async function ({ args, message, event, usersData, getLang, commandName }) {
		const { senderID } = event;

		// Kiểm tra input
		if (args.length < 2) {
			return message.reply(getLang("missingInput").replace("{pn}", `/${commandName}`));
		}

		// Lấy lựa chọn (tài/xỉu)
		const choice = args[0].toLowerCase();
		let userChoice;
		
		if (["tài", "tai", "t"].includes(choice)) {
			userChoice = "tai";
		} else if (["xỉu", "xiu", "x"].includes(choice)) {
			userChoice = "xiu";
		} else {
			return message.reply(getLang("invalidChoice"));
		}

		// Lấy số tiền đặt cược
		const betAmount = parseInt(args[1]);
		
		if (isNaN(betAmount) || betAmount <= 0) {
			return message.reply(getLang("invalidAmount"));
		}

		if (betAmount < 10) {
			return message.reply(getLang("minAmount"));
		}

		// Kiểm tra số dư
		const userData = await usersData.get(senderID);
		const currentMoney = userData.money || 0;

		if (currentMoney < betAmount) {
			return message.reply(getLang("notEnoughMoney", currentMoney));
		}

		// Gửi tin nhắn đang lắc xúc xắc
		await message.reply(getLang("rolling"));

		// Chờ 2 giây để tạo cảm giác hồi hộp
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Lắc 3 con xúc xắc
		const dice1 = Math.floor(Math.random() * 6) + 1;
		const dice2 = Math.floor(Math.random() * 6) + 1;
		const dice3 = Math.floor(Math.random() * 6) + 1;
		const total = dice1 + dice2 + dice3;

		// Xác định kết quả (Tài: 11-17, Xỉu: 4-10)
		const result = total >= 11 ? "tai" : "xiu";
		const resultText = result === "tai" ? getLang("tai") : getLang("xiu");

		// Kiểm tra thắng thua
		const isWin = userChoice === result;
		let newMoney;
		let resultMessage;

		if (isWin) {
			// Thắng: nhận lại tiền đặt cược + tiền thắng
			newMoney = currentMoney + betAmount;
			resultMessage = getLang("win", betAmount, newMoney);
		} else {
			// Thua: mất tiền đặt cược
			newMoney = currentMoney - betAmount;
			resultMessage = getLang("lose", betAmount, newMoney);
		}

		// Cập nhật số dư
		await usersData.set(senderID, {
			money: newMoney,
			data: userData.data
		});

		// Gửi kết quả
		const finalMessage = getLang("result", dice1, dice2, dice3, total, resultText, resultMessage);
		return message.reply(finalMessage);
	}
};
