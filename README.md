# Playwright Testing with TypeScript

## About

A small Playwright test playground that demonstrates common UI interactions used in automated tests:
- hover / focus behaviour
- right-click (custom context menu)
- double-click (badge insertion)
- drag & drop
- native alert & confirm handling
- popup / new-window handling
- form validation

---

## HTML files

- **playwright-testpage.html** — Main test page. Targets: 
  `#btn-hover`, `#btn-ctx`, `#btn-dbl`, `#mini-gallery`, `#drag-card`, `#drop-target`, `#reset-drop`, `#native-alert`, `#native-confirm`, `#dlg-result`, `#open-child`, `#open-new-page`, `#first_name`, `#email_addr`, `#phone`, `#submit-reg`, `#clear-reg`, `#reg-success`, `#reg-error`.

- **child-window.html** — Popup/new-tab page. Targets:
  `#close-self`. Used for `popup` / new-page tests.

- **frame-content.html** — Optional iframe content (not included on main page). Targets:
  `#frame-input`, `#frame-checkbox`, `#frame-clear`.

---

## How To Run It

### Configure the test page.goto
Open your test file (for example tests/playwright-interactions.spec.ts) and update the navigation line to point to your local page. Replace the empty string with either a `file:///` path or an `http://localhost:PORT` URL.

Edit this line in your test file:
`await page.goto('');` 

e.g. using file URL:
`await page.goto('file:///C:/Users/filip/PW/tests/web_test/playwright-testpage.html');`

OR, if you're serving from localhost:
`await page.goto('http://localhost:3000/playwright-testpage.html');`

An example of how to run the tests is headed with Yarn in Chromium:
`yarn playwright test --project=chromium --headed`
