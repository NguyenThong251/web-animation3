# web-animation3

**🔴 Live demo: <https://nguyenthong251.github.io/web-animation3/>**

Bản clone 1:1 giao diện [cravburgers.shop](https://www.cravburgers.shop/) (concept website của AnyFlow Agency) — phục vụ mục đích học tập / nghiên cứu kỹ thuật. Toàn bộ hình ảnh, nội dung và thiết kế thuộc về chủ sở hữu gốc.

## Stack (khớp site gốc)

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — design tokens trong `app/globals.css` (`@theme`)
- **GSAP + ScrollTrigger** (`@gsap/react` / `useGSAP`) — toàn bộ scroll animation
- **Lenis** — smooth scroll, sync với `gsap.ticker`
- **Fonts**: Modak + Mouse Memoirs (Google Fonts qua `next/font`)

## Chạy

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Cấu trúc

```
app/                    # 4 route: / , /menu , /spices , /contact
components/
  chrome/               # UI chung: Preloader, Navbar, Footer, CookieConsent,
                        #   PageTransition, LenisProvider, AnimationProvider,
                        #   IngredientRope (cursor rope), text-effects
  home|menu|spices|contact/   # section theo page
public/
  img/ img-webp/ burgers/     # 38 assets gốc
_reference/             # SSR HTML + CSS/JS bundle gốc + ghi chú khảo sát (không thuộc app)
```

## Độ giống đã xác minh

- **DOM SSR**: 100.00% trên cả 4 page (diff từng thẻ + từng class, bỏ qua 1 `<template>` rỗng do khác minor-version Next.js)
- **Text content**: khớp 100% từng section
- **Hình học layout**: đo bằng Playwright — trùng từng pixel (vd. trang spices: story 1789→4597, CTA 4597, docH 6671 trên cả 2 site)
- **Animation**: timing/ease trích trực tiếp từ bundle gốc (preloader, page transition "CRAVING...", menu overlay, footer juggle, jelly divider, marquee, cart, v.v.)
- **Tính năng**: cookie consent (localStorage `crav_cookie_ok`), cart (/menu: add → toast → badge → panel → CHECKOUT → Concept popup), form contact → Notice popup, title cycler, console easter egg

## Ghi chú fidelity

- Modal "CONCEPT" không tự bật — bản gốc chỉ mở khi bấm CHECKOUT (/menu) hoặc submit form (/contact).
- Một số chi tiết bug của bản gốc được giữ nguyên có chủ đích (class `${idx % 2}` chưa evaluate, inline style không hợp lệ ở preloader).
