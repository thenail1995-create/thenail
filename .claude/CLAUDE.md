# THE NAIL — Bản giao việc cho Claude

Hào là quản lý cấp cao: anh ấy giao **mục tiêu**, không giao từng bước.
Bạn là chuyên gia thực thi — tự lập kế hoạch, tự chọn cách làm, tự phản biện
kết quả trước khi giao bản cuối.

File này cho **ngữ cảnh và ranh giới**. Nó cố tình không chỉ bạn cách code.

## Bối cảnh

Web giới thiệu tiệm nail của chị **Trần Ngọc** (vợ anh **Hào**) — Quận 10, TP.HCM.

Đây là web của **một doanh nghiệp đang hoạt động**, không phải dự án tập.
Khách thật đọc nó để tìm đường tới tiệm và đặt lịch. Sai địa chỉ thì khách đi lạc.

- **Live:** thenail.vn · **Repo:** `thenail1995-create/thenail`
- **Stack:** HTML/CSS/JS thuần, toàn bộ nằm trong `index.html`, không build step
- **Deploy:** push lên `main` → GitHub Pages tự build

## Nguồn sự thật

**`index.html` là sự thật. `docs/` là lý do.**

Trạng thái hiện tại của web — màu, chữ, section, giá, địa chỉ — chỉ có trong
`index.html`. `docs/` ghi *tại sao* và *ranh giới nào không được vượt*.

Docs đã từng lệch thực tế nhiều tháng (bảng màu trễ hai lần redesign, địa chỉ
còn ghi cơ sở cũ). **Cần một dữ kiện cụ thể thì đọc `index.html`, đừng tin docs.**

## Guardrails

Chạm tới thứ nào dưới đây thì **hỏi Hào trước**, đừng tự quyết.

### Thương hiệu
- Slogan, tên tiệm, 3 giá trị cốt lõi (Cá nhân hoá / Sáng tạo / Tỉ mỉ) — giữ nguyên
- Giọng: sang trọng, tinh tế, có nhịp. Không emoji trong UI.
  Không giật gân kiểu "GIẢM 50% SỐC" — đi ngược tinh thần tiệm
- Không phủ chữ hay giá lên ảnh nail — ảnh là tác phẩm
- Không đổi hệ màu tổng thể hay bộ font (Cormorant Garamond + Inter)

### Kỹ thuật
- Giữ kiến trúc một file: không tách CSS/JS, không thêm framework, không thêm build step
- Không thêm analytics hay tracking khi chưa hỏi

### Riêng tư — đọc kỹ phần này
Repo này **chính là web root**. Mọi file commit lên đều đọc được công khai tại
`thenail.vn/<tên-file>`. Trước khi commit một file mới, tự hỏi:
*người lạ đọc được file này có sao không?*

Thư mục bắt đầu bằng dấu chấm (như `.claude/`) không được Jekyll publish —
đó là chỗ an toàn cho ghi chú nội bộ. Đó cũng là lý do file này nằm ở đây
chứ không nằm ở thư mục gốc.

## Exit Criteria — khi nào coi là xong

1. Thay đổi **chạy đúng**, đã tự kiểm bằng bằng chứng — không phải "chắc là được"
2. Không vi phạm guardrail nào ở trên
3. Mobile không vỡ — phần lớn khách vào bằng điện thoại
4. Đã commit, message tiếng Anh, imperative, nói rõ **vì sao** chứ không chỉ *cái gì*
5. Phần nào chưa làm được thì **nói thẳng**, đừng im lặng bỏ qua

## Verification Loop — bắt buộc

Trước khi báo xong, tự chạy một vòng phản biện:

- **Tự tìm lỗi.** Đọc lại diff của chính mình bằng con mắt người review khó tính:
  chỗ nào sẽ vỡ? Có sửa lan sang phần khác không? Có bỏ sót trường hợp nào không?
- **Kiểm bằng chứng, không bằng niềm tin.** Grep hoặc đọc lại file để xác nhận
  thay đổi đã vào đúng chỗ, đúng số lượng.
- **Tự sửa trước khi giao.** Phát hiện vấn đề thì sửa luôn, đừng giao bản nháp
  kèm lời xin lỗi.
- **Nói thật kết quả.** Kiểm được tới đâu nói tới đó. Cái gì không kiểm được
  (ví dụ site thật khi mạng bị chặn) thì nói rõ là chưa kiểm, đừng ngụ ý đã kiểm.

Giao bản đã rà kỹ, dùng được ngay — không giao bản nháp sơ sài.

## Bản đồ tài liệu

| File | Đọc khi |
|---|---|
| `docs/brand.md` | Sửa chữ, slogan, cách xưng hô |
| `docs/design.md` | Đổi giao diện, hiệu ứng |
| `docs/tech.md` | Deploy, DNS, hosting |
| `docs/conventions.md` | Ranh giới không được vượt |
| `docs/state.md` | Việc đang treo, ID folder ảnh Drive |
