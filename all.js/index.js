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
  
  const toxicWords = ["toxic", "noob", "idiot", "cheater", "trash", "loser"];
  const trie = new Trie();
  toxicWords.forEach((word) => trie.insert(word));
  
  const users = {}; 
  const messages = [];
  
  document.getElementById("submitBtn").addEventListener("click", () => {
    const usernameInput = document.getElementById("username");
    const messageInput = document.getElementById("message");
    const warningsDiv = document.getElementById("warnings");
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
  
    if (!users[username]) {
      users[username] = { warnings: 0, banned: false };
    }
  
    const user = users[username];
  
    if (user.banned) {
      warningsDiv.textContent = `User "${username}" is banned and cannot send messages.`;
      return;
    }
  
    const words = message.split(/\s+/);
    const flagged = words.some((word) => trie.search(word));
  
    if (flagged) {
      user.warnings += 1;
      warningsDiv.textContent = `Warning ${user.warnings}: Toxic message detected.`;
  
      if (user.warnings >= 3) {
        user.banned = true;
        warningsDiv.textContent = `User "${username}" is banned for repeated toxic behavior.`;
        return;
      }
    } else {
      warningsDiv.textContent = "";
    }
  
    messages.push({ username, message, flagged });
  
    chatBox.innerHTML = ""; 
    messages.forEach((msg) => {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add(
        "mb-4",
        "p-4",
        "rounded-lg",
        "max-w-sm",
        "shadow",
        msg.flagged ? "bg-red-200" : "bg-blue-200"
      );
      msgDiv.innerHTML = `
        <p class="text-sm font-semibold text-gray-800">${msg.username}</p>
        <p class="text-gray-700">${msg.message}</p>
      `;
      chatBox.appendChild(msgDiv);
    });
  
    chatBox.scrollTop = chatBox.scrollHeight;
  
    messageInput.value = "";
  });
  