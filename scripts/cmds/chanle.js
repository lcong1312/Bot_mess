module.exports = {
	config: {
		name: "chanle",
		aliases: ["cl"],
		version: "1.0",
		author: "Kiro",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Chơi game chẵn lẻ",
			en: "Play even-odd game"
		},
		longDescription: {
			vi: "Chơi game chẵn lẻ với tiền của bạn",
			en: "Play even-odd game with your money"
		},
		category: "game",
		guide: {
			vi: "{pn} <chẵn/lẻ/c/l> <số tiền>"
				+ "\n   Ví dụ:"
				+ "\n    {pn} chẵn 100"
				+ "\n    {pn} c 500"
				+ "\n    {pn} lẻ 200"
				+ "\n    {pn} l 1000",
			en: "{pn} <chan/le/c/l> <amount>"
				+ "\n   Example:"
				+ "\n    {pn} chan 100"
				+ "\n    {pn} c 500"
		}
	},

	langs: {
		vi: {
			missingInput: "⚠️ Vui lòng nhập đầy đủ: {pn} <chẵn/lẻ> <số tiền>\nVí dụ: {pn} chẵn 100",
			invalidChoice: "⚠️ Vui lòng chọn 'chẵn' hoặc 'lẻ' (hoặc 'c'/'l')",
			invalidAmount: "⚠️ Số tiền phải là số nguyên dương",
			minAmount: "⚠️ Số tiền đặt cược tối thiểu là 10$",
			notEnoughMoney: "⚠️ Bạn không đủ tiền! Số dư hiện tại: %1$",
			rolling: "🎲 Đang tung xúc xắc...",
			result: "🎲 Kết quả: %1\n"
				+ "📊 Đây là số %2\n"
				+ "━━━━━━━━━━━━━━━\n"
				+ "%3",
			win: "🎉 Chúc mừng! Bạn đã thắng!\n💰 +%1$ (Tổng: %2$)",
			lose: "😢 Bạn đã thua!\n💸 -%1$ (Còn lại: %2$)",
			even: "CHẴN",
			odd: "LẺ"
		},
		en: {
			missingInput: "⚠️ Please enter: {pn} <chan/le> <amount>\nExample: {pn} chan 100",
			invalidChoice: "⚠️ Please choose 'chan' (even) or 'le' (odd) (or 'c'/'l')",
			invalidAmount: "⚠️ Amount must be a positive integer",
			minAmount: "⚠️ Minimum bet amount is 10$",
			notEnoughMoney: "⚠️ You don't have enough money! Current balance: %1$",
			rolling: "🎲 Rolling dice...",
			result: "🎲 Result: %1\n"
				+ "📊 This is %2 number\n"
				+ "━━━━━━━━━━━━━━━\n"
				+ "%3",
			win: "🎉 Congratulations! You won!\n💰 +%1$ (Total: %2$)",
			lose: "😢 You lost!\n💸 -%1$ (Remaining: %2$)",
			even: "EVEN",
			odd: "ODD"
		}
	},

	onStart: async function ({ args, message, event, usersData, getLang, commandName }) {
		const { senderID } = event;

		// Kiểm tra input
		if (args.length < 2) {
			return message.reply(getLang("missingInput").replace("{pn}", `/${commandName}`));
		}

		// Lấy lựa chọn (chẵn/lẻ)
		const choice = args[0].toLowerCase();
		let userChoice;
		
		if (["chẵn", "chan", "c"].includes(choice)) {
			userChoice = "even";
		} else if (["lẻ", "le", "l"].includes(choice)) {
			userChoice = "odd";
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

		// Gửi tin nhắn đang tung xúc xắc
		await message.reply(getLang("rolling"));

		// Chờ 2 giây để tạo cảm giác hồi hộp
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Tung xúc xắc (1-6)
		const dice = Math.floor(Math.random() * 6) + 1;

		// Xác định kết quả (Chẵn: 2,4,6 - Lẻ: 1,3,5)
		const result = dice % 2 === 0 ? "even" : "odd";
		const resultText = result === "even" ? getLang("even") : getLang("odd");

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
		const finalMessage = getLang("result", dice, resultText, resultMessage);
		return message.reply(finalMessage);
	}
};
