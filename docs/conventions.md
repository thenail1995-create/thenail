# Conventions — Ranh giới

> File này ghi **ranh giới không được vượt** và **lý do**.
> Nó không ghi các bước thao tác — cách làm là việc của người thực thi.
>
> Trạng thái hiện tại của web nằm trong `index.html`, không nằm ở đây.

## Ranh giới thương hiệu

- Không tự đổi slogan, tên tiệm, hay 3 giá trị cốt lõi
- Không thêm emoji vào UI, slogan, nav, footer
- Không phủ chữ hay giá lên ảnh nail — ảnh là tác phẩm
- Không đổi hệ màu tổng thể hay bộ font (Cormorant Garamond + Inter)
- Không dùng lời giật gân: "GIẢM SỐC", "Giá rẻ bất ngờ", "Free 100%"
  — đi ngược tinh thần tiệm

## Ranh giới nội dung

Đây là web của doanh nghiệp thật. Sai dữ liệu thì khách đi lạc hoặc mất khách.

- Không tự đổi địa chỉ, số điện thoại, giờ mở cửa
- Không tự thêm hay xoá mức giá
- Không tự thay review, và **tuyệt đối không tự sinh review giả**
- Cần một dữ kiện của tiệm thì đọc `index.html`, đừng lấy từ trí nhớ

## Ranh giới kỹ thuật

- Giữ kiến trúc một file: không tách CSS/JS ra ngoài
- Không thêm framework, không thêm build step, không thêm npm/yarn
- Không thêm dependency CDN ngoài nếu chưa thật cần
- Không thêm analytics, tracking, cookie banner hay popup khi chưa hỏi
- Không force push lên `main`

## Ranh giới riêng tư

Repo này **chính là web root**. File commit lên đọc được công khai tại
`thenail.vn/<tên-file>`. Trước khi commit file mới, tự hỏi:
*người lạ đọc được file này có sao không?*

Ghi chú nội bộ để trong thư mục bắt đầu bằng dấu chấm (`.claude/`) —
Jekyll không publish những thư mục đó.

## Git

- `main` là nhánh deploy: push lên là web đổi ngay. Nhánh phụ + pull request
  dùng khi muốn xem lại trước khi lên sóng.
- Commit message: tiếng Anh, imperative mood, nói rõ **vì sao** chứ không chỉ *cái gì*
  - Tốt: `Fix stale shop address in brand docs`
  - Kém: `update file`

## Khi nào cập nhật `docs/`

Cập nhật khi **quy ước hoặc định hướng đổi** — không phải mỗi lần sửa code:

- Có quy ước mới, hoặc rebrand
- Có asset quan trọng mới (vd thêm folder ảnh Drive)
- Rút được bài học từ thử nghiệm (vd thử màu X, chị Ngọc không thích)

Không cập nhật cho: đổi ảnh, sửa typo, fix bug nhỏ, tinh chỉnh CSS thông thường.

> Docs mô tả chi tiết kỹ thuật sẽ mục ruỗng. Bảng màu trong `docs/design.md`
> từng trễ hai lần redesign, địa chỉ trong `docs/brand.md` từng là cơ sở cũ.
> Ghi *lý do*, đừng ghi *state*.
