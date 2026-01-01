const authDiv = document.getElementById("authDiv");
const dashboardDiv = document.getElementById("dashboardDiv");
const userEmailSpan = document.getElementById("userEmail");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

const videoPreview = document.getElementById("preview");
const timerSpan = document.getElementById("timer");
const recordingsList = document.getElementById("recordingsList");

let mediaRecorder;
let recordedChunks = [];
let recordedBlob;
let screenStream;
let timer;
let seconds = 0;

/* ---------------- TIMER ---------------- */
function startTimer() {
  seconds = 0;
  timerSpan.textContent = "00:00";
  timer = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timerSpan.textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

/* ---------------- AUTH ---------------- */
signupBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Enter email & password");

  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[email]) return alert("User already exists");

  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Login now.");
};

loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[email] === password) {
    localStorage.setItem("currentUser", email);
    showDashboard(email);
  } else {
    alert("Invalid credentials");
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  dashboardDiv.style.display = "none";
  authDiv.style.display = "block";
};

window.onload = () => {
  const user = localStorage.getItem("currentUser");
  if (user) showDashboard(user);
};

function showDashboard(email) {
  authDiv.style.display = "none";
  dashboardDiv.style.display = "block";
  userEmailSpan.textContent = email;
}

/* ---------------- RECORDING ---------------- */
startBtn.onclick = async () => {
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(screenStream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

      videoPreview.srcObject = null;
      videoPreview.src = URL.createObjectURL(recordedBlob);
      videoPreview.controls = true;
      videoPreview.play(); // 🔥 VIDEO PLAYS FIXED

      downloadBtn.disabled = false;

      const v = document.createElement("video");
      v.src = videoPreview.src;
      v.controls = true;
      v.width = 280;
      recordingsList.appendChild(v);

      screenStream.getTracks().forEach(t => t.stop());
      stopTimer();
    };

    mediaRecorder.start();
    startTimer();

    startBtn.disabled = true;
    stopBtn.disabled = false;

  } catch (err) {
    alert("Screen permission denied");
  }
};

stopBtn.onclick = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  stopBtn.disabled = true;
  startBtn.disabled = false;
};

downloadBtn.onclick = () => {
  if (!recordedBlob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(recordedBlob);
  a.download = "recording.webm";
  a.click();
};
