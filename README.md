## 🗓️ **MENTORAI 7-DAY ROADMAP**

### **🧩 DAY 1 — Setup & Skeleton**

**Goal:** Get the environment ready and routes working.

**Tasks**

* Create a new Next.js app

  ```bash
  npx create-next-app@latest mentormind
  cd mentormind
  npm install @google/generative-ai mongoose
  ```
* Setup Tailwind CSS (for quick styling).
* Create pages:

  * `/` → Landing page with “Start Learning” button
  * `/chat` → main interaction screen
* Create `.env.local` with:

  ```bash
  GEMINI_API_KEY=your_key_here
  MONGODB_URI=your_mongo_uri
  ```
* Verify Gemini API call works:

  * Add `pages/api/test` that returns a small Gemini response.
  * Run `npm run dev` → test endpoint with Postman or browser.

✅ **Deliverable:** Base app running with working Gemini test route.

---

### **💬 DAY 2 — Basic Chat Interface**

**Goal:** Build the chat UI and connect it to your `/api/chat` route.

**Tasks**

* Create simple chat component (user + mentor bubbles).
* Add input box + send button.
* Create `pages/api/chat.js`:
* On submit, call `/api/chat` and render messages.

✅ **Deliverable:** Working chat where Gemini replies as a mentor.

---

### **🎭 DAY 3 — Persona & Mode Selector**

**Goal:** Make chat dynamic with different personalities and modes.

**Tasks**

* Create persona presets (JSON):

  ```js
  [
    { name: "Calm Teacher", prompt: "Patient, encouraging tone" },
    { name: "Strict Interviewer", prompt: "Direct, challenging, formal tone" },
    { name: "Sarcastic Senior", prompt: "Witty and slightly teasing" },
    { name: "Supportive Coach", prompt: "Motivational and warm" }
  ]
  ```
* On `/chat`, add:

  * Persona dropdown
  * Mode selector (Learning / Viva / Random)
* If “Random” → choose random persona at runtime.

✅ **Deliverable:** User can select personality and mode before chat starts.

---

### **🧠 DAY 4 — Guided Learning Logic**

**Goal:** Make “Learning Mode” interactive step-by-step.

**Tasks**

* Store conversation context in state (Zustand or useState).
* Modify prompt:
  * In *Learning Mode*, Gemini should *ask questions* before giving answers.
  * Append previous user and mentor turns to prompt.
* Example system prompt:

  ```js
  You are a mentor teaching step-by-step. 
  Give small hints, ask reflective questions, 
  and only reveal the full answer when user shows understanding.
  ```
* Add “Next Hint” button (AI continues only when clicked).

✅ **Deliverable:** Step-based conversation for learning mode.

---

### **🗣️ DAY 5 — Viva & Tone Feedback**

**Goal:** Add viva mode where AI critiques the user’s tone & clarity.

**Tasks**

* After each user message in *Viva Mode*, call `/api/feedback` route.
* `/api/feedback` uses Gemini again:

  ```js
  const prompt = `
  Analyze this response for tone, confidence, clarity:
  "${userAnswer}"
  Give feedback in this format:
  {"positive": "...", "improvement": "...", "tone": "..."}
  `;
  ```
* Parse JSON and display feedback below chat bubble.

✅ **Deliverable:** Users get real-time feedback on how they answered.

---

### **🧩 DAY 6 — MongoDB Integration**

**Goal:** Save chat history + feedback.

**Tasks**

* Connect to MongoDB Atlas via `lib/db.js` (mongoose).
* Create a `Session` model:

  ```js
  { userId, persona, mode, conversation: [], feedback: [], createdAt }
  ```
* On each interaction, push new entries and save.
* Add simple “Past Sessions” page that lists chat summaries.

✅ **Deliverable:** Persistent chat sessions and progress tracking.

---

### **🚀 DAY 7 — Polish & Expansion Hooks**

**Goal:** Make it feel complete + ready to grow.

**Tasks**

* Add nice UI touches (Tailwind cards, motion transitions).
* Add “Random Mentor” animation or shuffle effect.
* Add “Restart Session” and “Continue” options.
* Deploy on **Vercel** and test live.
* (Optional) Add authentication (NextAuth.js).
* Plan v2 features like: voice input, difficulty levels, peer sharing.

✅ **Deliverable:** Publicly deployed **MentorMind v1** app — interactive AI learning mentor with personas & feedback.

---

## ⚡ After Week 1 — Expansion

| Feature             | Description                                      |
| ------------------- | ------------------------------------------------ |
| 🧑‍🎓 User Profiles | Track skill progress, stats, favorite personas   |
| 🎯 Curriculum Mode  | Auto-generated topic progression                 |
| 🎤 Voice Viva       | Speech-to-text + AI tone grading                 |
| 🧠 Memory           | Gemini remembers prior user strengths/weaknesses |
| 🪄 Persona Builder  | Users create their own mentor personalities      |
