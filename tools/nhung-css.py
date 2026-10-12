#!/usr/bin/env python3
"""Nhúng styles.css vào index.html (trang chủ) giữa 2 mốc CSS-CHINH.

Chạy từ gốc repo:  python3 tools/nhung-css.py
Chỉ kiểm, không ghi: python3 tools/nhung-css.py --kiem   (thoát 1 nếu lệch)
Thử trên bản sao:    python3 tools/nhung-css.py --thu-muc <thư-mục-có-index.html-và-styles.css>

Mã thoát: 0 xong/khớp · 1 --kiem thấy lệch · 2 lỗi mốc hoặc CSS không hợp lệ · 3 khoá đang bị giữ
Lý do nhúng: file CSS ngoài chặn lần vẽ đầu của Chrome headless (xem docs/plans/ke-hoach-toc-do-dot2-2026-10-12.md).
"""
import argparse
import os
import sys

BAT_DAU = "CSS-CHINH:BAT-DAU"
KET_THUC = "CSS-CHINH:KET-THUC"
MO_BAT_DAU = "<!-- " + BAT_DAU
MO_KET_THUC = "<!-- " + KET_THUC
KHOA = "/tmp/thenail-dung-gallery.lock"  # cùng khoá với bot/dung-gallery.py


def loi(ma, msg):
    print("LỖI: " + msg, file=sys.stderr)
    sys.exit(ma)


def doc(path):
    with open(path, encoding="utf-8", newline="") as f:
        return f.read()


def tinh_moi(html, css):
    if html.count(BAT_DAU) != 1 or html.count(KET_THUC) != 1:
        loi(2, "mỗi mốc %s và %s phải xuất hiện đúng 1 lần trong index.html (hiện: %d và %d). Không ghi gì."
            % (BAT_DAU, KET_THUC, html.count(BAT_DAU), html.count(KET_THUC)))
    i_bd = html.index(BAT_DAU)
    i_kt = html.index(KET_THUC)
    if i_bd > i_kt:
        loi(2, "mốc KET-THUC nằm trước mốc BAT-DAU. Không ghi gì.")
    if html.count(MO_BAT_DAU) != 1 or html.count(MO_KET_THUC) != 1:
        loi(2, "mốc phải có dạng '<!-- CSS-CHINH:... -->'. Không ghi gì.")
    if "</style" in css.lower():
        loi(2, "styles.css chứa '</style' — nhúng vào <style> sẽ vỡ trang. Không ghi gì.")
    i_mo_bd = html.index(MO_BAT_DAU)
    dau_kt = html.index(MO_KET_THUC)
    dong_bd = html.find("-->", i_mo_bd)
    if dong_bd == -1 or dong_bd > dau_kt:
        loi(2, "mốc BAT-DAU chưa đóng '-->' trước mốc KET-THUC. Không ghi gì.")
    dong_kt = html.find("-->", dau_kt)
    if dong_kt == -1 or "<" in html[dau_kt + 4:dong_kt]:
        loi(2, "mốc KET-THUC chưa đóng '-->'. Không ghi gì.")
    cuoi_bd = dong_bd + 3
    giua = '\n  <style id="css-chinh">' + css + "</style>\n  "
    return html[:cuoi_bd] + giua + html[dau_kt:]


def main():
    ap = argparse.ArgumentParser(description="Nhúng styles.css vào index.html giữa 2 mốc CSS-CHINH.")
    ap.add_argument("--kiem", action="store_true", help="chỉ kiểm, không ghi (thoát 1 nếu lệch)")
    ap.add_argument("--thu-muc", default=".", help="thư mục chứa index.html và styles.css (mặc định: thư mục hiện tại)")
    a = ap.parse_args()  # sai tham số → argparse thoát mã 2
    p_html = os.path.join(a.thu_muc, "index.html")
    p_css = os.path.join(a.thu_muc, "styles.css")
    if a.kiem:
        moi = tinh_moi(doc(p_html), doc(p_css))
        if moi == doc(p_html):
            print("đã khớp")
            return 0
        print("LỆCH: phần nhúng trong index.html khác styles.css — chạy: python3 tools/nhung-css.py", file=sys.stderr)
        return 1
    # Lấy khoá TRƯỚC khi đọc, giữ tới sau os.replace — để không ghi đè ảnh bot gallery vừa chèn.
    try:
        fd = os.open(KHOA, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
    except FileExistsError:
        loi(3, "khoá %s đang có (bot gallery hoặc lần chạy khác đang ghi). Thử lại sau." % KHOA)
    try:
        os.write(fd, str(os.getpid()).encode())
        os.close(fd)
        html = doc(p_html)
        css = doc(p_css)
        moi = tinh_moi(html, css)
        if moi == html:
            print("đã khớp, không ghi")
            return 0
        tam = p_html + ".nhung-css.tmp"
        with open(tam, "w", encoding="utf-8", newline="") as f:
            f.write(moi)
        os.replace(tam, p_html)
        print("đã nhúng styles.css vào index.html (%d byte CSS)" % len(css.encode("utf-8")))
    finally:
        try:
            os.unlink(KHOA)
        except FileNotFoundError:
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
