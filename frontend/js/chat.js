/**
 * Chat System
 * Sistema de chat com IA e sugestões inline
 */

(function() {
  'use strict';

  const ChatSystem = {
    messagesContainer: null,
    inputForm: null,
    inputField: null,
    sendButton: null,

    /**
     * Inicializa o chat system
     */
    init() {
      this.cacheElements();
      this.attachEventListeners();
      console.log('💬 Chat System initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      this.messagesContainer = document.getElementById('chat-messages');
      this.inputForm = document.getElementById('chat-form');
      this.inputField = document.getElementById('chat-input');
      this.sendButton = this.inputForm.querySelector('.chat__send-btn');
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
      // Submit do form
      this.inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage(this.inputField.value);
      });

      // Quick actions chips
      const chips = document.querySelectorAll('.chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const message = chip.getAttribute('data-message');
          this.sendMessage(message);
        });
      });

      // Disable send button se input vazio
      this.inputField.addEventListener('input', () => {
        this.sendButton.disabled = !this.inputField.value.trim();
      });
    },

    /**
     * Envia mensagem
     * @param {string} text - Texto da mensagem
     */
    sendMessage(text) {
      if (!text.trim()) return;

      // Adicionar mensagem do usuário
      this.addMessage(text, 'user');

      // Limpar input
      this.inputField.value = '';
      this.sendButton.disabled = true;

      // Desabilitar input temporariamente
      this.inputField.disabled = true;
      this.sendButton.disabled = true;

      // Simular "digitando..."
      setTimeout(() => {
        this.addTypingIndicator();

        // Simular resposta da IA (depois conectar com API)
        setTimeout(() => {
          this.removeTypingIndicator();
          this.processUserIntent(text);

          // Reabilitar input
          this.inputField.disabled = false;
          this.inputField.focus();
        }, 1500);
      }, 500);
    },

    /**
     * Processa a intenção do usuário e responde
     * @param {string} text - Texto original do usuário
     */
    processUserIntent(text) {
      const lowerText = text.toLowerCase();

      // Detectar intenção baseado em palavras-chave
      if (lowerText.includes('focar') || lowerText.includes('foco') || lowerText.includes('concentr')) {
        this.addMessage('Entendi! Vou sugerir músicas perfeitas para foco profundo.', 'ai');
        this.showMusicSuggestions([
          {
            id: 'music-1',
            title: 'Deep Focus Alpha 432Hz',
            description: 'Concentração profunda',
            icon: '🎵'
          },
          {
            id: 'music-2',
            title: 'White Noise - Study Mode',
            description: 'Bloqueio de distrações',
            icon: '🌊'
          },
          {
            id: 'music-3',
            title: 'Classical Piano Focus',
            description: 'Música clássica suave',
            icon: '🎹'
          }
        ]);
      } else if (lowerText.includes('relaxar') || lowerText.includes('relax') || lowerText.includes('calm')) {
        this.addMessage('Perfeito! Aqui estão músicas relaxantes para você.', 'ai');
        this.showMusicSuggestions([
          {
            id: 'music-4',
            title: 'Meditation Bells 528Hz',
            description: 'Relaxamento profundo',
            icon: '🔔'
          },
          {
            id: 'music-5',
            title: 'Nature Sounds - Rain',
            description: 'Sons da natureza',
            icon: '🌧️'
          }
        ]);
      } else if (lowerText.includes('dormir') || lowerText.includes('sleep')) {
        this.addMessage('Vou te ajudar a ter uma noite tranquila!', 'ai');
        this.showMusicSuggestions([
          {
            id: 'music-6',
            title: 'Sleep Delta Waves',
            description: 'Indução ao sono profundo',
            icon: '😴'
          },
          {
            id: 'music-7',
            title: 'Soft Lullaby Piano',
            description: 'Música suave para dormir',
            icon: '🌙'
          }
        ]);
      } else if (lowerText.includes('estudar') || lowerText.includes('study')) {
        this.addMessage('Ótimo! Músicas perfeitas para sessões de estudo.', 'ai');
        this.showMusicSuggestions([
          {
            id: 'music-8',
            title: 'Lofi Hip Hop Study',
            description: 'Beats relaxantes',
            icon: '📚'
          },
          {
            id: 'music-9',
            title: 'Binaural Beats Focus',
            description: 'Frequências binaurais',
            icon: '🎧'
          }
        ]);
      } else {
        // Resposta genérica
        this.addMessage('Posso te ajudar com músicas para foco, relaxamento, sono ou estudo. O que você precisa?', 'ai');
      }
    },

    /**
     * Adiciona mensagem ao chat
     * @param {string} text - Texto da mensagem
     * @param {string} sender - 'user' ou 'ai'
     */
    addMessage(text, sender) {
      const avatar = sender === 'user' ? '👤' : '🤖';

      const messageHTML = `
        <div class="message message--${sender}">
          <div class="message__avatar">${avatar}</div>
          <div class="message__content">
            <p>${text}</p>
          </div>
        </div>
      `;

      this.messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
      this.messagesContainer.classList.add('chat__messages--active');
      this.scrollToBottom();
    },

    /**
     * Adiciona indicador de digitação
     */
    addTypingIndicator() {
      const typingHTML = `
        <div class="message message--ai typing-indicator">
          <div class="message__avatar">🤖</div>
          <div class="message__content">
            <p>...</p>
          </div>
        </div>
      `;

      this.messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
      this.scrollToBottom();
    },

    /**
     * Remove indicador de digitação
     */
    removeTypingIndicator() {
      const indicator = this.messagesContainer.querySelector('.typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    },

    /**
     * Mostra sugestões de música
     * @param {Array} musics - Array de objetos de música
     */
    showMusicSuggestions(musics) {
      const musicCardsHTML = musics.map(music => `
        <div class="music-card glass-card">
          <span class="music-card__icon">${music.icon}</span>
          <div class="music-card__info">
            <h4>${music.title}</h4>
            <p>${music.description}</p>
          </div>
          <button class="btn-icon" data-play="${music.id}">
            <span>▶️</span>
          </button>
        </div>
      `).join('');

      const suggestionsHTML = `
        <div class="music-suggestions">
          ${musicCardsHTML}
        </div>
      `;

      this.messagesContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
      this.scrollToBottom();

      // Attach event listeners aos botões de play
      this.attachMusicPlayListeners();
    },

    /**
     * Anexa listeners aos botões de play das músicas
     */
    attachMusicPlayListeners() {
      const playButtons = this.messagesContainer.querySelectorAll('[data-play]');
      playButtons.forEach(button => {
        button.addEventListener('click', () => {
          const musicId = button.getAttribute('data-play');
          this.playMusic(musicId);
        });
      });
    },

    /**
     * Reproduz música
     * @param {string} musicId - ID da música
     */
    playMusic(musicId) {
      console.log(`🎵 Playing music: ${musicId}`);

      // Buscar música na última lista de sugestões
      const musicCards = this.messagesContainer.querySelectorAll('.music-card');
      let selectedMusic = null;

      musicCards.forEach(card => {
        const playBtn = card.querySelector(`[data-play="${musicId}"]`);
        if (playBtn) {
          const icon = card.querySelector('.music-card__icon').textContent;
          const title = card.querySelector('.music-card__info h4').textContent;
          const description = card.querySelector('.music-card__info p').textContent;

          selectedMusic = {
            id: musicId,
            icon: icon,
            title: title,
            description: description,
            duration: 180 // 3 minutos padrão
          };
        }
      });

      // Carregar música no player
      if (selectedMusic && window.PlayerSystem) {
        // Coletar todas as músicas da lista atual para criar playlist
        const playlist = [];
        musicCards.forEach(card => {
          const btn = card.querySelector('[data-play]');
          if (btn) {
            const icon = card.querySelector('.music-card__icon').textContent;
            const title = card.querySelector('.music-card__info h4').textContent;
            const description = card.querySelector('.music-card__info p').textContent;

            playlist.push({
              id: btn.getAttribute('data-play'),
              icon: icon,
              title: title,
              description: description,
              duration: 180
            });
          }
        });

        // Encontrar índice da música selecionada
        const startIndex = playlist.findIndex(m => m.id === musicId);

        // Carregar playlist no player
        window.PlayerSystem.loadPlaylist(playlist, startIndex);
        window.PlayerSystem.play();

        // Adicionar mensagem de confirmação
        this.addMessage(`Tocando agora: ${selectedMusic.title}`, 'ai');
      }
    },

    /**
     * Rola para o final das mensagens
     */
    scrollToBottom() {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 100);
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ChatSystem.init();
    });
  } else {
    ChatSystem.init();
  }

  // Expõe API pública
  window.ChatSystem = ChatSystem;

})();