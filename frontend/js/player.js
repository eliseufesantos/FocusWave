/**
 * Player System
 * Sistema de player de música simples
 */

(function() {
  'use strict';

  const PlayerSystem = {
    // Estado do player
    state: {
      currentMusic: null,
      playlist: [],
      isPlaying: false,
      currentTime: 0,
      duration: 180, // 3 minutos padrão (simulação)
      isShuffle: false,
      currentIndex: -1
    },

    // Elementos DOM
    elements: {
      playerIcon: null,
      playerTitle: null,
      playerDescription: null,
      playBtn: null,
      pauseBtn: null,
      prevBtn: null,
      nextBtn: null,
      shuffleBtn: null,
      progressBar: null,
      progressFill: null,
      currentTimeEl: null,
      totalTimeEl: null
    },

    /**
     * Inicializa o player
     */
    init() {
      this.cacheElements();
      this.setupEventListeners();
      console.log('🎵 Player System initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      this.elements.playerIcon = document.querySelector('.player__icon');
      this.elements.playerTitle = document.querySelector('.player__title');
      this.elements.playerDescription = document.querySelector('.player__description');
      this.elements.playBtn = document.getElementById('player-play');
      this.elements.prevBtn = document.getElementById('player-prev');
      this.elements.nextBtn = document.getElementById('player-next');
      this.elements.shuffleBtn = document.getElementById('player-shuffle');
      this.elements.progressBar = document.querySelector('.progress-bar');
      this.elements.progressFill = document.querySelector('.progress-bar__fill');
      this.elements.currentTimeEl = document.querySelector('.progress-time__current');
      this.elements.totalTimeEl = document.querySelector('.progress-time__total');
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
      // Play/Pause button
      if (this.elements.playBtn) {
        this.elements.playBtn.addEventListener('click', () => {
          if (this.state.isPlaying) {
            this.pause();
          } else {
            this.play();
          }
        });
      }

      // Previous button
      if (this.elements.prevBtn) {
        this.elements.prevBtn.addEventListener('click', () => this.previous());
      }

      // Next button
      if (this.elements.nextBtn) {
        this.elements.nextBtn.addEventListener('click', () => this.next());
      }

      // Shuffle button
      if (this.elements.shuffleBtn) {
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
      }

      // Progress bar click
      if (this.elements.progressBar) {
        this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
      }
    },

    /**
     * Carrega uma música
     * @param {Object} music - Objeto da música
     */
    loadMusic(music) {
      this.state.currentMusic = music;
      this.state.currentTime = 0;
      this.state.duration = music.duration || 180;

      // Update UI
      if (this.elements.playerIcon) {
        this.elements.playerIcon.textContent = music.icon || '🎵';
      }
      if (this.elements.playerTitle) {
        this.elements.playerTitle.textContent = music.title;
      }
      if (this.elements.playerDescription) {
        this.elements.playerDescription.textContent = music.description;
      }
      if (this.elements.totalTimeEl) {
        this.elements.totalTimeEl.textContent = this.formatTime(this.state.duration);
      }

      // Enable buttons
      this.enableControls();

      console.log(`🎵 Loaded: ${music.title}`);
    },

    /**
     * Carrega uma playlist
     * @param {Array} playlist - Array de músicas
     * @param {number} startIndex - Índice inicial
     */
    loadPlaylist(playlist, startIndex = 0) {
      this.state.playlist = playlist;
      this.state.currentIndex = startIndex;

      if (playlist.length > 0) {
        this.loadMusic(playlist[startIndex]);
      }
    },

    /**
     * Toca a música atual
     */
    play() {
      if (!this.state.currentMusic) return;

      this.state.isPlaying = true;

      // Update button
      if (this.elements.playBtn) {
        this.elements.playBtn.querySelector('span').textContent = '⏸️';
      }

      // Add to history
      if (window.HistorySystem) {
        window.HistorySystem.addToHistory(this.state.currentMusic);
      }

      // Start progress simulation
      this.startProgressSimulation();

      console.log(`▶️ Playing: ${this.state.currentMusic.title}`);
    },

    /**
     * Pausa a música
     */
    pause() {
      this.state.isPlaying = false;

      // Update button
      if (this.elements.playBtn) {
        this.elements.playBtn.querySelector('span').textContent = '▶️';
      }

      // Stop progress simulation
      this.stopProgressSimulation();

      console.log('⏸️ Paused');
    },

    /**
     * Música anterior
     */
    previous() {
      if (this.state.playlist.length === 0) return;

      // Se passou menos de 3 segundos, vai para música anterior
      // Senão, reinicia a música atual
      if (this.state.currentTime < 3) {
        this.state.currentIndex = (this.state.currentIndex - 1 + this.state.playlist.length) % this.state.playlist.length;
        this.loadMusic(this.state.playlist[this.state.currentIndex]);

        if (this.state.isPlaying) {
          this.play();
        }
      } else {
        this.state.currentTime = 0;
        this.updateProgress();
      }

      console.log('⏮ Previous');
    },

    /**
     * Próxima música
     */
    next() {
      if (this.state.playlist.length === 0) return;

      if (this.state.isShuffle) {
        // Random index diferente do atual
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.state.playlist.length);
        } while (newIndex === this.state.currentIndex && this.state.playlist.length > 1);
        this.state.currentIndex = newIndex;
      } else {
        this.state.currentIndex = (this.state.currentIndex + 1) % this.state.playlist.length;
      }

      this.loadMusic(this.state.playlist[this.state.currentIndex]);

      if (this.state.isPlaying) {
        this.play();
      }

      console.log('⏭ Next');
    },

    /**
     * Toggle shuffle
     */
    toggleShuffle() {
      this.state.isShuffle = !this.state.isShuffle;

      // Update button visual
      if (this.elements.shuffleBtn) {
        if (this.state.isShuffle) {
          this.elements.shuffleBtn.style.background = 'var(--color-accent)';
          this.elements.shuffleBtn.style.borderColor = 'var(--color-accent)';
        } else {
          this.elements.shuffleBtn.style.background = 'var(--color-glass-bg)';
          this.elements.shuffleBtn.style.borderColor = 'var(--color-glass-border)';
        }
      }

      console.log(`🔀 Shuffle: ${this.state.isShuffle ? 'ON' : 'OFF'}`);
    },

    /**
     * Seek no progresso
     * @param {Event} e - Click event
     */
    seek(e) {
      if (!this.state.currentMusic) return;

      const rect = this.elements.progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.state.currentTime = Math.floor(percent * this.state.duration);

      this.updateProgress();

      console.log(`Seeked to: ${this.formatTime(this.state.currentTime)}`);
    },

    /**
     * Inicia simulação de progresso
     */
    startProgressSimulation() {
      this.stopProgressSimulation(); // Limpar qualquer intervalo anterior

      this.progressInterval = setInterval(() => {
        if (this.state.currentTime >= this.state.duration) {
          // Música acabou - próxima
          this.next();
        } else {
          this.state.currentTime++;
          this.updateProgress();
        }
      }, 1000);
    },

    /**
     * Para simulação de progresso
     */
    stopProgressSimulation() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    },

    /**
     * Atualiza a barra de progresso
     */
    updateProgress() {
      const percent = (this.state.currentTime / this.state.duration) * 100;

      if (this.elements.progressFill) {
        this.elements.progressFill.style.width = `${percent}%`;
      }

      if (this.elements.currentTimeEl) {
        this.elements.currentTimeEl.textContent = this.formatTime(this.state.currentTime);
      }
    },

    /**
     * Habilita controles
     */
    enableControls() {
      if (this.elements.playBtn) this.elements.playBtn.disabled = false;
      if (this.elements.prevBtn) this.elements.prevBtn.disabled = false;
      if (this.elements.nextBtn) this.elements.nextBtn.disabled = false;
      if (this.elements.shuffleBtn) this.elements.shuffleBtn.disabled = false;
    },

    /**
     * Desabilita controles
     */
    disableControls() {
      if (this.elements.playBtn) this.elements.playBtn.disabled = true;
      if (this.elements.prevBtn) this.elements.prevBtn.disabled = true;
      if (this.elements.nextBtn) this.elements.nextBtn.disabled = true;
      if (this.elements.shuffleBtn) this.elements.shuffleBtn.disabled = true;
    },

    /**
     * Formata tempo em MM:SS
     * @param {number} seconds - Tempo em segundos
     * @returns {string} Tempo formatado
     */
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${String(secs).padStart(2, '0')}`;
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PlayerSystem.init();
    });
  } else {
    PlayerSystem.init();
  }

  // Expõe API pública
  window.PlayerSystem = PlayerSystem;

})();