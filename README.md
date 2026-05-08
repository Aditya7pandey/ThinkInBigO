# 🚀 ThinkInBigO

> Think. Analyze. Optimize.

A Chrome Extension that helps developers build the habit of analyzing **Time Complexity (TC)** and **Space Complexity (SC)** after every successful LeetCode submission using AI-powered feedback.

---

## ✨ Why ThinkInBigO?

Many developers solve LeetCode problems but skip one of the most important interview habits:

* ❌ Analyzing Time Complexity
* ❌ Analyzing Space Complexity
* ❌ Explaining reasoning clearly

ThinkInBigO solves this by automatically prompting users after every accepted submission and checking their complexity analysis using an LLM.

This turns passive problem-solving into active interview preparation.

---

# 🎯 Features

## ✅ Automatic Accepted Submission Detection

* Detects successful LeetCode submissions
* Uses network interception for reliability
* DOM fallback support

## 🧠 AI-Powered Complexity Evaluation

* Evaluates:

  * Time Complexity
  * Space Complexity
* Compares with user input
* Provides concise explanations

## ⚡ Instant Feedback

* Correctness indicators
* Confidence scoring
* Short reasoning explanation

## 🌙 Modern UI

* Dark mode friendly
* Minimal & distraction-free
* Smooth modal popup experience

## 💾 Learning History

Stores:

* Problem name
* User answers
* Correct TC/SC
* Timestamp
* 
---

# ⚙️ Tech Stack

| Technology           | Purpose                |
| -------------------- | ---------------------- |
| JavaScript           | Core Extension Logic   |
| Chrome Extension API | Browser Integration    |
| Manifest V3          | Extension Architecture |
| Gemini API           | AI Complexity Analysis |
| HTML/CSS             | UI Components          |
| chrome.storage       | Local Persistence      |

---

# 🧠 How It Works

```text
LeetCode Submission
        ↓
Accepted Response Detected
        ↓
Popup asks for TC & SC
        ↓
Code + User Answer sent to Gemini API
        ↓
AI evaluates complexities
        ↓
Feedback shown instantly
```

---

# 📦 Project Structure

```bash
ThinkInBigO/
│
├── manifest.json
├── background.js
├── content.js
├── injected.js
├── popup.html
├── popup.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

# 🚀 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ThinkInBigO.git
```

---

## 2️⃣ Open Chrome Extensions

Go to:

```text
chrome://extensions/
```

Enable:

✅ Developer Mode

---

## 3️⃣ Load Extension

Click:

```text
Load unpacked
```

Select the project folder.

---

# 🔑 Gemini API Setup

This extension uses the Gemini API for AI-powered complexity analysis.

## Get API Key

1. Visit Google AI Studio
2. Create an API Key
3. Paste it inside extension settings

---

# 🛡️ Privacy

* Your code may be sent to the Gemini API for analysis.
* No personal information is collected.
* No data is sold or shared.
* Users can disable AI evaluation anytime.

---

# 🧪 Example

## User Input

```text
TC: O(n)
SC: O(1)
```

## AI Response

```json
{
  "correct_tc": "O(n log n)",
  "correct_sc": "O(1)",
  "explanation": "Sorting dominates the runtime, resulting in O(n log n)."
}
```

---

# 🔥 Future Improvements

* 📊 Analytics Dashboard
* 🧠 Pattern Detection (DP, Graph, Binary Search)
* 🏆 Streak System
* 📈 Weakness Tracking
* 🤖 Multi-LLM Support
* 🌐 Firefox Support

---

# 🤝 Contributing

Contributions are welcome.

Feel free to:

* Open issues
* Submit PRs
* Suggest improvements

---

# ⭐ Support

If you like this project:

⭐ Star the repository

It helps a lot.
---

# 👨‍💻 Author

Built with ❤️ for developers preparing for coding interviews.
