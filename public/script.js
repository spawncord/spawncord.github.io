const socket = io();

let currentUser = "";

document.getElementById("start-chat-btn").addEventListener("click", () => {
  const username = document.getElementById("username-input").value.trim();

  if (username) {
    currentUser = username;
    showChat();
    
    document.getElementById("chat-title").textContent = `Spawncord (Chatting as: ${currentUser})`;
    socket.emit('set-username', username)
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
    socket.emit('chat message', { username: currentUser, message: messageText });

    messageInput.value = "";
  }
});

socket.on('chat message', (data) => {
  addMessage(data.username, data.message);
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
  timeElement.textContent = getCurrentTime(); // HH:MM format, this isnt in local time, so if someone can fix that please do

  usernameTime.appendChild(usernameElement);
  usernameTime.appendChild(timeElement);

  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = message;

  messageBlock.appendChild(usernameTime);
  messageBlock.appendChild(messageElement);

  messagesContainer.appendChild(messageBlock);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto scroll to latest message. THIS DOESNT WORK SOMEONE PLEASE HELP
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