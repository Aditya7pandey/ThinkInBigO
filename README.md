<div align="center">

<img src="leetcode-complexity-analyzer/logo.png" alt="ThinkInBigO Logo" width="96" height="96" />

# ThinkInBigO

**Think. Analyze. Optimize.**

A Chrome Extension that builds the habit of analyzing Time & Space Complexity after every LeetCode submission — powered by AI.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![Gemini API](https://img.shields.io/badge/Gemini-API-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Installation](#-installation) · [How It Works](#-how-it-works) · [Features](#-features) · [Contributing](#-contributing)

---

</div>

## The Problem

Most developers grind LeetCode problems, hit "Accepted," and immediately move to the next one.

But in real interviews, solving the problem is only half the answer. Interviewers always follow up with:

> *"What's the time complexity of your solution?"*
> *"Can you do better on space?"*

**ThinkInBigO bridges that gap.** Every accepted submission becomes a deliberate complexity analysis exercise, with instant AI-powered feedback on whether you got it right.

---

## How It Works

```
Accepted Submission on LeetCode
           ↓
Extension detects the result (network interception + DOM fallback)
           ↓
Modal prompts you for TC and SC
           ↓
Your code + analysis → Gemini API
           ↓
AI evaluates correctness, confidence, and reasoning
           ↓
Instant feedback with explanation
           ↓
Result saved to your local history
```

---

## Features

### Automatic Submission Detection
Intercepts LeetCode's network responses to catch accepted submissions in real time. A DOM fallback ensures reliability even if the API response structure changes.

### AI-Powered Complexity Evaluation
Sends your code and your stated TC/SC to Gemini. The model returns:
- The correct time and space complexity
- Whether your answer was right
- A concise explanation of the reasoning
- A confidence score

### Instant Feedback Modal
A clean, distraction-free popup appears after every accepted submission. No navigating away, no extra tabs — just type your answer and get feedback.

### Learning History
Every attempt is stored locally with:
- Problem name
- Your answer vs. the correct answer
- Timestamp

Track your progress and spot recurring blind spots over time.

### Dark Mode Friendly UI
Minimal design that matches LeetCode's dark theme. Built to stay out of your way until you need it.

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ThinkInBigO.git
cd ThinkInBigO
```

### 2. Load the extension in Chrome

1. Go to `chrome://extensions/`
2. Toggle on **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `ThinkInBigO/` folder

### 3. Add your Gemini API key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Generate an API key
3. Open the extension popup → **Settings** → paste your key

You're ready. Solve a problem on LeetCode and get an accepted submission to see it in action.

---

## Project Structure

```
ThinkInBigO/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Service worker — network interception
├── content.js          # LeetCode page interaction, modal injection
├── injected.js         # Script injected into page context
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic (history, settings)
├── styles.css          # Modal and popup styles
└── logo.png
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension Architecture | Chrome Extension API · Manifest V3 |
| Core Logic | JavaScript |
| AI Evaluation | Gemini API |
| UI | HTML · CSS |
| Local Storage | `chrome.storage` |

---

## Example

**User submits a Two Sum solution. Modal appears:**

> **Your TC:** `O(n)`
> **Your SC:** `O(1)`

**Gemini responds:**

```json
{
  "correct_tc": "O(n)",
  "correct_sc": "O(n)",
  "tc_correct": true,
  "sc_correct": false,
  "explanation": "Time complexity is O(n) — one pass through the array. Space complexity is O(n), not O(1), because the hash map stores up to n elements in the worst case.",
  "confidence": 0.97
}
```

**Feedback shown instantly inside the modal.**

---

## Privacy

- Your code is sent to the Gemini API solely for complexity analysis.
- No personal data is collected or stored remotely.
- All history is stored locally via `chrome.storage` — it never leaves your machine.
- AI evaluation can be disabled in settings at any time.

---

## Roadmap

- [ ] Analytics dashboard — visualize your accuracy trends over time
- [ ] Pattern tagging — auto-detect DP, Graph, Binary Search, etc.
- [ ] Streak system — maintain your daily analysis habit
- [ ] Weakness tracker — flag problem types where your SC/TC is consistently wrong
- [ ] Multi-LLM support — Claude, GPT-4, local models
- [ ] Firefox support

---

## Contributing

Contributions are welcome. If you find a bug, have a feature idea, or want to improve the AI prompt — open an issue or submit a PR.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## License

MIT — free to use, modify, and distribute.

---

<div align="center">

Built for developers who want to interview, not just solve.

⭐ If this helps your prep, a star goes a long way.

</div>
