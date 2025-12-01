module.exports = {
	// Bạn có thể tùy chỉnh ngôn ngữ ở đây hoặc trực tiếp trong các file sự kiện
	antileave: {
		text: {
			addedBack: "🔄 %1 đã tự rời nhóm và đã được thêm lại!\n(Chế độ chống rời nhóm đang bật)",
			cantAddBack: "⚠️ %1 đã tự rời nhóm nhưng không thể thêm lại.\nLý do: Người dùng đã chặn bot hoặc chặn người lạ thêm vào nhóm."
		}
	},
	autoUpdateThreadInfo: {},
	checkwarn: {
		text: {
			warn: "Thành viên %1 đã bị cảnh báo 3 lần trước đó và đã bị cấm khỏi nhóm chat\n- Tên: %1\n- Uid: %2\n- Để bỏ cấm, vui lòng sử dụng lệnh \"%3warn unban <uid>\" (với uid là uid của người bạn muốn bỏ cấm)",
			needPermission: "Bot cần quyền quản trị viên để kick thành viên bị cấm"
		}
	},
	leave: {
		text: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "đã rời khỏi nhóm",
			leaveType2: "đã bị kick khỏi nhóm"
		}
	},
	logsbot: {
		text: {
			title: "====== Nhật ký Bot ======",
			added: "\n✅\nSự kiện: bot đã được thêm vào nhóm mới\n- Được thêm bởi: %1",
			kicked: "\n❌\nSự kiện: bot đã bị kick\n- Bị kick bởi: %1",
			footer: "\n- ID người dùng: %1\n- Nhóm: %2\n- ID nhóm: %3\n- Thời gian: %4"
		}
	},
	onEvent: {},
	welcome: {
		text: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh, hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn"
		}
	}
};
