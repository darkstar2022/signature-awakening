// ====================================
// SIGNATURE: THE AWAKENING
// Interactive Audio Controller & Scroll Triggers
// by Dark Star Energy
// ====================================

// Audio Controller Class
class AudioController {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.songs = {};
        this.songNames = {
            'song1': 'Your Mind\'s On Lockdown',
            'song2': 'Vengeance',
            'song3': 'Attacks The Brain',
            'song4': 'For Your Protection',
            'song5': 'Confirmation',
            'song6': 'Numb',
            'song7': 'Life Without Instructions',
            'song8': 'Meditation (Ride That Wave)',
            'song9': 'Tree Of Life',
            'song10': 'Amazing Me',
            'song11': 'Self Explorer'
        };
        this.init();
    }
    
    init() {
        console.log('🎵 Initializing Audio Controller...');
        
        // Get all audio elements
        for (let i = 1; i <= 11; i++) {
            const audio = document.getElementById(`song${i}`);
            if (audio) {
                this.songs[`song${i}`] = audio;
                audio.volume = this.volume;
                
                // Add event listeners
                audio.addEventListener('ended', () => this.onSongEnd());
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading song${i}:`, e);
                });
            } else {
                console.warn(`Warning: song${i} audio element not found`);
            }
        }
        
        this.setupControls();
        console.log('✅ Audio Controller initialized with', Object.keys(this.songs).length, 'songs');
    }
    
    setupControls() {
        const playPauseBtn = document.getElementById('play-pause');
        const muteBtn = document.getElementById('mute');
        const volumeSlider = document.getElementById('volume');
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }
        
        console.log('🎛️ Audio controls configured');
    }
    
    playSong(songId) {
        console.log(`🎵 Attempting to play: ${songId} (${this.songNames[songId]})`);
        
        // Stop current song if different
        if (this.currentSong && this.currentSong !== songId) {
            const currentAudio = this.songs[this.currentSong];
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                console.log(`⏹️ Stopped: ${this.currentSong}`);
            }
        }
        
        const audio = this.songs[songId];
        if (!audio) {
            console.error(`❌ Audio element not found for ${songId}`);
            return;
        }
        
        // Set current song
        this.currentSong = songId;
        audio.volume = this.volume;
        
        // Play with error handling
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateUI();
                console.log(`▶️ Now playing: ${this.songNames[songId]}`);
            }).catch(error => {
                console.error('Playback error:', error);
                // User might need to interact with page first (browser autoplay policy)
                console.log('💡 Tip: Click anywhere on the page to enable audio');
            });
        }
    }
    
    togglePlayPause() {
        if (!this.currentSong) {
            console.log('⚠️ No song selected yet');
            return;
        }
        
        const audio = this.songs[this.currentSong];
        if (!audio) return;
        
        if (this.isPlaying) {
            audio.pause();
            this.isPlaying = false;
            console.log('⏸️ Paused');
        } else {
            audio.play().catch(e => console.error('Play error:', e));
            this.isPlaying = true;
            console.log('▶️ Resumed');
        }
        
        this.updateUI();
    }
    
    toggleMute() {
        const wasMuted = this.volume === 0;
        this.volume = wasMuted ? 0.7 : 0;
        
        // Update all audio elements
        Object.values(this.songs).forEach(audio => {
            audio.volume = this.volume;
        });
        
        // Update volume slider
        const volumeSlider = document.getElementById('volume');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
        }
        
        this.updateUI();
        console.log(wasMuted ? '🔊 Unmuted' : '🔇 Muted');
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        
        Object.values(this.songs).forEach(audio => {
            audio.volume = this.volume;
        });
        
        console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
    }
    
    updateUI() {
        const playPauseBtn = document.getElementById('play-pause');
        const muteBtn = document.getElementById('mute');
        const currentSongDisplay = document.getElementById('current-song');
        
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
            playPauseBtn.title = this.isPlaying ? 'Pause' : 'Play';
        }
        
        if (muteBtn) {
            muteBtn.textContent = this.volume === 0 ? '🔇' : '🔊';
            muteBtn.title = this.volume === 0 ? 'Unmute' : 'Mute';
        }
        
        if (currentSongDisplay && this.currentSong) {
            currentSongDisplay.textContent = this.songNames[this.currentSong] || 'Unknown Song';
        }
    }
    
    onSongEnd() {
        console.log('🏁 Song ended');
        this.isPlaying = false;
        this.updateUI();
    }
}

// Scroll Triggers Class
class ScrollTriggers {
    constructor(audioController) {
        this.audioController = audioController;
        this.observer = null;
        this.triggeredSongs = new Set(); // Track which songs have been triggered
        this.init();
    }
    
    init() {
        console.log('👁️ Initializing Scroll Triggers...');
        this.setupIntersectionObserver();
        this.observeElements();
        console.log('✅ Scroll triggers initialized');
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', // Trigger when panel is 20% into viewport
            threshold: 0.3 // 30% of element must be visible
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersection(entry.target);
                }
            });
        }, options);
    }
    
    observeElements() {
        // Observe song sections for fade-in animations
        const sections = document.querySelectorAll('.song-section');
        console.log(`📊 Observing ${sections.length} song sections`);
        sections.forEach(section => {
            this.observer.observe(section);
        });
        
        // Observe trigger panels for music playback
        const triggers = document.querySelectorAll('[data-trigger]');
        console.log(`🎯 Observing ${triggers.length} music trigger panels`);
        triggers.forEach(panel => {
            this.observer.observe(panel);
        });
    }
    
    handleIntersection(element) {
        // Handle song section animations
        if (element.classList.contains('song-section')) {
            if (!element.classList.contains('visible')) {
                element.classList.add('visible');
                console.log('✨ Section animated in:', element.id);
            }
        }
        
        // Handle music triggers
        if (element.hasAttribute('data-trigger')) {
            const trigger = element.getAttribute('data-trigger');
            
            // Map triggers to song IDs
            const songMap = {
                'song1-start': 'song1',
                'song2-awakening': 'song2',
                'song3-liberation': 'song3',
                'song4-sekmet': 'song4',
                'song5-twinflame': 'song5',
                'song6-healing': 'song6',
                'song7-innerwise': 'song7',
                'song8-meditation': 'song8',
                'song9-treeoflife': 'song9',
                'song10-amazing': 'song10',
                'song11-ultimate': 'song11'
            };
            
            const songId = songMap[trigger];
            
            if (songId && !this.triggeredSongs.has(trigger)) {
                // Mark as triggered so it doesn't play multiple times
                this.triggeredSongs.add(trigger);
                
                // Play the song
                this.audioController.playSong(songId);
                
                // Add visual feedback
                element.classList.add('triggered');
                setTimeout(() => {
                    element.classList.remove('triggered');
                }, 2000);
                
                console.log(`🎵 Triggered: ${trigger} → ${songId}`);
            }
        }
    }
}

// Smooth Scroll Enhancement
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page Load Handler
function onPageLoad() {
    console.log('🚀 Signature: The Awakening - Loading...');
    
    // Initialize audio controller
    const audioController = new AudioController();
    
    // Initialize scroll triggers
    const scrollTriggers = new ScrollTriggers(audioController);
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Log success
    console.log('✅ All systems ready!');
    console.log('📖 Scroll down to begin your spiritual awakening journey...');
    
    // Enable audio on first user interaction (browser autoplay policy)
    const enableAudio = () => {
        console.log('🎵 Audio enabled by user interaction');
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    };
    
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onPageLoad);
} else {
    // DOM already loaded
    onPageLoad();
}

// Debug helper - accessible from browser console
window.signatureDebug = {
    version: '1.0.0',
    info: () => {
        console.log('='.repeat(50));
        console.log('SIGNATURE: THE AWAKENING - Debug Info');
        console.log('='.repeat(50));
        console.log('Audio files loaded:', Object.keys(window.audioController?.songs || {}).length);
        console.log('Current song:', window.audioController?.currentSong || 'None');
        console.log('Is playing:', window.audioController?.isPlaying || false);
        console.log('Volume:', Math.round((window.audioController?.volume || 0) * 100) + '%');
        console.log('='.repeat(50));
    }
};

console.log('💫 Signature: The Awakening - JavaScript loaded successfully!');
console.log('🎨 Created by Dark Star Energy');
console.log('📝 Type "signatureDebug.info()" in console for debug information');
