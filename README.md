# Fuck Aptitude

*A desktop side‑kick for blitz‑cracking placement aptitude tests (ahem… totally not cheating).*

> **Disclaimer** – This tool is for “research purposes only”. Seriously, don’t use it in a real exam unless you enjoy expulsion letters.

Repo: [https://github.com/Sahad-09/Fuck-Aptitude.git](https://github.com/Sahad-09/Fuck-Aptitude.git)

---

## 🚀 Quick‑Start

### Prerequisites

* **Node.js** ≥ 18
* **Git**
* A **Gemini API key** → grab one from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation Steps

```bash
# 1. clone the repo
git clone https://github.com/Sahad-09/Fuck-Aptitude.git
cd Fuck-Aptitude
```

```bash
# 2. set up env vars
touch .env
```

Edit it (e.g., with `nano .env`) and add:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Save and exit. This connects Cluely to Google Gemini for AI responses.

```bash
# 3. install dependencies
npm install
# or
yarn install
```

### Run the App

#### Dev mode  (ideal for first time)

```bash
# start Vite + React on port 5180
npm run dev -- --port 5180
# or
yarn run dev --port 5180
```

Open a second terminal and run:

```bash
# Linux/macOS
NODE_ENV=development npm run electron:dev

# Windows PowerShell
$env:NODE_ENV = 'development'; npm run electron:dev
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
