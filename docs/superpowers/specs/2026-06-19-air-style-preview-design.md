# The Nail — Thiết kế bản thử nghiệm theo phong cách Air

## Mục tiêu

Tạo một trang thử nghiệm độc lập, tái hiện sát ngôn ngữ bố cục, nhịp chuyển
động, cách hiển thị responsive và không khí thị giác của trang chủ
`air.inc`, đồng thời thay toàn bộ nội dung sản phẩm của Air bằng nội dung đã
được duyệt của The Nail.

Bản thử nghiệm không được sửa hoặc thay thế file `index.html` đang chạy chính
thức.

## Sản phẩm bàn giao

- Tạo file độc lập mới: `air-style-preview.html`
- Toàn bộ HTML, CSS và JavaScript thuần nằm trong một file
- Giữ nguyên `index.html` và mọi hoạt động của website chính thức
- Tái sử dụng ảnh, thông tin tiệm, bảng giá, slogan và đường dẫn liên hệ hiện có
  của The Nail
- Không có bước build, framework, công cụ phân tích, thông báo cookie hoặc lưu
  trữ dữ liệu

## Thứ tự ưu tiên của nguồn tham khảo

1. `https://air.inc/` là nguồn tham khảo chính về giao diện và chuyển động.
2. Trang hướng dẫn phong cách Air trên Refero cung cấp token và nguyên tắc
   thiết kế để triển khai.
3. Các file hiện có của dự án The Nail là nguồn chính xác cho nội dung kinh
   doanh và hình ảnh.

Phần triển khai sẽ tái tạo trải nghiệm tham khảo nhưng không sao chép mã nguồn,
logo, giao diện sản phẩm hoặc tài nguyên độc quyền của Air. Hình ảnh bầu trời,
mây và vật thể kính trong suốt sẽ được dựng mới bằng CSS, SVG, canvas, gradient
hoặc tài nguyên mới được tạo riêng.

## Hệ thống hình ảnh

### Màu sắc và bề mặt

- Màu xanh bầu trời là không khí chủ đạo trên toàn trang.
- Bề mặt trắng và kính mờ trong suốt tạo độ tương phản cho nội dung.
- Chỉ dùng một màu xanh lam nổi bật cho viền tương tác và trạng thái đang chọn.
- Hạn chế bóng đổ; chiều sâu được tạo bằng blur, đường viền, độ trong suốt và
  màu bề mặt.

### Kiểu chữ

- Chữ chức năng dùng font sans-serif hiện đại, rõ ràng.
- Chữ lớn ở hero dùng font cô đọng, kích thước rất lớn.
- Một số câu mang tính biên tập dùng font viết tay giàu biểu cảm.
- Kích thước chữ thay đổi linh hoạt bằng `clamp()` để giữ cảm giác phóng đại
  giống Air mà không gây tràn ngang màn hình.

### Hình khối và khoảng cách

- Ảnh và khối nội dung dùng bo góc khoảng 11–14px.
- Nút có viền mảnh, kiểu gọn, bo góc 8px hoặc dạng viên thuốc.
- Các section tràn toàn chiều rộng, có nhiều khoảng thở và lưới nội dung được
  kiểm soát rõ ràng.

## Cấu trúc trang

### 1. Thanh điều hướng cố định

Thanh điều hướng trong suốt hoặc kính mờ, nằm trên cảnh mở đầu như Air.

- Logo: The Nail
- Liên kết: Mẫu nail, Dịch vụ, Bảng giá, Về tiệm
- Hành động phụ: Instagram
- Hành động chính: Đặt lịch
- Trên điện thoại: logo gọn, nút đặt lịch và menu mở rộng

### 2. Hero bầu trời toàn màn hình

Phần mở đầu được giữ sát tinh thần của Air:

- Bầu trời xanh và những đám mây mềm, kích thước lớn
- Các dải ống hoặc vật thể kính trong suốt chuyển động trong khung cảnh
- Chữ `THE NAIL` rất lớn
- Câu thương hiệu: `your concept, my creation`
- Slogan tiếng Việt: `Ý tưởng bạn trao — Nghệ thuật tôi tạo`
- Nút viền để đặt lịch và xem mẫu nail

Hero có nhiều lớp chiều sâu, chuyển động tự động chậm, parallax theo con trỏ
trên máy tính phù hợp và phiên bản tĩnh nhẹ hơn trên điện thoại.

### 3. Bộ chọn ba trạng thái theo phong cách Air

Cụm `Organize / Approve / Multiply` của Air được chuyển thành hành trình của
khách hàng tại The Nail:

- Khám phá
- Chọn mẫu
- Đặt lịch

Mỗi trạng thái thay đổi bố cục ảnh và phần mô tả ngắn đi kèm. Cách tương tác
vẫn giống Air nhưng nội dung phản ánh đúng quy trình của tiệm.

### 4. Khu trưng bày mẫu nail

Phần kể chuyện về tính năng sản phẩm của Air được chuyển thành gallery nail:

- Tiêu đề lớn mang phong cách tạp chí
- Bộ lọc theo các khoảng giá hiện có của The Nail
- Ảnh nail sạch, không chèn chữ hoặc giá lên ảnh
- Xen kẽ ảnh lớn và bề mặt thông tin kính mờ
- Hiệu ứng xuất hiện, phóng nhẹ và chuyển ảnh giống nhịp của Air
- Lightbox chỉ hiển thị ảnh

### 5. Khu dịch vụ tương tác

Các tab tính năng và bảng sản phẩm của Air được chuyển thành nhóm dịch vụ:

- Chăm sóc nền móng
- Gel và hiệu ứng
- Vẽ design thủ công
- Nối và tạo phom

Mỗi nhóm dùng nội dung và khoảng giá thật của The Nail. Khi chuyển tab, bảng
nội dung thay đổi bằng hiệu ứng blur, opacity và di chuyển dọc nhẹ.

### 6. Giá trị thương hiệu và câu chuyện tiệm

Các khối tính năng cỡ lớn của Air được chuyển thành ba giá trị cố định:

- Cá nhân hoá
- Sáng tạo
- Tỉ mỉ

Section giữ kiểu chữ lớn xen kẽ, bề mặt bầu trời rộng và chuyển động ảnh liên
kết với thao tác cuộn trang.

### 7. Tổng quan bảng giá

Giữ nguyên các dịch vụ và mức giá hiện tại, trình bày lại bằng lưới module theo
phong cách Air. Không tự tạo hoặc thay đổi giá. Khách chưa chắc về chi phí sẽ
được hướng dẫn gửi ảnh mẫu qua Zalo để tư vấn.

### 8. Khu chuyển đổi đặt lịch

Form nhận tư vấn cuối trang của Air được chuyển thành form đặt lịch:

- Tên khách hàng
- Số điện thoại
- Ngày và giờ mong muốn
- Dịch vụ hoặc khoảng giá
- Yêu cầu thêm nếu có

Form không lưu thông tin. Khi gửi, trang sẽ soạn sẵn nội dung hiện tại và mở
kênh Zalo đang dùng của The Nail.

### 9. Thông tin liên hệ và footer

- Đúng địa chỉ, số điện thoại, giờ mở cửa và các liên kết mạng xã hội
- Câu kết cỡ lớn theo phong cách Air
- Điều hướng footer gọn
- Nút đặt lịch cố định trên điện thoại

## Hệ thống chuyển động

- Giữ thao tác cuộn tự nhiên, không chiếm quyền điều khiển cuộn trang
- Dùng `requestAnimationFrame` cho chuyển động liên kết với vị trí cuộn
- Dùng Intersection Observer để kích hoạt section và chữ xuất hiện
- Hero có parallax nhiều lớp và vật thể kính trôi nhẹ
- Nội dung tab chuyển bằng crossfade
- Thẻ gallery xuất hiện bằng hiệu ứng cắt khung và phóng nhẹ
- Thanh điều hướng đổi bề mặt sau khi rời khỏi hero
- Nút có hiệu ứng hút hoặc đi theo con trỏ nhẹ, chỉ áp dụng trên thiết bị có
  chuột chính xác
- Khi người dùng bật `prefers-reduced-motion: reduce`, các chuyển động tự động
  và chuyển động theo scroll sẽ được tắt
- Thiết bị cảm ứng dùng ít hiệu ứng hơn và không phụ thuộc vào con trỏ

Chuyển động phải mềm, có chiều sâu và thoáng. Không trích xuất mã hiệu ứng của
Air; thời gian và easing sẽ được dựng lại qua quan sát.

## Responsive

- Ưu tiên trải nghiệm và quy trình đặt lịch trên điện thoại
- Hero phải hiển thị đầy đủ trên điện thoại nhỏ, không che mất nút hành động
- Chữ cỡ lớn tự thu nhỏ an toàn
- Giảm bớt các lớp hình ảnh nặng dưới 700px
- Gallery hiển thị hai cột trên điện thoại thông thường, chỉ chuyển một cột khi
  màn hình quá hẹp
- Bảng dịch vụ và bảng giá xếp dọc trên màn hình nhỏ
- Vùng bấm tối thiểu 44px
- Không có nội dung nào chỉ xem được bằng hover

## Quy tắc nội dung

- Giữ nguyên từng chữ của hai slogan đã duyệt và ba giá trị thương hiệu.
- Giữ nguyên địa chỉ, số điện thoại, giờ mở cửa, tài khoản mạng xã hội và các
  khoảng giá hiện tại.
- Giữ nguyên quy tắc không chèn chữ hoặc giá lên ảnh nail.
- Không thêm review, ưu đãi, giảm giá hoặc tuyên bố kinh doanh không có nguồn.
- Tiếng Việt là ngôn ngữ chính; các câu thương hiệu tiếng Anh ngắn đã được
  duyệt có thể giữ lại.

## Giới hạn kỹ thuật

- Một file HTML độc lập, CSS và JavaScript viết trực tiếp trong file
- Tái sử dụng các URL ảnh công khai hiện tại trên Google
- Có thể dùng SVG, CSS hoặc canvas tự tạo cho hình ảnh bầu trời và vật thể
- Chỉ dùng font ngoài nếu phù hợp với cấu trúc website tĩnh hiện tại và phải có
  font dự phòng ổn định
- Không dùng GSAP, Lenis, React, Vue, Tailwind, npm hoặc công cụ build
- Không sửa bất kỳ file website chính thức nào trong lúc làm bản thử nghiệm

## Kiểm thử

Bản thử nghiệm sẽ được kiểm tra ở các kích thước:

- Máy tính: 1440×900 và 1280×720
- Máy tính bảng: 768×1024
- Điện thoại: 390×844 và 375×667

Các điều kiện nghiệm thu:

- Không có lỗi console
- Thanh điều hướng, tab, bộ lọc gallery, lightbox, menu và thao tác đặt lịch
  đều hoạt động
- Zalo và mạng xã hội dùng đúng liên kết hiện có
- Không tràn ngang màn hình
- Chế độ giảm chuyển động vẫn sử dụng tốt
- Ảnh bên dưới màn hình đầu tiên được lazy-load
- File `index.html` chính thức không thay đổi
- Trang truyền tải đúng nội dung The Nail nhưng nhìn rõ ràng giống Air về bố
  cục tổng thể, không khí, ngôn ngữ component và đặc tính chuyển động

## Ngoài phạm vi

- Thay thế trang chủ chính thức
- Deploy hoặc push bản thử nghiệm
- Sao chép mã nguồn hoặc tài nguyên độc quyền của Air
- Lưu dữ liệu đặt lịch ở backend
- Thêm giá, review, chương trình khuyến mãi hoặc tuyên bố kinh doanh mới
- Làm thêm trang con hoặc chuyển đổi sang framework
