class PomodoroTimer {
  constructor() {
    this.timeLeft = 25 * 60;
    this.isRunning = false;
    this.timerId = null;
    this.mode = 'focus'; // 'focus', 'break'

    // DOM Elements (Status Bar)
    this.sbTimeDisplay = document.getElementById('status-time');
    this.sbStatusDisplay = document.getElementById('status-state');
    this.sbPlayBtn = document.getElementById('sb-play');
    this.sbPauseBtn = document.getElementById('sb-pause');
    this.sbResetBtn = document.getElementById('sb-reset');

    // DOM Elements (Modal)
    this.modalTimeDisplay = document.querySelector('.timer-modal__time');
    this.modalStatusBadge = document.querySelector('.status-badge');
    this.modalPlayBtn = document.getElementById('timer-play');
    this.modalPauseBtn = document.getElementById('timer-pause');
    this.modalResetBtn = document.getElementById('timer-reset');

    // Settings
    this.focusDurationInput = document.getElementById('focus-duration');
    this.breakDurationInput = document.getElementById('break-duration');

    // Progress Circle
    this.progressCircle = document.querySelector('.timer-modal__progress');
    this.circumference = 2 * Math.PI * 90; // r=90

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }

  setupEventListeners() {
    // Status Bar Controls
    this.sbPlayBtn?.addEventListener('click', () => this.start());
    this.sbPauseBtn?.addEventListener('click', () => this.pause());
    this.sbResetBtn?.addEventListener('click', () => this.reset());

    // Modal Controls
    this.modalPlayBtn?.addEventListener('click', () => this.start());
    this.modalPauseBtn?.addEventListener('click', () => this.pause());
    this.modalResetBtn?.addEventListener('click', () => this.reset());

    // Settings
    this.focusDurationInput?.addEventListener('change', () => this.reset());
    this.breakDurationInput?.addEventListener('change', () => {
      if (this.mode === 'break') this.reset();
    });
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.updateControlsState();

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();

      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timerId);
    this.updateControlsState();
  }

  reset() {
    this.pause();

    const focusDuration = parseInt(this.focusDurationInput.value) || 1500;
    const breakDuration = parseInt(this.breakDurationInput.value) || 300;

    this.timeLeft = this.mode === 'focus' ? focusDuration : breakDuration;
    this.updateDisplay();
  }

  complete() {
    this.pause();
    this.playNotificationSound();

    // Toggle mode
    this.mode = this.mode === 'focus' ? 'break' : 'focus';

    // Show notification
    if (Notification.permission === "granted") {
      new Notification("FocusWave", {
        body: this.mode === 'focus' ? "Hora de focar!" : "Hora de descansar!",
        icon: "/favicon.ico"
      });
    }

    this.reset();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update Status Bar
    if (this.sbTimeDisplay) this.sbTimeDisplay.textContent = timeString;
    if (this.sbStatusDisplay) this.sbStatusDisplay.textContent = this.mode === 'focus' ? 'Foco' : 'Pausa';

    // Update Modal
    if (this.modalTimeDisplay) this.modalTimeDisplay.textContent = timeString;
    if (this.modalStatusBadge) {
      this.modalStatusBadge.textContent = this.mode === 'focus' ? 'Pronto para focar' : 'Hora de descansar';
    }

    // Update Title
    document.title = `${timeString} - FocusWave`;

    // Update Circle Progress
    this.updateProgressCircle();
  }

  updateProgressCircle() {
    if (!this.progressCircle) return;

    const totalTime = this.mode === 'focus'
      ? (parseInt(this.focusDurationInput.value) || 1500)
      : (parseInt(this.breakDurationInput.value) || 300);

    const progress = this.timeLeft / totalTime;
    const dashoffset = this.circumference * (1 - progress);

    this.progressCircle.style.strokeDashoffset = dashoffset;
  }

  updateControlsState() {
    const isRunning = this.isRunning;

    // Helper to toggle buttons
    const toggle = (play, pause) => {
      if (play) {
        play.disabled = isRunning;
        play.style.display = isRunning ? 'none' : 'flex';
      }
      if (pause) {
        pause.disabled = !isRunning;
        pause.style.display = isRunning ? 'flex' : 'none';
      }
    };

    toggle(this.sbPlayBtn, this.sbPauseBtn);
    toggle(this.modalPlayBtn, this.modalPauseBtn);
  }

  playNotificationSound() {
    // Simple beep
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => osc.stop(), 200);
    } catch (e) {
      console.error("Audio error", e);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.timer = new PomodoroTimer();
});