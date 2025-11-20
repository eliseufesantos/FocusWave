/**
 * Timer Pomodoro
 * Lógica básica do timer com sincronização entre card e modal
 */

(function() {
  'use strict';

  const TimerController = {
    // Estado do timer
    state: {
      currentTime: 1500, // 25 minutos em segundos
      totalTime: 1500,
      isRunning: false,
      isPaused: false,
      mode: 'focus', // 'focus' | 'break'
      intervalId: null
    },

    // Elementos DOM
    elements: {
      // Card
      cardTime: null,
      cardStatus: null,

      // Modal
      modalTime: null,
      modalProgress: null,
      modalStatusBadge: null,
      playBtn: null,
      pauseBtn: null,
      resetBtn: null,
      focusDuration: null,
      breakDuration: null
    },

    /**
     * Inicializa o timer
     */
    init() {
      this.cacheElements();
      this.setupEventListeners();
      this.updateDisplay();
      console.log('⏱️ Timer initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      // Card elements
      this.elements.cardTime = document.querySelector('.timer-card__time');
      this.elements.cardStatus = document.querySelector('.timer-card__status');

      // Modal elements
      this.elements.modalTime = document.querySelector('.timer-modal__time');
      this.elements.modalProgress = document.querySelector('.timer-modal__progress');
      this.elements.modalStatusBadge = document.querySelector('.status-badge');
      this.elements.playBtn = document.getElementById('timer-play');
      this.elements.pauseBtn = document.getElementById('timer-pause');
      this.elements.resetBtn = document.getElementById('timer-reset');
      this.elements.focusDuration = document.getElementById('focus-duration');
      this.elements.breakDuration = document.getElementById('break-duration');
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
      // Play button
      if (this.elements.playBtn) {
        this.elements.playBtn.addEventListener('click', () => this.startTimer());
      }

      // Pause button
      if (this.elements.pauseBtn) {
        this.elements.pauseBtn.addEventListener('click', () => this.pauseTimer());
      }

      // Reset button
      if (this.elements.resetBtn) {
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
      }

      // Duration change
      if (this.elements.focusDuration) {
        this.elements.focusDuration.addEventListener('change', (e) => {
          if (!this.state.isRunning) {
            const newTime = parseInt(e.target.value);
            this.state.currentTime = newTime;
            this.state.totalTime = newTime;
            this.updateDisplay();
          }
        });
      }
    },

    /**
     * Inicia o timer
     */
    startTimer() {
      if (this.state.isRunning) return;

      this.state.isRunning = true;
      this.state.isPaused = false;

      // Update UI
      this.updateButtonStates();
      this.updateStatus('running');

      // Start countdown
      this.state.intervalId = setInterval(() => {
        this.tick();
      }, 1000);

      console.log('▶️ Timer started');
    },

    /**
     * Pausa o timer
     */
    pauseTimer() {
      if (!this.state.isRunning) return;

      this.state.isRunning = false;
      this.state.isPaused = true;

      // Stop countdown
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }

      // Update UI
      this.updateButtonStates();
      this.updateStatus('paused');

      console.log('⏸️ Timer paused');
    },

    /**
     * Reseta o timer
     */
    resetTimer() {
      // Stop timer
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }

      // Reset state
      this.state.isRunning = false;
      this.state.isPaused = false;
      this.state.currentTime = this.state.totalTime;

      // Update UI
      this.updateButtonStates();
      this.updateStatus('ready');
      this.updateDisplay();

      console.log('↻ Timer reset');
    },

    /**
     * Timer tick (chamado a cada segundo)
     */
    tick() {
      if (this.state.currentTime > 0) {
        this.state.currentTime--;
        this.updateDisplay();
      } else {
        this.completeTimer();
      }
    },

    /**
     * Completa o timer
     */
    completeTimer() {
      // Stop timer
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }

      this.state.isRunning = false;

      // Play sound (simple beep)
      this.playNotificationSound();

      // Show notification
      alert('⏰ Timer concluído!');

      // Reset
      this.resetTimer();

      console.log('✅ Timer completed');
    },

    /**
     * Atualiza o display
     */
    updateDisplay() {
      const timeString = this.formatTime(this.state.currentTime);

      // Update card
      if (this.elements.cardTime) {
        this.elements.cardTime.textContent = timeString;
      }

      // Update modal
      if (this.elements.modalTime) {
        this.elements.modalTime.textContent = timeString;
      }

      // Update progress circle
      this.updateProgressCircle();
    },

    /**
     * Atualiza o círculo de progresso
     */
    updateProgressCircle() {
      if (!this.elements.modalProgress) return;

      const progress = this.state.currentTime / this.state.totalTime;
      const circumference = 2 * Math.PI * 90; // 2πr where r=90
      const offset = circumference * (1 - progress);

      this.elements.modalProgress.style.strokeDashoffset = offset;
    },

    /**
     * Atualiza o status visual
     * @param {string} status - 'ready' | 'running' | 'paused' | 'break'
     */
    updateStatus(status) {
      // Update card status text
      const statusTexts = {
        ready: 'Pronto',
        running: 'Focando...',
        paused: 'Pausado',
        break: 'Descansando'
      };

      if (this.elements.cardStatus) {
        this.elements.cardStatus.textContent = statusTexts[status] || 'Pronto';
      }

      // Update modal badge
      const badgeTexts = {
        ready: 'Pronto para focar',
        running: 'Focando agora',
        paused: 'Timer pausado',
        break: 'Hora do descanso'
      };

      if (this.elements.modalStatusBadge) {
        this.elements.modalStatusBadge.textContent = badgeTexts[status] || 'Pronto';

        // Update badge class
        this.elements.modalStatusBadge.className = 'status-badge';
        this.elements.modalStatusBadge.classList.add(`status-badge--${status}`);
      }

      // Update progress circle class
      if (this.elements.modalProgress) {
        this.elements.modalProgress.className = 'timer-modal__progress';
        this.elements.modalProgress.classList.add(`timer-modal__progress--${status}`);
      }
    },

    /**
     * Atualiza estados dos botões
     */
    updateButtonStates() {
      if (this.elements.playBtn) {
        this.elements.playBtn.disabled = this.state.isRunning;
      }

      if (this.elements.pauseBtn) {
        this.elements.pauseBtn.disabled = !this.state.isRunning;
      }
    },

    /**
     * Formata tempo em MM:SS
     * @param {number} seconds - Tempo em segundos
     * @returns {string} Tempo formatado
     */
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    /**
     * Toca som de notificação
     */
    playNotificationSound() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      TimerController.init();
    });
  } else {
    TimerController.init();
  }

  // Expõe API pública
  window.TimerController = TimerController;

})();