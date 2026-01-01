
const authDiv = document.getElementById("authDiv");
const dashboardDiv = document.getElementById("dashboardDiv");
const userEmailSpan = document.getElementById("userEmail");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const previewBtn = document.getElementById("previewBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

const videoPreview = document.getElementById("preview");
const timerSpan = document.getElementById("timer");
const recordingsList = document.getElementById("recordingsList");



let timer;
const startTimer = () => {
  let seconds = 0;
  timerSpan.textContent = "00:00";
  timer = setInterval(() => {
    seconds++;

    
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerSpan.textContent = mins + ":" + secs;
  }, 1000);
};

const stopTimer = () => clearInterval(timer); 


signupBtn.onclick = function () {
  var email = emailInput.value.trim();
  var password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email & password!");
    return;
  }

  var users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[email]) {
    alert("User already exists!");
    return;
  }

  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Now login.");
};

loginBtn.onclick = function () {
  var email = emailInput.value.trim();
  var password = passwordInput.value.trim();

  var users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[email] && users[email] == password) {
    localStorage.setItem("currentUser", email);
    showDashboard(email);
  } else {
    alert("Invalid credentials!");
  }
};

logoutBtn.onclick = function () {
  localStorage.removeItem("currentUser");
  authDiv.style.display = "block";
  dashboardDiv.style.display = "none";
};

// Page Load 
window.onload = function () {
  var currentUser = localStorage.getItem("currentUser");
  if (currentUser) showDashboard(currentUser);
};

function showDashboard(email) {
  authDiv.style.display = "none";
  dashboardDiv.style.display = "block";
  userEmailSpan.textContent = email;
}

// Screen Recording 
var mediaRecorder;
var chunks = [];
var recordedBlob;
var previewStream;

// Preview 
previewBtn.onclick = async function () {
  try {
    previewStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    videoPreview.srcObject = previewStream;
    videoPreview.play();
  } catch (e) {
    alert("Screen preview denied.");
  }
};

// Start recording
startBtn.onclick = async function () {
  try {
    var stream = previewStream || await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    chunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data); 
    };

    mediaRecorder.onstop = function () {
      recordedBlob = new Blob(chunks, { type: "video/webm" });
      videoPreview.srcObject = null;
      videoPreview.src = URL.createObjectURL(recordedBlob);
      videoPreview.play();
      downloadBtn.disabled = false;

      // dashboard list
      var v = document.createElement("video");
      v.src = URL.createObjectURL(recordedBlob);
      v.controls = true;
      v.width = 300;
      recordingsList.appendChild(v);

      stopTimer(); 
    };

    mediaRecorder.start();
    startTimer();
    stopBtn.disabled = false;
  } catch (e) {
    alert("Recording permission denied.");
  }
};

// Stop 
stopBtn.onclick = function () {
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  stopBtn.disabled = true;
};

// Download 
downloadBtn.onclick = function () {
  if (!recordedBlob) return;
  var a = document.createElement("a");
  a.href = URL.createObjectURL(recordedBlob);
  a.download = "recording.webm";
  a.click();
};
