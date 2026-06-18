// Sound Manager - Creates 8-bit retro sounds using Web Audio API
const SoundManager = (() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Synth parameters
    const synth = {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1,
    };

    // Frequency note mapping
    const notes = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.00,
        A4: 440.00,
        B4: 493.88,
        C5: 523.25,
        D5: 587.33,
        E5: 659.25,
        F5: 698.46,
        G5: 783.99,
        A5: 880.00,
    };

    // Background music
    let backgroundOscillator = null;
    let backgroundGain = null;
    let isPlayingBackground = false;
    let musicNoteIndex = 0;
    let musicTimeout = null;

    const backgroundMelody = [
        // 80s/90s style repeating melody
        { note: notes.G4, duration: 0.3 },
        { note: notes.E4, duration: 0.3 },
        { note: notes.A4, duration: 0.3 },
        { note: notes.C5, duration: 0.3 },
        { note: notes.A4, duration: 0.3 },
        { note: notes.G4, duration: 0.6 },
        { note: notes.E4, duration: 0.3 },
        { note: notes.F4, duration: 0.3 },
        { note: notes.G4, duration: 0.6 },
    ];

    function playTone(frequency, duration, type = 'square', volume = 0.1) {
        try {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration);

            return osc;
        } catch (e) {
            console.log('Audio playback issue:', e);
        }
    }

    function playBackgroundMusic() {
        if (!isPlayingBackground || musicTimeout) return;

        const currentNote = backgroundMelody[musicNoteIndex % backgroundMelody.length];

        try {
            // Create oscillator for background music
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(currentNote.note, audioContext.currentTime);

            // Smooth envelope
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + currentNote.duration * 0.7);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + currentNote.duration);

            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + currentNote.duration);
        } catch (e) {
            console.log('Background music issue:', e);
        }

        musicNoteIndex++;

        // Schedule next note
        musicTimeout = setTimeout(() => {
            musicTimeout = null;
            if (isPlayingBackground) {
                playBackgroundMusic();
            }
        }, currentNote.duration * 1000);
    }

    return {
        // Initialize audio context (required by modern browsers)
        init() {
            if (audioContext.state === 'suspended') {
                audioContext.resume().catch(e => console.log('Audio context resume:', e));
            }
        },

        // Play collect sound (8-bit style)
        playCollect() {
            try {
                // Quick ascending beep sequence
                playTone(notes.E4, 0.1, 'square', 0.15);
                setTimeout(() => {
                    playTone(notes.G4, 0.1, 'square', 0.15);
                }, 60);
                setTimeout(() => {
                    playTone(notes.C5, 0.15, 'square', 0.15);
                }, 120);
            } catch (e) {
                console.log('Collect sound issue:', e);
            }
        },

        // Play game over sound
        playGameOver() {
            try {
                // Descending sad sound
                playTone(notes.C5, 0.2, 'square', 0.2);
                setTimeout(() => {
                    playTone(notes.A4, 0.2, 'square', 0.2);
                }, 200);
                setTimeout(() => {
                    playTone(notes.F4, 0.3, 'square', 0.2);
                }, 400);
            } catch (e) {
                console.log('Game over sound issue:', e);
            }
        },

        // Play start sound
        playStart() {
            try {
                playTone(notes.C5, 0.1, 'square', 0.2);
                setTimeout(() => {
                    playTone(notes.E5, 0.1, 'square', 0.2);
                }, 100);
                setTimeout(() => {
                    playTone(notes.G5, 0.2, 'square', 0.2);
                }, 200);
            } catch (e) {
                console.log('Start sound issue:', e);
            }
        },

        // Start background music
        startBackgroundMusic() {
            if (isPlayingBackground) return;
            
            this.init();
            isPlayingBackground = true;
            musicNoteIndex = 0;
            playBackgroundMusic();
        },

        // Stop background music
        stopBackgroundMusic() {
            isPlayingBackground = false;
            if (musicTimeout) {
                clearTimeout(musicTimeout);
                musicTimeout = null;
            }
        },

        // Pause background music
        pauseBackgroundMusic() {
            isPlayingBackground = false;
            if (musicTimeout) {
                clearTimeout(musicTimeout);
            }
        },

        // Resume background music
        resumeBackgroundMusic() {
            if (!isPlayingBackground) {
                this.init();
                isPlayingBackground = true;
                playBackgroundMusic();
            }
        },
    };
})();

// Initialize sound and start background music when game loads
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
    SoundManager.startBackgroundMusic();
    SoundManager.playStart();
});

// Handle visibility change to pause/resume music
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        SoundManager.pauseBackgroundMusic();
    } else {
        SoundManager.resumeBackgroundMusic();
    }
});