class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [
      { title: "Lo-Fi Focus", description: "Beats para concentração" },
      { title: "Rain Sounds", description: "Sons de chuva relaxantes" },
      { title: "Classical Flow", description: "Piano suave" }
    ];

    // DOM Elements
    this.playBtn = document.getElementById('player-play');
    this.prevBtn = document.getElementById('player-prev');
    this.nextBtn = document.getElementById('player-next');
    this.titleDisplay = document.getElementById('player-title');
    this.descDisplay = document.getElementById('player-description');
    this.volumeBar = document.querySelector('.volume-bar');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    this.playBtn?.addEventListener('click', () => this.togglePlay());
    this.prevBtn?.addEventListener('click', () => this.prevTrack());
    this.nextBtn?.addEventListener('click', () => this.nextTrack());

    // Enable buttons
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.updateControls();

    // Update icon
    const icon = this.playBtn.querySelector('i') || this.playBtn.querySelector('svg');
    if (icon) {
      // If using Lucide, we might need to replace the element or update attribute
      // For simplicity, we'll just toggle the lucide data attribute and re-render if possible
      // But since Lucide replaces the <i> tag with an <svg>, we need to handle that.
      // A simpler way is to just change innerHTML
      this.playBtn.innerHTML = this.isPlaying
        ? '<i data-lucide="pause"></i>'
        : '<i data-lucide="play"></i>';

      if (window.lucide) lucide.createIcons();
    }
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing
    }
  }

  updateDisplay() {
    const track = this.tracks[this.currentTrackIndex];
    if (this.titleDisplay) this.titleDisplay.textContent = track.title;
    if (this.descDisplay) this.descDisplay.textContent = track.description;
  }

  updateControls() {
    // Visual feedback for playing state
    if (this.playBtn) {
      this.playBtn.classList.toggle('playing', this.isPlaying);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.player = new PlayerController();
});