const socket = io();

let currentUser = "";

document.getElementById("start-chat-btn").addEventListener("click", () => {
  const username = document.getElementById("username-input").value.trim();

  if (username) {
    currentUser = username;
    showChat();
    document.getElementById("chat-title").textContent = `Spawncord (Chatting as: ${currentUser})`;
    socket.emit('set-username', username);
  } else {
    alert("Please enter a valid username.");
  }
});

function showChat() {
  document.getElementById("name-prompt").style.display = "none";
  document.getElementById("chat-container").style.display = "flex";
  document.getElementById("chat-title").style.display = "block";
}

document.getElementById("send-btn").addEventListener("click", () => {
  const messageInput = document.getElementById("message-input");
  const messageText = messageInput.value.trim();

  if (messageText) {
    socket.emit('chat message', { text: messageText });
    messageInput.value = "";
  }
});

socket.on('chat message', (data) => {
  if (!data) return;
  addMessage(data.username, data.text);
});

socket.on('blocked', (data) => {
  addMessage("SERVER", data.reason);
});

function addMessage(username, message) {
  const messagesContainer = document.getElementById("messages");

  const messageBlock = document.createElement("div");
  messageBlock.classList.add("message-block");

  const usernameTime = document.createElement("div");
  usernameTime.classList.add("username-time");

  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.textContent = username;

  const timeElement = document.createElement("span");
  timeElement.classList.add("time");
  timeElement.textContent = getCurrentTime();

  usernameTime.appendChild(usernameElement);
  usernameTime.appendChild(timeElement);

  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = message;

  messageBlock.appendChild(usernameTime);
  messageBlock.appendChild(messageElement);

  messagesContainer.appendChild(messageBlock);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function toggleRules() {
  const rules = document.getElementById("rules");
  rules.style.display = (rules.style.display === "none") ? "block" : "none";
}