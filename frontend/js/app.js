/**
 * FocusWave Application
 * Main application initialization and timer logic
 */

class FocusWave {
  constructor() {
    // Timer state
    this.timerState = {
      mode: 'focus', // 'focus' | 'short-break' | 'long-break'
      isRunning: false,
      isPaused: false,
      timeRemaining: 25 * 60, // seconds
      intervalId: null
    };

    // Timer settings
    this.settings = {
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      autoStartBreaks: false,
      soundEnabled: true
    };

    // Statistics
    this.stats = {
      pomodorosToday: 0,
      timeFocusedToday: 0, // minutes
      currentStreak: 0
    };

    // DOM elements
    this.elements = {
      timerDisplay: document.querySelector('.timer__display time'),
      timerLabel: document.querySelector('.timer__label'),
      startButton: document.getElementById('btn-start'),
      resetButton: document.getElementById('btn-reset'),
      modeButtons: document.querySelectorAll('[data-mode]')
    };

    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('🌊 FocusWave initialized');

    // Set up event listeners
    this.setupEventListeners();

    // Load saved data from localStorage
    this.loadData();

    // Update initial display
    this.updateDisplay();

    // Update stats display
    this.updateStatsDisplay();
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Start/Pause button
    this.elements.startButton.addEventListener('click', () => {
      if (this.timerState.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    });

    // Reset button
    this.elements.resetButton.addEventListener('click', () => {
      this.resetTimer();
    });

    // Mode selection buttons
    this.elements.modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const mode = button.getAttribute('data-mode');
        this.changeMode(mode);
      });
    });

    // Handle page visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.timerState.isRunning) {
        // Store the time when page became hidden
        this.timerState.hiddenAt = Date.now();
      } else if (!document.hidden && this.timerState.hiddenAt) {
        // Calculate elapsed time while hidden
        const elapsed = Math.floor((Date.now() - this.timerState.hiddenAt) / 1000);
        this.timerState.timeRemaining = Math.max(0, this.timerState.timeRemaining - elapsed);
        this.timerState.hiddenAt = null;

        if (this.timerState.timeRemaining === 0) {
          this.completeTimer();
        } else {
          this.updateDisplay();
        }
      }
    });
  }

  /**
   * Start the timer
   */
  startTimer() {
    if (this.timerState.isRunning) return;

    this.timerState.isRunning = true;
    this.timerState.isPaused = false;

    // Update button
    this.elements.startButton.textContent = 'Pausar';
    this.elements.startButton.classList.add('glass-button--warning');
    this.elements.resetButton.disabled = false;

    // Start countdown
    this.timerState.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    console.log('▶️ Timer started');
  }

  /**
   * Pause the timer
   */
  pauseTimer() {
    if (!this.timerState.isRunning) return;

    this.timerState.isRunning = false;
    this.timerState.isPaused = true;

    // Update button
    this.elements.startButton.textContent = 'Continuar';
    this.elements.startButton.classList.remove('glass-button--warning');

    // Stop countdown
    if (this.timerState.intervalId) {
      clearInterval(this.timerState.intervalId);
      this.timerState.intervalId = null;
    }

    console.log('⏸️ Timer paused');
  }

  /**
   * Reset the timer to initial state
   */
  resetTimer() {
    // Stop timer
    if (this.timerState.intervalId) {
      clearInterval(this.timerState.intervalId);
      this.timerState.intervalId = null;
    }

    // Reset state
    this.timerState.isRunning = false;
    this.timerState.isPaused = false;
    this.timerState.timeRemaining = this.getModeTime(this.timerState.mode);

    // Update UI
    this.elements.startButton.textContent = 'Iniciar';
    this.elements.startButton.classList.remove('glass-button--warning');
    this.elements.resetButton.disabled = true;

    this.updateDisplay();

    console.log('🔄 Timer reset');
  }

  /**
   * Timer tick (called every second)
   */
  tick() {
    if (this.timerState.timeRemaining > 0) {
      this.timerState.timeRemaining--;
      this.updateDisplay();
    } else {
      this.completeTimer();
    }
  }

  /**
   * Complete the timer (when it reaches 0)
   */
  completeTimer() {
    // Stop timer
    if (this.timerState.intervalId) {
      clearInterval(this.timerState.intervalId);
      this.timerState.intervalId = null;
    }

    // Play sound if enabled
    if (this.settings.soundEnabled) {
      this.playNotificationSound();
    }

    // Show notification
    this.showNotification();

    // Update statistics if it was a focus session
    if (this.timerState.mode === 'focus') {
      this.stats.pomodorosToday++;
      this.stats.timeFocusedToday += this.settings.focusTime;
      this.updateStatsDisplay();
      this.saveData();
    }

    // Auto-start breaks if enabled
    if (this.settings.autoStartBreaks && this.timerState.mode === 'focus') {
      // Determine next mode (short or long break)
      const nextMode = this.stats.pomodorosToday % 4 === 0 ? 'long-break' : 'short-break';
      this.changeMode(nextMode);
      setTimeout(() => this.startTimer(), 1000);
    } else {
      // Reset to initial state
      this.timerState.isRunning = false;
      this.elements.startButton.textContent = 'Iniciar';
      this.elements.startButton.classList.remove('glass-button--warning');
    }

    console.log('✅ Timer completed');
  }

  /**
   * Change timer mode
   * @param {string} mode - 'focus' | 'short-break' | 'long-break'
   */
  changeMode(mode) {
    // Don't allow mode change while timer is running
    if (this.timerState.isRunning) {
      console.warn('Cannot change mode while timer is running');
      return;
    }

    this.timerState.mode = mode;
    this.timerState.timeRemaining = this.getModeTime(mode);

    // Update UI
    this.updateModeButtons();
    this.updateDisplay();

    console.log(`🔄 Mode changed to: ${mode}`);
  }

  /**
   * Get time for a specific mode
   * @param {string} mode - Timer mode
   * @returns {number} Time in seconds
   */
  getModeTime(mode) {
    switch (mode) {
      case 'focus':
        return this.settings.focusTime * 60;
      case 'short-break':
        return this.settings.shortBreakTime * 60;
      case 'long-break':
        return this.settings.longBreakTime * 60;
      default:
        return 25 * 60;
    }
  }

  /**
   * Update timer display
   */
  updateDisplay() {
    const minutes = Math.floor(this.timerState.timeRemaining / 60);
    const seconds = this.timerState.timeRemaining % 60;

    // Format time as MM:SS
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update display
    this.elements.timerDisplay.textContent = timeString;
    this.elements.timerDisplay.setAttribute('datetime', `PT${minutes}M${seconds}S`);

    // Update label based on mode
    const labels = {
      'focus': 'Minutos de Foco',
      'short-break': 'Pausa Curta',
      'long-break': 'Pausa Longa'
    };
    this.elements.timerLabel.textContent = labels[this.timerState.mode];

    // Update document title
    document.title = `${timeString} - FocusWave`;
  }

  /**
   * Update mode selection buttons
   */
  updateModeButtons() {
    this.elements.modeButtons.forEach(button => {
      const buttonMode = button.getAttribute('data-mode');
      const isActive = buttonMode === this.timerState.mode;

      button.classList.toggle('timer__mode-button--active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });
  }

  /**
   * Update statistics display
   */
  updateStatsDisplay() {
    // Pomodoros count
    const pomodoroValue = document.querySelector('.stats-card__value[aria-label*="pomodoros"]');
    if (pomodoroValue) {
      pomodoroValue.textContent = this.stats.pomodorosToday;
      pomodoroValue.setAttribute('aria-label', `${this.stats.pomodorosToday} pomodoros completados`);
    }

    // Time focused
    const timeValue = document.querySelector('.stats-card__value[aria-label*="minutos"]');
    if (timeValue) {
      const hours = Math.floor(this.stats.timeFocusedToday / 60);
      const minutes = this.stats.timeFocusedToday % 60;
      timeValue.textContent = `${hours}h ${minutes}m`;
      timeValue.setAttribute('aria-label', `${hours} horas e ${minutes} minutos focados`);
    }

    // Streak
    const streakValue = document.querySelector('.stats-card__value[aria-label*="sequência"]');
    if (streakValue) {
      streakValue.textContent = this.stats.currentStreak;
      streakValue.setAttribute('aria-label', `${this.stats.currentStreak} dias de sequência`);
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    // Create a simple beep using Web Audio API
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

  /**
   * Show browser notification
   */
  showNotification() {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // Request permission if needed
    if (Notification.permission === 'granted') {
      this.displayNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.displayNotification();
        }
      });
    }
  }

  /**
   * Display the notification
   */
  displayNotification() {
    const messages = {
      'focus': {
        title: '🎉 Foco Completo!',
        body: 'Parabéns! Você completou uma sessão de foco. Hora de uma pausa!'
      },
      'short-break': {
        title: '⏰ Pausa Finalizada!',
        body: 'Sua pausa curta terminou. Pronto para focar novamente?'
      },
      'long-break': {
        title: '✨ Pausa Longa Finalizada!',
        body: 'Você está revigorado! Hora de voltar ao trabalho.'
      }
    };

    const message = messages[this.timerState.mode];
    new Notification(message.title, {
      body: message.body,
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/badge-72.png'
    });
  }

  /**
   * Save data to localStorage
   */
  saveData() {
    const data = {
      stats: this.stats,
      settings: this.settings,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('focuswave-data', JSON.stringify(data));
  }

  /**
   * Load data from localStorage
   */
  loadData() {
    try {
      const data = localStorage.getItem('focuswave-data');
      if (data) {
        const parsed = JSON.parse(data);

        // Load stats
        if (parsed.stats) {
          // Reset daily stats if it's a new day
          const lastUpdate = new Date(parsed.lastUpdated);
          const today = new Date();

          if (lastUpdate.toDateString() !== today.toDateString()) {
            // New day - reset daily stats
            this.stats.pomodorosToday = 0;
            this.stats.timeFocusedToday = 0;
          } else {
            this.stats = { ...this.stats, ...parsed.stats };
          }
        }

        // Load settings
        if (parsed.settings) {
          this.settings = { ...this.settings, ...parsed.settings };
        }

        console.log('📊 Data loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.focusWave = new FocusWave();
  });
} else {
  window.focusWave = new FocusWave();
}
