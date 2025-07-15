# Fuck Aptitude

*A desktop side‑kick for blitz‑cracking placement aptitude tests (ahem… totally not cheating).*

> **Disclaimer** – This tool is for “research purposes only”. Seriously, don’t use it in a real exam unless you enjoy expulsion letters.

---

## 🚀 Quick‑Start

### Prerequisites

* **Node.js** ≥ 18
* **Git**
* A **Gemini API key** → grab one from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

```bash
# 1. clone
git clone <repo‑url>
cd fuck‑aptitude

# 2. install deps
npm install

# 3. env vars
cp .env.example .env   # or create manually
# then edit .env and add:
# GEMINI_API_KEY=your_key_here
```

### Run the App

#### Dev mode  (ideal for first time)

```bash
# start Vite + React on port 5180
npm run dev -- --port 5180

# in a second terminal: launch Electron shell
NODE_ENV=development npm run electron:dev
```

#### Prod build

```bash
npm run build   # compiled app lands in /release
```

---

## ⚡️ Keyboard Shortcuts

| Combo                 | Action                                      |
| --------------------- | ------------------------------------------- |
| **⌘ / Ctrl + B**      | Toggle window visibility                    |
| **⌘ / Ctrl + H**      | Screenshot the current screen (MCQ capture) |
| **⌘ / Enter**         | Ask Gemini for the answer                   |
| **⌘ / Ctrl + Arrows** | Nudge window around                         |

---

## Troubleshooting

1. Port 5180 busy? Kill the hog:

   ```bash
   lsof -i :5180  # find PID
   kill -9 <PID>
   ```
2. Weird npm errors?

   ```bash
   rm -rf node_modules package-lock.json && npm install
   ```
3. Still borked? Delete the **/release** folder and re‑build.

---

## Contribution

This repo is mostly on auto‑pilot—I’m swamped. PRs are welcome; issues will be ignored with love.
Need a custom corporate solution? Ping me.

---

### Legal

Using this app in an official assessment is almost certainly a violation of the rules. You assume all responsibility for whatever trouble you get into. 😉
