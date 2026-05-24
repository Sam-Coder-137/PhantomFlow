//This code was made by Sam-Coder-137 on github
//Powered by Groq
(async () => {
const GROQ_KEY = prompt("Enter Groq API Key:");
if (!GROQ_KEY) return alert("API key required");

let history = [];
const maxHistory = 15;
let speakOn = true;
let isHidden = false;

/* ================= UI ================= */
const ui = document.createElement("div");
Object.assign(ui.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "400px",
  height: "580px",
  background: "radial-gradient(circle at top,#0f0f0f,#050505)",
  border: "1px solid #00ff99",
  borderRadius: "16px",
  padding: "12px",
  zIndex: 999999,
  display: "flex",
  flexDirection: "column",
  fontFamily: "system-ui"
});

/* ================= HEADER WITH NAME ================= */
const header = document.createElement("div");
Object.assign(header.style, {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
  paddingBottom: "8px",
  borderBottom: "1px solid #00ff9944"
});

const title = document.createElement("div");
title.textContent = "PhantomFlow";
Object.assign(title.style, {
  color: "#00ff99",
  fontWeight: "bold",
  fontSize: "18px"
});

const hideBtn = document.createElement("button");
hideBtn.textContent = "−";
Object.assign(hideBtn.style, {
  width: "28px",
  height: "28px",
  background: "#111",
  color: "#00ff99",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

header.appendChild(title);
header.appendChild(hideBtn);
ui.appendChild(header);

/* CHAT */
const out = document.createElement("div");
Object.assign(out.style, {
  flex: "1",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "6px"
});

/* INPUT */
const input = document.createElement("textarea");
Object.assign(input.style, {
  height: "70px",
  background: "#000",
  color: "#00ff99",
  border: "1px solid #222",
  borderRadius: "10px",
  padding: "8px",
  resize: "none",
  outline: "none"
});

/* BUTTON ROW */
const row = document.createElement("div");
row.style.display = "flex";
row.style.gap = "8px";

/* SEND */
const send = document.createElement("button");
send.textContent = "SEND";
Object.assign(send.style, {
  flex: "1",
  background: "#00ff99",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer"
});

/* 🔊 TOGGLE BUTTON */
const soundBtn = document.createElement("button");
soundBtn.textContent = "🔊";
Object.assign(soundBtn.style, {
  width: "60px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "18px"
});

soundBtn.onclick = () => {
  speakOn = !speakOn;
  soundBtn.textContent = speakOn ? "🔊" : "🔇";
};

row.appendChild(send);
row.appendChild(soundBtn);

/* BUILD */
ui.appendChild(out);
ui.appendChild(input);
ui.appendChild(row);
document.body.appendChild(ui);

/* ================= UNHIDE BUTTON ================= */
const unhideBtn = document.createElement("div");
Object.assign(unhideBtn.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "50px",
  height: "50px",
  background: "#00ff99",
  color: "#000",
  borderRadius: "50%",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  cursor: "pointer",
  zIndex: 999999,
  boxShadow: "0 5px 15px rgba(0, 255, 153, 0.4)"
});
unhideBtn.textContent = "💬";
document.body.appendChild(unhideBtn);

/* ================= HIDE / UNHIDE LOGIC ================= */
function hideUI() {
  ui.style.display = "none";
  unhideBtn.style.display = "flex";
  isHidden = true;
}

function showUI() {
  ui.style.display = "flex";
  unhideBtn.style.display = "none";
  isHidden = false;
  setTimeout(() => out.scrollTop = out.scrollHeight, 100);
}

hideBtn.onclick = hideUI;
unhideBtn.onclick = showUI;

/* ================= RENDER ================= */
function render() {
out.textContent = "";
for (const m of history) {
const b = document.createElement("div");
Object.assign(b.style, {
  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
  maxWidth: "85%",
  padding: "10px",
  borderRadius: "12px",
  background: m.role === "user" ? "#1f1f1f" : "#003322",
  color: "#fff",
  whiteSpace: "pre-wrap"
});
b.textContent = m.content;
out.appendChild(b);
}
out.scrollTop = out.scrollHeight;
}

/* ================= FAST SPEECH ================= */
function speak(text) {
if (!speakOn) return;
if (!text || text.length < 2) return;
speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.rate = 1.25;
u.pitch = 1;
speechSynthesis.speak(u);
}

/* ================= GROQ CALL ================= */
async function ask(msg) {
if (!msg.trim()) return;
history.push({ role: "user", content: msg });
render();
const typing = document.createElement("div");
typing.textContent = "⚡ thinking...";
typing.style.color = "#00ff99";
out.appendChild(typing);
try {
const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": "Bearer " + GROQ_KEY,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "llama-3.3-70b-versatile",
messages: [
{ role: "system", content: "You are a fast helpful assistant." },
...history
]
})
});
const data = await res.json();
typing.remove();
if (!res.ok) throw new Error(data?.error?.message || "Groq error");
const reply = data?.choices?.[0]?.message?.content;
history.push({ role: "assistant", content: reply });
if (history.length > maxHistory) {
history = history.slice(-maxHistory);
}
render();
speak(reply);
} catch (err) {
typing.remove();
const e = document.createElement("div");
e.textContent = "❌ " + err.message;
e.style.color = "#ff4444";
out.appendChild(e);
}
}

/* ================= SEND ================= */
send.onclick = () => {
const msg = input.value;
input.value = "";
ask(msg);
};

/* ESC toggles hide/show */
window.addEventListener("keydown", e => {
if (e.key === "Escape") {
  if (isHidden) showUI();
  else hideUI();
}
});

render();
})();

