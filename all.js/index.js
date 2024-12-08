// Initialize Trie and Toxic Words
class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      let current = this.root;
      for (const char of word.toLowerCase()) {
        if (!current.children[char]) {
          current.children[char] = new TrieNode();
        }
        current = current.children[char];
      }
      current.isEndOfWord = true;
    }
  
    search(word) {
      let current = this.root;
      for (const char of word.toLowerCase()) {
        if (!current.children[char]) return false;
        current = current.children[char];
      }
      return current.isEndOfWord;
    }
  }
  
  // Toxicity Detection
  const toxicWords = ["toxic", "noob", "idiot", "cheater", "trash", "loser", "fuck", "bot"];
  const trie = new Trie();
  toxicWords.forEach((word) => trie.insert(word));
  
  const userList = new Set();
  const messages = [];
  
  document.getElementById("submitBtn").addEventListener("click", () => {
    const usernameInput = document.getElementById("username");
    const messageInput = document.getElementById("message");
    const warningsDiv = document.getElementById("warnings");
    const participantsList = document.getElementById("participants");
    const chatBox = document.getElementById("chatBox");
  
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
  
    if (!username) {
      warningsDiv.textContent = "Please enter a username.";
      return;
    }
  
    if (!message) {
      warningsDiv.textContent = "Please enter a message.";
      return;
    }
  
    // Add participant if not already added
    if (!userList.has(username)) {
      userList.add(username);
      const li = document.createElement("li");
      li.textContent = username;
      participantsList.appendChild(li);
    }
  
    // Process message for toxicity
    const words = message.split(/\s+/);
    const flagged = words.some((word) => trie.search(word));
    let warningMessage = "";
  
    if (flagged) {
      warningMessage = `Warning: Toxic message detected! "${message}"`;
      warningsDiv.textContent = warningMessage;
    } else {
      warningsDiv.textContent = "";
    }
  
    // Add the message to the chat section
    messages.push({ username, message, flagged });
    chatBox.innerHTML = ""; // Clear chat box to re-render
    messages.forEach((msg) => {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add(
        "mb-4",
        "p-4",
        "rounded-lg",
        "max-w-md",
        msg.flagged ? "bg-red-200" : "bg-blue-200"
      );
      msgDiv.innerHTML = `
        <p class="text-sm font-semibold text-gray-800">${msg.username}</p>
        <p class="text-gray-700">${msg.message}</p>
      `;
      chatBox.appendChild(msgDiv);
    });
  
    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // Clear input fields
    messageInput.value = "";
  });
  