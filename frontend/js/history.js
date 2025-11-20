/**
 * History System
 * Sistema de histórico de músicas tocadas
 */

(function() {
  'use strict';

  const HistorySystem = {
    history: [],
    maxPreviewItems: 3,

    elements: {
      preview: null,
      full: null,
      expandBtn: null,
      searchInput: null
    },

    /**
     * Inicializa o sistema de histórico
     */
    init() {
      this.cacheElements();
      this.loadFromStorage();
      this.attachEventListeners();
      this.render();
      console.log('📜 History System initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      this.elements.preview = document.getElementById('history-preview');
      this.elements.full = document.getElementById('history-full');
      this.elements.expandBtn = document.querySelector('.history__expand-btn');
      this.elements.searchInput = document.getElementById('history-search');
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener('input', (e) => {
          this.filterHistory(e.target.value);
        });
      }
    },

    /**
     * Adiciona música ao histórico
     * @param {Object} music - Objeto da música
     */
    addToHistory(music) {
      const entry = {
        ...music,
        playedAt: Date.now(),
        id: `${music.id}-${Date.now()}`
      };

      // Adicionar no início
      this.history.unshift(entry);

      // Limitar a 50 itens
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50);
      }

      this.saveToStorage();
      this.render();

      console.log(`📜 Added to history: ${music.title}`);
    },

    /**
     * Renderiza histórico
     */
    render() {
      this.renderPreview();
      this.renderFull();
    },

    /**
     * Renderiza preview (primeiras 3 músicas)
     */
    renderPreview() {
      const preview = this.history.slice(0, this.maxPreviewItems);

      if (preview.length === 0) {
        this.elements.preview.innerHTML = '<p class="history__empty">Nenhuma música tocada ainda</p>';
        if (this.elements.expandBtn) {
          this.elements.expandBtn.hidden = true;
        }
        return;
      }

      this.elements.preview.innerHTML = preview.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      if (this.elements.expandBtn) {
        this.elements.expandBtn.hidden = this.history.length <= this.maxPreviewItems;
      }

      this.attachItemListeners();
    },

    /**
     * Renderiza lista completa
     */
    renderFull() {
      if (!this.elements.full) return;

      if (this.history.length === 0) {
        this.elements.full.innerHTML = '<p class="history__empty">Nenhuma música no histórico</p>';
        return;
      }

      this.elements.full.innerHTML = this.history.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      this.attachItemListeners();
    },

    /**
     * Cria HTML de um item do histórico
     * @param {Object} item - Item do histórico
     * @returns {string} HTML string
     */
    createHistoryItemHTML(item) {
      const timeAgo = this.getTimeAgo(item.playedAt);

      return `
        <div class="history-item" data-music-id="${item.id}">
          <span class="history-item__icon">${item.icon || '🎵'}</span>
          <div class="history-item__info">
            <div class="history-item__title">${item.title}</div>
            <div class="history-item__time">${timeAgo}</div>
          </div>
          <button class="history-item__play" data-play-history="${item.id}">
            <span>▶️</span>
          </button>
        </div>
      `;
    },

    /**
     * Anexa listeners aos itens
     */
    attachItemListeners() {
      // Botões de play
      document.querySelectorAll('[data-play-history]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const musicId = btn.dataset.playHistory;
          const music = this.history.find(m => m.id === musicId);

          if (music && window.PlayerSystem) {
            window.PlayerSystem.loadMusic(music);
            window.PlayerSystem.play();
          }
        });
      });

      // Clique no item inteiro (carrega música sem tocar)
      document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          const musicId = item.dataset.musicId;
          const music = this.history.find(m => m.id === musicId);

          if (music && window.PlayerSystem) {
            window.PlayerSystem.loadMusic(music);
          }
        });
      });
    },

    /**
     * Filtra histórico por busca
     * @param {string} query - Termo de busca
     */
    filterHistory(query) {
      if (!query.trim()) {
        this.renderFull();
        return;
      }

      const filtered = this.history.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        this.elements.full.innerHTML = '<p class="history__empty">Nenhuma música encontrada</p>';
        return;
      }

      this.elements.full.innerHTML = filtered.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      this.attachItemListeners();
    },

    /**
     * Calcula tempo relativo (ex: "5min atrás")
     * @param {number} timestamp - Timestamp em ms
     * @returns {string} Tempo relativo
     */
    getTimeAgo(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Agora';
      if (minutes < 60) return `${minutes}min atrás`;
      if (hours < 24) return `${hours}h atrás`;
      return `${days}d atrás`;
    },

    /**
     * Salva histórico no localStorage
     */
    saveToStorage() {
      try {
        localStorage.setItem('focuswave_history', JSON.stringify(this.history));
      } catch (e) {
        console.error('Erro ao salvar histórico:', e);
      }
    },

    /**
     * Carrega histórico do localStorage
     */
    loadFromStorage() {
      try {
        const stored = localStorage.getItem('focuswave_history');
        if (stored) {
          this.history = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Erro ao carregar histórico:', e);
        this.history = [];
      }
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      HistorySystem.init();
    });
  } else {
    HistorySystem.init();
  }

  // Expõe API pública
  window.HistorySystem = HistorySystem;

})();