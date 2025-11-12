// Signature: The Awakening - Audio Controller
class AudioController {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        
        this.init();
    }

    init() {
        this.setupAudioElements();
        this.setupControls();
        this.setupScrollTriggers();
    }

    setupAudioElements() {
        // Get all audio elements
        this.audioElements = {
            song1: document.getElementById('song1'),
            song2: document.getElementById('song2'),
            song3: document.getElementById('song3'),
            song4: document.getElementById('song4'),
            song5: document.getElementById('song5'),
            song6: document.getElementById('song6'),
            song7: document.getElementById('song7'),
            song8: document.getElementById('song8'),
            song9: document.getElementById('song9'),
            song10: document.getElementById('song10'),
            song11: document.getElementById('song11')
        };

        // Set initial volume for all audio elements
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = this.volume;
                audio.preload = 'metadata';
            }
        });
    }

    setupControls() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Volume control
        const volumeSlider = document.getElementById('volume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }

        // Mute button
        const muteBtn = document.getElementById('mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }

        // Add click listeners to all song sections
        document.querySelectorAll('.song-section').forEach(section => {
            section.addEventListener('click', () => {
                const songId = section.getAttribute('data-song');
                if (songId) {
                    this.playSong(songId);
                }
            });
        });
    }

    setupScrollTriggers() {
        // Auto-play songs when scrolling into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const songId = entry.target.getAttribute('data-song');
                    if (songId && songId !== this.currentSong) {
                        this.playSong(songId);
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe all song sections
        document.querySelectorAll('.song-section').forEach(section => {
            observer.observe(section);
        });
    }

    playSong(songId) {
        // Stop current song
        if (this.currentSong && this.audioElements[this.currentSong]) {
            this.audioElements[this.currentSong].pause();
            this.audioElements[this.currentSong].currentTime = 0;
        }

        // Play new song
        const audio = this.audioElements[songId];
        if (audio) {
            this.currentSong = songId;
            audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.updateCurrentSong(songId);
            }).catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }

    togglePlayPause() {
        if (!this.currentSong) {
            // If no song is selected, start with song1
            this.playSong('song1');
            return;
        }

        const audio = this.audioElements[this.currentSong];
        if (!audio) return;

        if (this.isPlaying) {
            audio.pause();
            this.isPlaying = false;
        } else {
            audio.play().then(() => {
                this.isPlaying = true;
            }).catch(error => {
                console.log('Audio play failed:', error);
            });
        }
        
        this.updatePlayButton();
    }

    setVolume(volume) {
        this.volume = volume;
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = volume;
            }
        });
    }

    toggleMute() {
        const isMuted = this.volume === 0;
        const newVolume = isMuted ? 0.7 : 0;
        this.setVolume(newVolume);
        
        const volumeSlider = document.getElementById('volume');
        if (volumeSlider) {
            volumeSlider.value = newVolume * 100;
        }
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
    }

    updateCurrentSong(songId) {
        const currentSongSpan = document.getElementById('current-song');
        if (currentSongSpan) {
            const songTitles = {
                song1: "Your Mind's On Lockdown",
                song2: "Vengeance",
                song3: "Attacks The Brain",
                song4: "For Your Protection",
                song5: "Confirmation",
                song6: "Numb",
                song7: "Life Without Instructions",
                song8: "Meditation (Ride That Wave)",
                song9: "Tree Of Life",
                song10: "Amazing Me",
                song11: "Self Explorer"
            };
            currentSongSpan.textContent = songTitles[songId] || "Ready to Begin";
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioController = new AudioController();
    console.log('Signature: The Awakening - Audio System Loaded');
});
