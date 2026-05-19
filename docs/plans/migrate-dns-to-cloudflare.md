# Plan: Migrate DNS from ZoneDNS to Cloudflare

> **Goal:** Move DNS management for `thenail.vn` from ZoneDNS (Nhân Hòa default) to Cloudflare
> để fix lỗi DNS intermittent `DNS_PROBE_FINISHED_NXDOMAIN`.
>
> **Trạng thái:** Pending — chờ user cung cấp Cloudflare API token.
>
> **Thực thi bởi:** Bất kỳ agent có Bash + curl + jq (Claude Code, Codex, etc.)
>
> **Đọc trước:** `CLAUDE.md`, `docs/tech.md` (phần DNS), `docs/state.md`

---

## 📋 Tóm tắt context

- **Domain:** `thenail.vn` (mua tại Nhân Hòa, hiện dùng ZoneDNS)
- **Hosting:** GitHub Pages (`thenail1995-create.github.io/thenail`)
- **Cert HTTPS:** Đã có (Let's Encrypt, auto qua GitHub Pages)
- **DNS records cần migrate** (5 records):

  | Type | Name | Value | TTL |
  |---|---|---|---|
  | A | `@` (apex) | `185.199.108.153` | Auto |
  | A | `@` (apex) | `185.199.109.153` | Auto |
  | A | `@` (apex) | `185.199.110.153` | Auto |
  | A | `@` (apex) | `185.199.111.153` | Auto |
  | CNAME | `www` | `thenail1995-create.github.io.` | Auto |

## 🔧 Pre-requisites (user phải làm trước)

User phải cung cấp **1 trong 2** sau đây và paste vào chat:

### Option A (preferred): API Token
- Đăng ký account Cloudflare free → https://dash.cloudflare.com/sign-up
- Vào: https://dash.cloudflare.com/profile/api-tokens
- Click "Create Token" → chọn template **"Edit zone DNS"** → "Use template"
- Zone Resources: **All zones**
- Continue → Create Token → copy token (chuỗi ~40 ký tự)
- Lưu thành ENV var: `export CF_API_TOKEN="<token>"`

### Option B (fallback): Global API Key
- Cùng URL trên, scroll xuống "API Keys" → Global API Key → View → copy
- Lưu 2 ENV vars:
  - `export CF_EMAIL="<email Cloudflare>"`
  - `export CF_API_KEY="<global key>"`

## 🚀 Steps thực hiện

### Step 1: Verify credentials work

```bash
# Option A: API Token
curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" | jq

# Option B: Global API Key
curl -s -X GET "https://api.cloudflare.com/client/v4/user" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" | jq
```

Expected: `"success": true`. Nếu fail → báo user check lại token/key.

### Step 2: Get Account ID

```bash
# Option A
ACCOUNT_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[0].id')

# Option B
ACCOUNT_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" | jq -r '.result[0].id')

echo "Account ID: $ACCOUNT_ID"
```

Save Account ID for later use.

### Step 3: Add zone `thenail.vn` to Cloudflare

```bash
ZONE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "thenail.vn",
    "account": {"id": "'"$ACCOUNT_ID"'"},
    "type": "full"
  }')

ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result.id')
NAMESERVERS=$(echo "$ZONE_RESPONSE" | jq -r '.result.name_servers[]')

echo "Zone ID: $ZONE_ID"
echo "Nameservers to set at Nhân Hòa:"
echo "$NAMESERVERS"
```

**Edge case:** Nếu zone đã tồn tại (vd đã add từ trước), response sẽ báo lỗi. Lấy zone ID hiện có:

```bash
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=thenail.vn" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[0].id')
NAMESERVERS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result.name_servers[]')
```

### Step 4: Create 5 DNS records

```bash
# 4 A records cho apex
for IP in 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153; do
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{
      \"type\": \"A\",
      \"name\": \"thenail.vn\",
      \"content\": \"$IP\",
      \"ttl\": 1,
      \"proxied\": false,
      \"comment\": \"GitHub Pages\"
    }" | jq '{success, errors, result: {name, content, type}}'
done

# CNAME cho www
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "www",
    "content": "thenail1995-create.github.io",
    "ttl": 1,
    "proxied": false,
    "comment": "GitHub Pages www"
  }' | jq '{success, errors, result: {name, content, type}}'
```

**Important:** Set `"proxied": false` cho tất cả records (vì GitHub Pages đã có HTTPS cert riêng — nếu bật proxy của Cloudflare sẽ conflict).

### Step 5: Verify records created

```bash
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq '.result[] | {name, type, content, proxied}'
```

Should see 5 records: 4 A + 1 CNAME.

### Step 6: Output instructions for user

Print rõ:

```
✅ Cloudflare đã setup xong!

Bước cuối cùng (BẠN làm thủ công ở Nhân Hòa):

1. Đăng nhập https://customer.nhanhoa.com
2. Vào "Quản lý theo dịch vụ" → "Tên miền" → click thenail.vn
3. Tìm phần "Nameservers" / "DNS Servers" — đang là:
   - ns1.zonedns.vn
   - ns2.zonedns.vn
   - ns3.zonedns.vn
4. Đổi sang 2 nameservers Cloudflare:
   - <NAMESERVER_1>
   - <NAMESERVER_2>
5. Save / Lưu

Đợi 1-24h cho DNS propagate.

Sau khi DNS đã chuyển:
- web vẫn hoạt động bình thường (vì DNS records đã sync)
- không gặp lỗi DNS_PROBE_FINISHED_NXDOMAIN nữa
- web load nhanh hơn (Cloudflare CDN)
```

### Step 7: (Optional) Monitor propagation

```bash
# Check nameserver change đã propagate chưa
until dig +short NS thenail.vn @8.8.8.8 | grep -q cloudflare; do
  echo "Waiting for nameserver to propagate..."
  sleep 60
done
echo "✅ Cloudflare NS active"

# Check A records
dig +short A thenail.vn @8.8.8.8
# Expected: 185.199.108.153 (và 3 IP khác)

# Test HTTPS
curl -I -sk --max-time 10 https://thenail.vn | head -3
# Expected: HTTP/2 200
```

### Step 8: Update docs

Sau khi xác nhận DNS active qua Cloudflare:

1. Update `docs/tech.md`:
   - Đổi section "DNS" từ ZoneDNS sang Cloudflare
   - Update nameservers list

2. Update `docs/state.md`:
   - Mark task "Migrate DNS sang Cloudflare" as done
   - Add credentials note: API token name + ngày tạo

3. Commit:
   ```bash
   cd /Users/nguyenchihao/Desktop/thenail-website
   git add docs/
   git commit -m "Update docs: DNS migrated from ZoneDNS to Cloudflare"
   git push
   ```

## 🚨 Rollback plan (nếu lỗi)

Nếu sau migration web bị down:

1. Vào Nhân Hòa → đổi nameservers lại về ZoneDNS:
   - ns1.zonedns.vn
   - ns2.zonedns.vn
   - ns3.zonedns.vn
2. Đợi 1-24h propagate
3. Web sẽ hoạt động lại như trước (5 records cũ ở ZoneDNS vẫn còn)
4. Có thể xoá zone trên Cloudflare nếu muốn cleanup

**Risk thấp** vì:
- DNS records ZoneDNS không bị xoá khi migrate
- Có thể rollback bất cứ lúc nào trong 24h đầu
- Sau khi propagate xong, cleanup zoneDNS records cũng OK (không cần vội)

## ⚠️ Notes & gotchas

- **Không bật Cloudflare proxy** (orange cloud) cho GitHub Pages — sẽ conflict cert
- **TTL = 1** trong API = "Auto" trong UI = Cloudflare tự manage TTL
- **Không cần update CNAME file** trong GitHub repo — `thenail.vn` không đổi
- **HTTPS cert vẫn hoạt động** — Let's Encrypt cert đã issue cho domain, không phụ thuộc DNS provider
- **First time setup ZoneDNS records vẫn nên để** trong 1-2 tuần đề phòng rollback

## 🔒 Security cleanup sau khi xong

Sau khi confirm everything works:

1. User có thể revoke API token (Cloudflare → API Tokens → Delete)
2. Hoặc giữ token (đặt expiry 6 tháng) cho lần update DNS sau

## 📅 Estimated time

- Pre-requisites (user): 5-10 phút
- Steps 1-6 (automated): 1-2 phút
- Step "User updates Nhân Hòa": 5 phút
- DNS propagation wait: 1-24h
- Step 8 (docs update): 2 phút

**Total active time: ~15 phút. Total elapsed: 1-24h.**
