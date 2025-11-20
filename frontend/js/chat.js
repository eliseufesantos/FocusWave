class ChatController {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.quickActions = document.querySelectorAll('.chip');

    this.init();
  }

  init() {
    this.setupEventListeners();
    // Scroll to bottom
    this.scrollToBottom();
  }

  setupEventListeners() {
    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    this.quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.dataset.message;
        this.addMessage(message, 'user');
        this.processResponse(message);
      });
    });
  }

  handleSubmit() {
    if (!this.chatInput) return;

    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.chatInput.value = '';
    this.processResponse(message);
  }

  addMessage(text, sender) {
    if (!this.messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;

    messageDiv.innerHTML = `
      <div class="message__content">
        <p>${text}</p>
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();

    // Re-initialize icons if needed
    if (window.lucide) lucide.createIcons();
  }

  processResponse(userMessage) {
    // Simulate AI delay
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.generateResponse(userMessage);
      this.addMessage(response, 'ai');
    }, 1000);
  }

  generateResponse(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('focar') || lowerMsg.includes('foco')) {
      return "Ótimo! Vamos focar. Recomendo iniciar o timer de 25 minutos. Quer que eu inicie para você?";
    }
    if (lowerMsg.includes('relaxar') || lowerMsg.includes('descanso')) {
      return "Entendido. Que tal uma música ambiente suave? Posso tocar algo relaxante.";
    }
    if (lowerMsg.includes('música') || lowerMsg.includes('tocar')) {
      return "Vou colocar uma playlist de Lo-Fi para você.";
    }

    return "Entendi. Como mais posso ajudar você a ser produtivo hoje?";
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return;

    const indicator = document.createElement('div');
    indicator.className = 'message message--ai typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="message__content">
        <p>...</p>
      </div>
    `;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chat = new ChatController();
});