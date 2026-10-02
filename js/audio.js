// ============================================================
// MOISH - THE FISHING GAME | AUDIO.JS
// Web Audio API Procedural Synthesizer & Speech Synthesis
// No external audio files needed - runs completely offline!
// ============================================================

class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.bgmGain = null;

        this.masterVolume = 0.8;
        this.sfxVolume = 0.8;
        this.bgmVolume = 0.5;

        this.ambientNode = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;
        this.speechVoices = [];
        this.speechEnabled = true;

        this.initSpeech();
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
            this.bgmGain.connect(this.masterGain);
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
        if (this.sfxGain && this.ctx) {
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        }
    }

    setBgmVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, val));
        if (this.bgmGain && this.ctx) {
            this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
        }
    }

    // ── SOUND EFFECTS ──────────────────────────────────────────

    playClick() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playCast() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playSplash() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        // White noise burst with lowpass filter sweep
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.3);
    }

    playReel() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        // Fast clicking ratchet sound
        for (let i = 0; i < 4; i++) {
            const time = this.ctx.currentTime + (i * 0.04);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200 + (i * 100), time);

            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + 0.02);
        }
    }

    playBite() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        // Urgent high double chime
        const notes = [880, 1174];
        notes.forEach((freq, idx) => {
            const time = this.ctx.currentTime + (idx * 0.1);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.35, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + 0.15);
        });
    }

    playCatch(rarity = 'common') {
        this.init();
        this.resume();
        if (!this.ctx) return;

        let notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Common/Uncommon)
        let duration = 0.12;

        if (rarity === 'rare' || rarity === 'epic') {
            notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        } else if (rarity === 'legendary' || rarity === 'mythic') {
            notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // Majestic arpeggio
            duration = 0.14;
        } else if (rarity === 'transcendent' || rarity === 'omega') {
            notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760]; // Cosmic fanfare
            duration = 0.15;
        }

        notes.forEach((freq, i) => {
            const time = this.ctx.currentTime + (i * duration);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = (rarity === 'transcendent' || rarity === 'omega') ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(freq, time);

            const vol = (rarity === 'omega' || rarity === 'transcendent') ? 0.25 : 0.3;
            gain.gain.setValueAtTime(vol, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + (duration * 2));

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + (duration * 2));
        });
    }

    playEscape() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const notes = [440, 415.30, 392, 349.23];
        notes.forEach((freq, i) => {
            const time = this.ctx.currentTime + (i * 0.1);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + 0.12);
        });
    }

    playMutation() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        // Sparkling magical chord
        const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98, 1760.00];
        notes.forEach((freq, i) => {
            const time = this.ctx.currentTime + (i * 0.06);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + 0.4);
        });
    }

    playCoin() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
        osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start();
        osc1.stop(this.ctx.currentTime + 0.15);
        osc2.start(this.ctx.currentTime + 0.08);
        osc2.stop(this.ctx.currentTime + 0.3);
    }

    playUpgrade() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const notes = [392, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const time = this.ctx.currentTime + (i * 0.08);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(time);
            osc.stop(time + 0.25);
        });
    }

    playBomb() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        // Low booming noise
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.8);
    }

    playThunder() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * 1.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.6));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start();
        noise.stop(this.ctx.currentTime + 1.5);
    }

    // ── OCEAN AMBIENT BACKGROUND ──────────────────────────────

    startAmbientWaves() {
        this.init();
        this.resume();
        if (this.isAmbientPlaying || !this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * 4;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            this.ambientNode = this.ctx.createBufferSource();
            this.ambientNode.buffer = buffer;
            this.ambientNode.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(350, this.ctx.currentTime);

            // Modulate filter and gain with LFO to simulate rolling ocean waves
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // ~5.5s wave cycle

            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            lfo.connect(lfoGain);

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            lfoGain.connect(this.ambientGain.gain);

            this.ambientNode.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.bgmGain);

            this.ambientNode.start();
            lfo.start();
            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn('Could not start ambient audio:', e);
        }
    }

    stopAmbientWaves() {
        if (this.ambientNode) {
            try {
                this.ambientNode.stop();
                this.ambientNode.disconnect();
            } catch (e) {}
            this.ambientNode = null;
        }
        this.isAmbientPlaying = false;
    }

    // ── SPEECH SYNTHESIS (Voice for Story) ─────────────────────

    initSpeech() {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                this.speechVoices = window.speechSynthesis.getVoices();
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    speakStory(text, lang = 'id', speaker = 'narrator') {
        if (!('speechSynthesis' in window) || !this.speechEnabled) {
            // Fallback text blip
            this.playTextBlip();
            return;
        }

        try {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech

            const cleanText = text.replace(/["🎣⭐✨]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);

            // Set language code
            const langCode = (lang === 'id') ? 'id-ID' : 'en-US';
            utterance.lang = langCode;

            // Pick matching voice if available
            const matchingVoice = this.speechVoices.find(v => v.lang.startsWith(lang) || v.lang.includes(langCode));
            if (matchingVoice) utterance.voice = matchingVoice;

            if (speaker === 'fisher') {
                utterance.pitch = 1.15; // Young determined fisherman
                utterance.rate = 1.0;
            } else {
                utterance.pitch = 0.95; // Calm wise narrator
                utterance.rate = 0.95;
            }

            utterance.volume = this.masterVolume * this.sfxVolume;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
            this.playTextBlip();
        }
    }

    playTextBlip() {
        this.init();
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    stopSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}

const audio = new SoundManager();
