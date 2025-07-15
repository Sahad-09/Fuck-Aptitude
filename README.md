# 😈 Fuck Aptitude: Your Sneaky Sidekick for Smashing Placement Tests

*Because who needs to *actually* study when you’ve got this bad boy?*

> **Disclaimer**: This tool is for "educational research" only. Using it in a real exam is like begging for a one-way ticket to Expulsionville. Don’t say I didn’t warn you, genius.

Repo: [https://github.com/Sahad-09/Fuck-Aptitude.git](https://github.com/Sahad-09/Fuck-Aptitude.git)

---

## 🚀 Quick-Start: Be a Rebel in 5 Minutes

Ready to stick it to those soul-crushing aptitude tests? Here’s how to get this beast running.

### Prerequisites (aka Stuff You Should Already Have)

- **Node.js** ≥ 18 (don’t be that guy running Node 12, okay?)
- **Git** (because duh, you’re cloning a repo)
- A **Gemini API key** – snag one from [Google AI Studio](https://makersuite.google.com/app/apikey) unless you enjoy error messages.

### Installation: Easier Than Cheating on a Math Quiz

1. **Clone the repo like a pro**:
   ```bash
   git clone https://github.com/Sahad-09/Fuck-Aptitude.git
   cd Fuck-Aptitude
   ```

2. **Set up your super-secret env vars**:
   ```bash
   touch .env
   ```
   Crack open `.env` with your favorite editor (like `nano .env`, you caveman) and toss in:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   Save it, exit, and bask in the glow of connecting to Google Gemini’s AI brain.

3. **Install dependencies** (aka the stuff that makes this work):
   ```bash
   npm install
   # or, if you’re a Yarn hipster
   yarn install
   ```

### Run It Like You Stole It

#### Dev Mode (for when you’re feeling extra lazy)
Fire up the dev server and watch the magic happen:
```bash
# Vite + React, now on port 5180 because 3000 is so last year
npm run dev -- --port 5180
# or
yarn run dev --port 5180
```

Pop open a second terminal (multitasking, much?) and run:
```bash
# Linux/macOS cool kids
NODE_ENV=development npm run electron:dev

# Windows PowerShell warriors
$env:NODE_ENV = 'development'; npm run electron:dev
```

#### Production Build (for when you’re ready to show off)
```bash
npm run build   # Spits out a shiny app in /release
```

---

## ⚡️ Keyboard Shortcuts: Because Clicking is for Suckers

| Combo                 | Action                                      |
|-----------------------|---------------------------------------------|
| **⌘ / Ctrl + B**      | Hide/show the window (poof, you’re invisible!) |
| **⌘ / Ctrl + H**      | Screenshot the screen (grab that MCQ like a ninja) |
| **⌘ / Enter**         | Beg Gemini for the answer (it’s smarter than you) |
| **⌘ / Ctrl + Arrows** | Nudge the window around (because precision is sexy) |

---

## Troubleshooting: When Your Genius Plan Goes Sideways

1. **Port 5180 is throwing a tantrum?** Murder the process hogging it:
   ```bash
   lsof -i :5180  # Find the culprit’s PID
   kill -9 <PID>  # Sayonara, loser
   ```

2. **NPM acting like a drunk uncle?** Nuke the evidence and start over:
   ```bash
   rm -rf node_modules package-lock.json && npm install
   ```

3. **Still broken?** Yeet the `/release` folder into oblivion and rebuild. You’re welcome.

---

## Contribution: Join the Dark Side

This repo runs itself like a well-oiled cheating machine. I’m too busy sipping coffee to fix your bugs, but PRs are welcome (make ‘em good). Issues? They’ll be ignored with a warm, sarcastic hug.

Got a corporate gig that needs this kind of spice? Slide into my DMs.

---

## Legal: Don’t Be *That* Guy

Using this app in a real exam is like bringing a flamethrower to a pillow fight—technically possible, but you’re gonna get burned. All responsibility for your inevitable academic doom is on *you*. 😘