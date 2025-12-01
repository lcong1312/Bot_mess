module.exports = {
	// Bạn có thể tùy chỉnh ngôn ngữ ở đây hoặc trực tiếp trong các file lệnh
	onlyadminbox: {
		description: "bật/tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Đã bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot",
			syntaxError: "Lỗi cú pháp, chỉ sử dụng {pn} on hoặc {pn} off"
		}
	},
	adduser: {
		description: "Thêm người dùng vào nhóm chat của bạn",
		guide: "   {pn} [link profile | uid]",
		text: {
			alreadyInGroup: "Đã có trong nhóm",
			successAdd: "- Đã thêm thành công %1 thành viên vào nhóm",
			failedAdd: "- Thêm %1 thành viên vào nhóm thất bại",
			approve: "- Đã thêm %1 thành viên vào danh sách phê duyệt",
			invalidLink: "Vui lòng nhập link facebook hợp lệ",
			cannotGetUid: "Không thể lấy uid của người dùng này",
			linkNotExist: "Link profile này không tồn tại",
			cannotAddUser: "Bot bị chặn hoặc người dùng này đã chặn người lạ thêm vào nhóm"
		}
	},
	admin: {
		description: "Thêm, xóa, chỉnh sửa quyền admin",
		guide: "   {pn} [add | -a] <uid>: Thêm quyền admin cho người dùng\n\t  {pn} [remove | -r] <uid>: Xóa quyền admin của người dùng\n\t  {pn} [list | -l]: Liệt kê tất cả admin",
		text: {
			added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng để thêm quyền admin",
			removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng để xóa quyền admin",
			listAdmin: "👑 | Danh sách admin:\n%1"
		}
	},
	adminonly: {
		description: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			syntaxError: "Lỗi cú pháp, chỉ sử dụng {pn} on hoặc {pn} off"
		}
	},
	all: {
		description: "Tag tất cả thành viên trong nhóm chat của bạn",
		guide: "{pn} [nội dung | để trống]"
	},
	anime: {
		description: "ảnh anime ngẫu nhiên",
		guide: "{pn} <endpoint>\n   Danh sách endpoint: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Đang khởi tạo ảnh, vui lòng đợi...",
			error: "Đã xảy ra lỗi, vui lòng thử lại sau"
		}
	},
	antichangeinfobox: {
		description: "Bật/tắt chống thay đổi thông tin nhóm",
		guide: "   {pn} avt [on | off]: chống thay đổi ảnh đại diện nhóm\n   {pn} name [on | off]: chống thay đổi tên nhóm\n   {pn} theme [on | off]: chống thay đổi chủ đề nhóm\n   {pn} emoji [on | off]: chống thay đổi emoji nhóm",
		text: {
			antiChangeAvatarOn: "Đã bật chống thay đổi ảnh đại diện nhóm",
			antiChangeAvatarOff: "Đã tắt chống thay đổi ảnh đại diện nhóm",
			missingAvt: "Bạn chưa đặt ảnh đại diện cho nhóm",
			antiChangeNameOn: "Đã bật chống thay đổi tên nhóm",
			antiChangeNameOff: "Đã tắt chống thay đổi tên nhóm",
			antiChangeThemeOn: "Đã bật chống thay đổi chủ đề nhóm",
			antiChangeThemeOff: "Đã tắt chống thay đổi chủ đề nhóm",
			antiChangeEmojiOn: "Đã bật chống thay đổi emoji nhóm",
			antiChangeEmojiOff: "Đã tắt chống thay đổi emoji nhóm",
			antiChangeAvatarAlreadyOn: "Nhóm của bạn hiện đang bật chống thay đổi ảnh đại diện",
			antiChangeNameAlreadyOn: "Nhóm của bạn hiện đang bật chống thay đổi tên",
			antiChangeThemeAlreadyOn: "Nhóm của bạn hiện đang bật chống thay đổi chủ đề",
			antiChangeEmojiAlreadyOn: "Nhóm của bạn hiện đang bật chống thay đổi emoji"
		}
	},
	appstore: {
		description: "Tìm kiếm ứng dụng trên appstore",
		text: {
			missingKeyword: "Bạn chưa nhập từ khóa",
			noResult: "Không tìm thấy kết quả nào cho từ khóa %1"
		}
	},
	autosetname: {
		description: "Tự động đổi biệt danh của thành viên mới",
		guide: "   {pn} set <biệt danh>: dùng để đặt cấu hình tự động đổi biệt danh, với một số phím tắt:\n   + {userName}: tên của thành viên mới\n   + {userID}: id thành viên\n   Ví dụ:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: dùng để bật/tắt tính năng này\n\n   {pn} [view | info]: xem cấu hình hiện tại",
		text: {
			missingConfig: "Vui lòng nhập cấu hình bắt buộc",
			configSuccess: "Cấu hình đã được đặt thành công",
			currentConfig: "Cấu hình autoSetName hiện tại trong nhóm chat của bạn là:\n%1",
			notSetConfig: "Nhóm của bạn chưa đặt cấu hình autoSetName",
			syntaxError: "Lỗi cú pháp, chỉ có thể sử dụng \"{pn} on\" hoặc \"{pn} off\"",
			turnOnSuccess: "Đã bật tính năng autoSetName",
			turnOffSuccess: "Đã tắt tính năng autoSetName",
			error: "Đã xảy ra lỗi khi sử dụng tính năng autoSetName, hãy thử tắt tính năng liên kết mời trong nhóm và thử lại sau"
		}
	},
	avatar: {
		description: "tạo avatar anime với chữ ký",
		guide: "{p}{n} <id nhân vật hoặc tên nhân vật> | <văn bản nền> | <chữ ký> | <tên màu nền hoặc mã màu hex>\n{p}{n} help: xem cách sử dụng lệnh này",
		text: {
			initImage: "Đang khởi tạo ảnh, vui lòng đợi...",
			invalidCharacter: "Hiện tại chỉ có %1 nhân vật trên hệ thống, vui lòng nhập id nhân vật nhỏ hơn",
			notFoundCharacter: "Không tìm thấy nhân vật có tên %1 trong danh sách nhân vật",
			errorGetCharacter: "Đã xảy ra lỗi khi lấy dữ liệu nhân vật:\n%1: %2",
			success: "✅ Avatar của bạn\nNhân vật: %1\nID: %2\nVăn bản nền: %3\nChữ ký: %4\nMàu: %5",
			defaultColor: "mặc định",
			error: "Đã xảy ra lỗi\n%1: %2"
		}
	},
	badwords: {
		description: "Bật/tắt/thêm/xóa cảnh báo từ cấm, nếu thành viên vi phạm sẽ bị cảnh báo, lần thứ hai sẽ bị kick khỏi nhóm",
		guide: "   {pn} add <từ>: thêm từ cấm (có thể thêm nhiều từ cách nhau bằng dấu phẩy \",\" hoặc dấu gạch đứng \"|\")\n   {pn} delete <từ>: xóa từ cấm (có thể xóa nhiều từ cách nhau bằng dấu phẩy \",\" hoặc dấu gạch đứng \"|\")\n   {pn} list <hide | để trống>: tắt cảnh báo (thêm \"hide\" để ẩn từ cấm)\n   {pn} unwarn [<userID> | <@tag>]: xóa 1 cảnh báo của 1 thành viên\n   {pn} on: bật cảnh báo\n   {pn} off: tắt cảnh báo",
		text: {
			onText: "bật",
			offText: "tắt",
			onlyAdmin: "⚠️ | Chỉ quản trị viên mới có thể thêm từ cấm vào danh sách",
			missingWords: "⚠️ | Bạn chưa nhập từ cấm",
			addedSuccess: "✅ | Đã thêm %1 từ cấm vào danh sách",
			alreadyExist: "❌ | %1 từ cấm đã tồn tại trong danh sách trước đó: %2",
			tooShort: "⚠️ | %1 từ cấm không thể thêm vào danh sách vì ngắn hơn 2 ký tự: %2",
			onlyAdmin2: "⚠️ | Chỉ quản trị viên mới có thể xóa từ cấm khỏi danh sách",
			missingWords2: "⚠️ | Bạn chưa nhập từ cần xóa",
			deletedSuccess: "✅ | Đã xóa %1 từ cấm khỏi danh sách",
			notExist: "❌ | %1 từ cấm không tồn tại trong danh sách trước đó: %2",
			emptyList: "⚠️ | Danh sách từ cấm trong nhóm của bạn hiện đang trống",
			badWordsList: "📑 | Danh sách từ cấm trong nhóm của bạn: %1",
			onlyAdmin3: "⚠️ | Chỉ quản trị viên mới có thể %1 tính năng này",
			turnedOnOrOff: "✅ | Cảnh báo từ cấm đã được %1",
			onlyAdmin4: "⚠️ | Chỉ quản trị viên mới có thể xóa cảnh báo từ cấm",
			missingTarget: "⚠️ | Bạn chưa nhập ID người dùng hoặc tag người dùng",
			notWarned: "⚠️ | Người dùng %1 chưa bị cảnh báo từ cấm",
			removedWarn: "✅ | Người dùng %1 | %2 đã được xóa 1 cảnh báo từ cấm",
			warned: "⚠️ | Từ cấm \"%1\" đã được phát hiện trong tin nhắn của bạn, nếu bạn tiếp tục vi phạm bạn sẽ bị kick khỏi nhóm.",
			warned2: "⚠️ | Từ cấm \"%1\" đã được phát hiện trong tin nhắn của bạn, bạn đã vi phạm 2 lần và sẽ bị kick khỏi nhóm.",
			needAdmin: "Bot cần quyền quản trị viên để kick thành viên bị cấm",
			unwarned: "✅ | Đã xóa cảnh báo từ cấm của người dùng %1 | %2"
		}
	},
	balance: {
		description: "xem số tiền của bạn hoặc của người được tag",
		guide: "   {pn}: xem số tiền của bạn\n   {pn} <@tag>: xem số tiền của người được tag",
		text: {
			money: "Bạn có %1$",
			moneyOf: "%1 có %2$"
		}
	},
	busy: {
		description: "bật chế độ không làm phiền, khi bạn được tag bot sẽ thông báo",
		guide: "   {pn} [để trống | <lý do>]: bật chế độ không làm phiền\n   {pn} off: tắt chế độ không làm phiền",
		text: {
			turnedOff: "✅ | Đã tắt chế độ không làm phiền",
			turnedOn: "✅ | Đã bật chế độ không làm phiền",
			turnedOnWithReason: "✅ | Đã bật chế độ không làm phiền với lý do: %1",
			alreadyOn: "Người dùng %1 hiện đang bận",
			alreadyOnWithReason: "Người dùng %1 hiện đang bận với lý do: %2"
		}
	},
	callad: {
		description: "gửi báo cáo, phản hồi, lỗi,... cho admin bot",
		guide: "   {pn} <tin nhắn>",
		text: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi cho admin",
			sendByGroup: "\n- Gửi từ nhóm: %1\n- ID nhóm: %2",
			sendByUser: "\n- Gửi từ người dùng",
			content: "\n\nNội dung:\n─────────────────\n%1\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn cho người dùng",
			success: "Đã gửi tin nhắn của bạn cho admin thành công!",
			reply: "📍 Phản hồi từ admin %1:\n─────────────────\n%2\n─────────────────\nPhản hồi tin nhắn này để tiếp tục gửi tin nhắn cho admin",
			replySuccess: "Đã gửi phản hồi của bạn cho admin thành công!",
			feedback: "📝 Phản hồi từ người dùng %1:\n- ID người dùng: %2%3\n\nNội dung:\n─────────────────\n%4\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn cho người dùng",
			replyUserSuccess: "Đã gửi phản hồi của bạn cho người dùng thành công!"
		}
	},
	cmd: {
		description: "Quản lý các file lệnh của bạn",
		guide: "{pn} load <tên file lệnh>\n{pn} loadAll\n{pn} install <url> <tên file lệnh>: Tải xuống và cài đặt file lệnh từ url, url là đường dẫn đến file (raw)",
		text: {
			missingFileName: "⚠️ | Vui lòng nhập tên lệnh bạn muốn tải lại",
			loaded: "✅ | Đã tải lệnh \"%1\" thành công",
			loadedError: "❌ | Tải lệnh \"%1\" thất bại với lỗi\n%2: %3",
			loadedSuccess: "✅ | Đã tải thành công \"%1\" lệnh",
			loadedFail: "❌ | Tải lệnh \"%1\" thất bại\n%2",
			missingCommandNameUnload: "⚠️ | Vui lòng nhập tên lệnh bạn muốn gỡ",
			unloaded: "✅ | Đã gỡ lệnh \"%1\" thành công",
			unloadedError: "❌ | Gỡ lệnh \"%1\" thất bại với lỗi\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Vui lòng nhập url hoặc code và tên file lệnh bạn muốn cài đặt",
			missingUrlOrCode: "⚠️ | Vui lòng nhập url hoặc code của file lệnh bạn muốn cài đặt",
			missingFileNameInstall: "⚠️ | Vui lòng nhập tên file để lưu lệnh (với đuôi .js)",
			invalidUrlOrCode: "⚠️ | Không thể lấy code lệnh",
			alreadExist: "⚠️ | File lệnh đã tồn tại, bạn có chắc chắn muốn ghi đè file lệnh cũ?\nReact tin nhắn này để tiếp tục",
			installed: "✅ | Đã cài đặt lệnh \"%1\" thành công, file lệnh được lưu tại %2",
			installedError: "❌ | Cài đặt lệnh \"%1\" thất bại với lỗi\n%2: %3",
			missingFile: "⚠️ | Không tìm thấy file lệnh \"%1\"",
			invalidFileName: "⚠️ | Tên file lệnh không hợp lệ",
			unloadedFile: "✅ | Đã gỡ lệnh \"%1\""
		}
	},
	count: {
		description: "Xem số tin nhắn của tất cả thành viên hoặc của bạn (kể từ khi bot tham gia nhóm)",
		guide: "   {pn}: dùng để xem số tin nhắn của bạn\n   {pn} @tag: dùng để xem số tin nhắn của người được tag\n   {pn} all: dùng để xem số tin nhắn của tất cả thành viên",
		text: {
			count: "Số tin nhắn của các thành viên:",
			endMessage: "Những người không có tên trong danh sách chưa gửi tin nhắn nào.",
			page: "Trang [%1/%2]",
			reply: "Phản hồi tin nhắn này với số trang để xem thêm",
			result: "%1 xếp hạng %2 với %3 tin nhắn",
			yourResult: "Bạn đang xếp hạng %1 và đã gửi %2 tin nhắn trong nhóm này",
			invalidPage: "Số trang không hợp lệ"
		}
	},
	daily: {
		description: "Nhận tiền hàng ngày",
		guide: "{pn}",
		text: {
			alreadyReceived: "Bạn đã nhận tiền hàng ngày rồi, vui lòng quay lại sau %1 giờ %2 phút %3 giây",
			received: "Bạn đã nhận %1$"
		}
	},
	eval: {
		description: "Test code nhanh",
		guide: "{pn} <code cần test>",
		text: {
			error: "❌ Đã xảy ra lỗi:"
		}
	},
	event: {
		description: "Quản lý các file lệnh sự kiện của bạn",
		guide: "{pn} load <tên file lệnh>\n{pn} loadAll\n{pn} install <url> <tên file lệnh>: Tải xuống và load lệnh sự kiện, url là đường dẫn đến file lệnh (raw)",
		text: {
			missingFileName: "⚠️ | Vui lòng nhập tên lệnh bạn muốn tải lại",
			loaded: "✅ | Đã tải lệnh sự kiện \"%1\" thành công",
			loadedError: "❌ | Tải lệnh sự kiện \"%1\" thất bại với lỗi\n%2: %3",
			loadedSuccess: "✅ | Đã tải lệnh sự kiện \"%1\" thành công",
			loadedFail: "❌ | Tải lệnh sự kiện \"%1\" thất bại\n%2",
			missingCommandNameUnload: "⚠️ | Vui lòng nhập tên lệnh bạn muốn gỡ",
			unloaded: "✅ | Đã gỡ lệnh sự kiện \"%1\" thành công",
			unloadedError: "❌ | Gỡ lệnh sự kiện \"%1\" thất bại với lỗi\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Vui lòng nhập url hoặc code và tên file lệnh bạn muốn cài đặt",
			missingUrlOrCode: "⚠️ | Vui lòng nhập url hoặc code của file lệnh bạn muốn cài đặt",
			missingFileNameInstall: "⚠️ | Vui lòng nhập tên file để lưu lệnh (với đuôi .js)",
			invalidUrlOrCode: "⚠️ | Không thể lấy code lệnh",
			alreadExist: "⚠️ | File lệnh đã tồn tại, bạn có chắc chắn muốn ghi đè file lệnh cũ?\nReact tin nhắn này để tiếp tục",
			installed: "✅ | Đã cài đặt lệnh sự kiện \"%1\" thành công, file lệnh được lưu tại %2",
			installedError: "❌ | Cài đặt lệnh sự kiện \"%1\" thất bại với lỗi\n%2: %3",
			missingFile: "⚠️ | Không tìm thấy file \"%1\"",
			invalidFileName: "⚠️ | Tên file không hợp lệ",
			unloadedFile: "✅ | Đã gỡ lệnh \"%1\""
		}
	},
	help: {
		description: "Xem cách sử dụng lệnh",
		guide: "{pn} [để trống | <số trang> | <tên lệnh>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Trang [ %2/%3 ]\n│ Hiện tại bot có %4 lệnh có thể sử dụng\n│ » Gõ %5help <số trang> để xem danh sách lệnh\n│ » Gõ %5help <tên lệnh> để xem chi tiết cách sử dụng lệnh đó\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Hiện tại bot có %2 lệnh có thể sử dụng\n│ » Gõ %3help <tên lệnh> để xem chi tiết cách sử dụng lệnh đó\n│ %4\n╰─────────────⭓",
			commandNotFound: "Lệnh \"%1\" không tồn tại",
			getInfoCommand: "╭── TÊN ────⭓\n│ %1\n├── THÔNG TIN\n│ Mô tả: %2\n│ Tên khác: %3\n│ Tên khác trong nhóm: %4\n│ Phiên bản: %5\n│ Quyền hạn: %6\n│ Thời gian chờ: %7s\n│ Tác giả: %8\n├── CÁCH DÙNG\n%9\n├── GHI CHÚ\n│ Nội dung bên trong <XXXXX> có thể thay đổi\n│ Nội dung bên trong [a|b|c] là a hoặc b hoặc c\n╰──────⭔",
			doNotHave: "Không có",
			roleText0: "0 (Tất cả người dùng)",
			roleText1: "1 (Quản trị viên nhóm)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (đã đặt quyền, tất cả người dùng)",
			roleText1setRole: "1 (đã đặt quyền, quản trị viên nhóm)",
			pageNotFound: "Trang %1 không tồn tại"
		}
	},
	kick: {
		description: "Kick thành viên ra khỏi nhóm chat",
		guide: "{pn} @tags: dùng để kick các thành viên được tag"
	},
	loadconfig: {
		description: "Tải lại cấu hình của bot"
	},
	notification: {
		description: "Gửi thông báo từ admin đến tất cả nhóm",
		guide: "{pn} <tin nhắn>",
		text: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả nhóm",
			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
			errorSendingNotification: "Đã xảy ra lỗi khi gửi đến %1 nhóm:\n %2"
		}
	},
	prefix: {
		description: "Thay đổi dấu lệnh của bot trong nhóm chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		guide: "   {pn} <dấu lệnh mới>: thay đổi dấu lệnh mới trong nhóm chat của bạn\n   Ví dụ:\n    {pn} #\n\n   {pn} <dấu lệnh mới> -g: thay đổi dấu lệnh mới trong hệ thống bot (chỉ admin bot)\n   Ví dụ:\n    {pn} # -g\n\n   {pn} reset: đặt lại dấu lệnh trong nhóm chat của bạn về mặc định",
		text: {
			reset: "Dấu lệnh của bạn đã được đặt lại về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi dấu lệnh của hệ thống bot",
			confirmGlobal: "Vui lòng react tin nhắn này để xác nhận thay đổi dấu lệnh của hệ thống bot",
			confirmThisThread: "Vui lòng react tin nhắn này để xác nhận thay đổi dấu lệnh trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi dấu lệnh của hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi dấu lệnh trong nhóm chat của bạn thành: %1",
			myPrefix: "🌐 Dấu lệnh hệ thống: %1\n🛸 Dấu lệnh nhóm chat của bạn: %2"
		}
	},
	rank: {
		description: "Xem cấp độ của bạn hoặc của người được tag. Bạn có thể tag nhiều người"
	},
	rankup: {
		description: "Bật/tắt thông báo lên cấp",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Lỗi cú pháp, chỉ sử dụng {pn} on hoặc {pn} off",
			turnedOn: "Đã bật thông báo lên cấp",
			turnedOff: "Đã tắt thông báo lên cấp",
			notiMessage: "🎉🎉 Chúc mừng bạn đã đạt cấp độ %1"
		}
	},
	refresh: {
		description: "làm mới thông tin của nhóm chat hoặc người dùng",
		guide: "   {pn} [thread | group]: làm mới thông tin của nhóm chat của bạn\n   {pn} group <threadID>: làm mới thông tin của nhóm chat theo ID\n\n   {pn} user: làm mới thông tin của người dùng của bạn\n   {pn} user [<userID> | @tag]: làm mới thông tin của người dùng theo ID",
		text: {
			refreshMyThreadSuccess: "✅ | Đã làm mới thông tin của nhóm chat của bạn thành công!",
			refreshThreadTargetSuccess: "✅ | Đã làm mới thông tin của nhóm chat %1 thành công!"
		}
	},
	restart: {
		description: "Khởi động lại bot",
		text: {
			restarting: "Đang khởi động lại bot..."
		}
	},
	rules: {
		description: "Tạo/xem/thêm/sửa/đổi vị trí/xóa nội quy nhóm của bạn",
		guide: "   {pn} [add | -a] <nội quy cần thêm>: thêm nội quy cho nhóm.\n   {pn}: xem nội quy nhóm.\n   {pn} [edit | -e] <n> <nội dung sau khi sửa>: sửa nội quy số n.\n   {pn} [move | -m] <stt1> <stt2> đổi vị trí của nội quy số <stt1> và <stt2>.\n   {pn} [delete | -d] <n>: xóa nội quy số n.\n   {pn} [remove | -r]: xóa tất cả nội quy của nhóm.\n\n   Ví dụ:\n    {pn} add không spam\n    {pn} move 1 3\n    {pn} -e 1 không spam tin nhắn trong nhóm\n    {pn} -r"
	},
	setlang: {
		description: "Đặt ngôn ngữ mặc định của bot cho nhóm chat hiện tại hoặc tất cả nhóm chat",
		guide: "   {pn} <mã ngôn ngữ ISO 639-1>\n   Ví dụ:    {pn} vi    {pn} en    {pn} ja",
		text: {
			setLangForAll: "Đã đặt ngôn ngữ mặc định cho tất cả nhóm chat: %1",
			setLangForCurrent: "Đã đặt ngôn ngữ mặc định cho nhóm chat hiện tại: %1",
			noPermission: "Chỉ admin bot mới có thể sử dụng lệnh này"
		}
	},
	thread: {
		description: "Quản lý nhóm chat trong hệ thống bot",
		guide: "   {pn} [find | -f | search | -s] <tên cần tìm>: tìm kiếm nhóm chat trong dữ liệu bot theo tên\n   {pn} [find | -f | search | -s] [-j | joined] <tên cần tìm>: tìm kiếm nhóm chat trong dữ liệu bot mà bot vẫn tham gia theo tên\n   {pn} [ban | -b] [<tid> | để trống] <lý do>: dùng để cấm nhóm với id <tid> hoặc nhóm hiện tại sử dụng bot\n   Ví dụ:\n    {pn} ban 3950898668362484 spam bot\n    {pn} ban spam quá nhiều\n    {pn} unban [<tid> | để trống] để bỏ cấm nhóm với id <tid> hoặc nhóm hiện tại",
		text: {
			noPermission: "Bạn không có quyền sử dụng tính năng này",
			found: "🔎 Tìm thấy %1 nhóm khớp với từ khóa \"%3\" trong dữ liệu bot:\n%3",
			notFound: "❌ Không tìm thấy nhóm nào khớp với từ khóa: \"%1\" trong dữ liệu bot",
			hasBanned: "Nhóm với id [%1 | %2] đã bị cấm trước đó:\n» Lý do: %3\n» Thời gian: %4",
			banned: "Đã cấm nhóm với id [%1 | %2] sử dụng bot.\n» Lý do: %3\n» Thời gian: %4",
			notBanned: "Nhóm với id [%1 | %2] không bị cấm sử dụng bot",
			unbanned: "Đã bỏ cấm nhóm với tid [%1 | %2] sử dụng bot",
			missingReason: "Lý do cấm không được để trống",
			info: "» ID nhóm: %1\n» Tên: %2\n» Ngày tạo dữ liệu: %3\n» Tổng thành viên: %4\n» Nam: %5 thành viên\n» Nữ: %6 thành viên\n» Tổng tin nhắn: %7%8"
		}
	},
	tid: {
		description: "Xem threadID của nhóm chat của bạn",
		guide: "{pn}"
	},
	translate: {
		description: "Dịch văn bản",
		guide: "{pn} <ngôn ngữ> <văn bản cần dịch>",
		text: {
			translateTo: "Dịch sang %1",
			invalidLanguage: "Ngôn ngữ không hợp lệ"
		}
	},
	uid: {
		description: "Xem facebook user id của người dùng",
		guide: "   {pn}: dùng để xem facebook user id của bạn\n   {pn} @tag: xem facebook user id của người được tag\n   {pn} <link profile>: xem facebook user id của link profile",
		text: {
			syntaxError: "Vui lòng tag người bạn muốn xem uid hoặc để trống để xem uid của chính bạn"
		}
	},
	unsend: {
		description: "Gỡ tin nhắn của bot",
		guide: "phản hồi tin nhắn bạn muốn gỡ và gọi lệnh {pn}",
		text: {
			syntaxError: "Vui lòng phản hồi tin nhắn bạn muốn gỡ"
		}
	},
	update: {
		description: "Cập nhật bot lên phiên bản mới nhất",
		text: {
			updating: "Đang cập nhật bot...",
			updated: "Đã cập nhật bot thành công"
		}
	},
	uptime: {
		description: "Xem thời gian bot đã hoạt động",
		text: {
			uptime: "Bot đã hoạt động được:\n%1"
		}
	},
	user: {
		description: "Quản lý người dùng trong hệ thống bot",
		guide: "   {pn} [find | -f | search | -s] <tên cần tìm>: tìm kiếm người dùng trong dữ liệu bot theo tên\n\n   {pn} [ban | -b] [<uid> | @tag | reply message] <lý do>: để cấm người dùng với id <uid> hoặc người dùng được tag hoặc người gửi tin nhắn được phản hồi sử dụng bot\n\n   {pn} unban [<uid> | @tag | reply message]: để bỏ cấm người dùng sử dụng bot",
		text: {
			noUserFound: "❌ Không tìm thấy người dùng nào có tên khớp với từ khóa: \"%1\" trong dữ liệu bot",
			userFound: "🔎 Tìm thấy %1 người dùng có tên khớp với từ khóa \"%2\" trong dữ liệu bot:\n%3",
			uidRequired: "Uid của người dùng cần cấm không được để trống, vui lòng nhập uid hoặc tag hoặc phản hồi tin nhắn của 1 người dùng bằng user ban <uid> <lý do>",
			reasonRequired: "Lý do cấm người dùng không được để trống, vui lòng nhập uid hoặc tag hoặc phản hồi tin nhắn của 1 người dùng bằng user ban <uid> <lý do>",
			userHasBanned: "Người dùng với id [%1 | %2] đã bị cấm trước đó:\n» Lý do: %3\n» Ngày: %4",
			userBanned: "Người dùng với id [%1 | %2] đã bị cấm:\n» Lý do: %3\n» Ngày: %4",
			uidRequiredUnban: "Uid của người dùng cần bỏ cấm không được để trống",
			userNotBanned: "Người dùng với id [%1 | %2] không bị cấm",
			userUnbanned: "Người dùng với id [%1 | %2] đã được bỏ cấm"
		}
	},
	warn: {
		description: "cảnh báo thành viên trong nhóm, nếu họ có 3 cảnh báo, họ sẽ bị cấm",
		guide: "   {pn} @tag <lý do>: cảnh báo thành viên\n   {pn} list: xem danh sách thành viên bị cảnh báo\n   {pn} listban: xem danh sách thành viên bị cấm\n   {pn} info [@tag | <uid> | để trống]: xem thông tin cảnh báo của thành viên được tag hoặc uid hoặc của chính bạn\n   {pn} unban <uid>: bỏ cấm thành viên theo uid\n   {pn} unwarn <uid> [<số cảnh báo> | để trống]: bỏ cảnh báo thành viên theo uid và số cảnh báo\n   {pn} warn reset: đặt lại tất cả dữ liệu cảnh báo\n⚠️ Bạn cần đặt admin cho bot để tự động kick thành viên bị cấm",
		text: {
			list: "Danh sách thành viên đã bị cảnh báo:\n%1\n\nĐể xem chi tiết các cảnh báo, sử dụng lệnh \"%2warn info [@tag | <uid> | để trống]\": để xem thông tin cảnh báo của người được tag hoặc uid hoặc của chính bạn",
			listBan: "Danh sách thành viên đã bị cảnh báo 3 lần và bị cấm khỏi nhóm:\n%1",
			listEmpty: "Nhóm của bạn không có thành viên nào bị cảnh báo",
			listBanEmpty: "Nhóm của bạn không có thành viên nào bị cấm khỏi nhóm",
			invalidUid: "Vui lòng nhập uid hợp lệ của người bạn muốn xem thông tin",
			noData: "Không có dữ liệu",
			noPermission: "❌ Chỉ quản trị viên nhóm mới có thể bỏ cấm thành viên bị cấm khỏi nhóm",
			invalidUid2: "⚠️ Vui lòng nhập uid hợp lệ của người bạn muốn bỏ cấm",
			notBanned: "⚠️ Người dùng với id %1 chưa bị cấm khỏi nhóm của bạn",
			unbanSuccess: "✅ Đã bỏ cấm thành công thành viên [%1 | %2], hiện tại người này có thể tham gia nhóm chat của bạn",
			noPermission2: "❌ Chỉ quản trị viên nhóm mới có thể xóa cảnh báo của thành viên trong nhóm",
			invalidUid3: "⚠️ Vui lòng nhập uid hoặc tag người bạn muốn xóa cảnh báo",
			noData2: "⚠️ Người dùng với id %1 không có dữ liệu cảnh báo",
			notEnoughWarn: "❌ Người dùng %1 chỉ có %2 cảnh báo",
			unwarnSuccess: "✅ Đã xóa thành công cảnh báo %1 của thành viên [%2 | %3]",
			noPermission3: "❌ Chỉ quản trị viên nhóm mới có thể đặt lại dữ liệu cảnh báo",
			resetWarnSuccess: "✅ Đã đặt lại dữ liệu cảnh báo thành công",
			noPermission4: "❌ Chỉ quản trị viên nhóm mới có thể cảnh báo thành viên trong nhóm",
			invalidUid4: "⚠️ Bạn cần tag hoặc phản hồi tin nhắn của người bạn muốn cảnh báo",
			warnSuccess: "⚠️ Đã cảnh báo thành viên %1 lần %2\n- Uid: %3\n- Lý do: %4\n- Ngày giờ: %5\nThành viên này đã bị cảnh báo 3 lần và bị cấm khỏi nhóm, để bỏ cấm sử dụng lệnh \"%6warn unban <uid>\" (với uid là uid của người bạn muốn bỏ cấm)",
			noPermission5: "⚠️ Bot cần quyền quản trị viên để kick thành viên bị cấm",
			warnSuccess2: "⚠️ Đã cảnh báo thành viên %1 lần %2\n- Uid: %3\n- Lý do: %4\n- Ngày giờ: %5\nNếu người này vi phạm thêm %6 lần nữa, họ sẽ bị cấm khỏi nhóm",
			hasBanned: "⚠️ Các thành viên sau đã bị cảnh báo 3 lần trước đó và bị cấm khỏi nhóm:\n%1",
			failedKick: "⚠️ Đã xảy ra lỗi khi kick các thành viên sau:\n%1"
		}
	},
	weather: {
		description: "xem dự báo thời tiết hiện tại và 5 ngày tới",
		guide: "{pn} <địa điểm>",
		text: {
			syntaxError: "Vui lòng nhập địa điểm",
			notFound: "Không tìm thấy địa điểm: %1",
			error: "Đã xảy ra lỗi: %1",
			today: "Thời tiết hôm nay:\n%1\n🌡 Nhiệt độ thấp - cao %2°C - %3°C\n🌡 Cảm giác như %4°C - %5°C\n🌅 Mặt trời mọc %6\n🌄 Mặt trời lặn %7\n🌃 Mặt trăng mọc %8\n🏙️ Mặt trăng lặn %9\n🌞 Ban ngày: %10\n🌙 Ban đêm: %11"
		}
	},
	taixiu: {
		description: "Chơi game tài xỉu",
		guide: "{pn} <tài/xỉu/t/x> <số tiền>\n   Ví dụ:\n    {pn} tài 100\n    {pn} t 500\n    {pn} xỉu 200\n    {pn} x 1000",
		text: {
			missingInput: "⚠️ Vui lòng nhập đầy đủ: {pn} <tài/xỉu> <số tiền>\nVí dụ: {pn} tài 100",
			invalidChoice: "⚠️ Vui lòng chọn 'tài' hoặc 'xỉu' (hoặc 't'/'x')",
			invalidAmount: "⚠️ Số tiền phải là số nguyên dương",
			minAmount: "⚠️ Số tiền đặt cược tối thiểu là 10$",
			notEnoughMoney: "⚠️ Bạn không đủ tiền! Số dư hiện tại: %1$",
			rolling: "🎲 Đang lắc xúc xắc...",
			result: "🎲 Kết quả: %1 - %2 - %3 = %4 điểm\n📊 Kết quả: %5\n━━━━━━━━━━━━━━━\n%6",
			win: "🎉 Chúc mừng! Bạn đã thắng!\n💰 +%1$ (Tổng: %2$)",
			lose: "😢 Bạn đã thua!\n💸 -%1$ (Còn lại: %2$)",
			tai: "TÀI (11-17 điểm)",
			xiu: "XỈU (4-10 điểm)"
		}
	},
	antileave: {
		description: "Chống thành viên tự rời nhóm",
		guide: "{pn} on: Bật chống rời nhóm\n   {pn} off: Tắt chống rời nhóm\n   {pn} [để trống]: Xem trạng thái hiện tại",
		text: {
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
		}
	},
	pay: {
		description: "Cộng/trừ tiền cho người dùng (chỉ admin bot)",
		guide: "{pn} <@tag | uid> <số tiền>\n   Ví dụ:\n    {pn} @tag 1000 (cộng 1000$)\n    {pn} @tag -500 (trừ 500$)\n    {pn} 100057376711750 5000",
		text: {
			missingTarget: "⚠️ Vui lòng tag người dùng hoặc nhập uid cần cộng/trừ tiền",
			missingAmount: "⚠️ Vui lòng nhập số tiền cần cộng/trừ\nVí dụ: {pn} @tag 1000 hoặc {pn} @tag -500",
			invalidAmount: "⚠️ Số tiền phải là số nguyên (khác 0)",
			success: "✅ Đã %1 %2$ %3 người dùng %4\n💰 Số dư mới: %5$",
			notFound: "⚠️ Không tìm thấy người dùng với ID: %1"
		}
	}
};
