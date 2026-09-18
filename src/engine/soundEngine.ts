// Synthesized Sound Engine using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private currentDroneNodes: OscillatorNode[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.soundEnabled ? 0.7 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.15 : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? 0.7 : 0, this.ctx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? 0.15 : 0, this.ctx.currentTime);
    }
    if (enabled && !this.musicInterval) {
      this.startAmbientMusic();
    } else if (!enabled) {
      this.stopAmbientMusic();
    }
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  // --- Sound Effects ---

  public playChipClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playCardFlip() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    // Filtered noise burst for tactile card swoosh
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.09);
  }

  public playTensionRoll() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);

    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playWin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx!.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + index * 0.08);
      osc.stop(this.ctx!.currentTime + index * 0.08 + 0.45);
    });
  }

  public playJackpot() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [
      [523.25, 659.25, 783.99, 1046.5],
      [587.33, 739.99, 880.0, 1174.66],
      [659.25, 830.61, 987.77, 1318.51],
      [783.99, 987.77, 1174.66, 1567.98],
    ];

    chords.forEach((chord, chordIdx) => {
      const startTime = this.ctx!.currentTime + chordIdx * 0.14;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    });
  }

  public playLoss() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  public playBust() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    // Sub-bass crater
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, this.ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.8);

    subGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.85);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start();
    subOsc.stop(this.ctx.currentTime + 0.9);

    // Shatter noise burst
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.45);
  }

  public playHeartbeat() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    [0, 0.12].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx!.currentTime + offset);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx!.currentTime + offset + 0.08);

      gain.gain.setValueAtTime(0.4, this.ctx!.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + offset + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + offset);
      osc.stop(this.ctx!.currentTime + offset + 0.1);
    });
  }

  public playCashOut() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const fanfare = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    fanfare.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + idx * 0.1);
      osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.8);
    });
  }

  // --- Ambient Noir Casino Music ---

  public startAmbientMusic() {
    if (!this.musicEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.musicGain) return;

    this.stopAmbientMusic();

    const chordProgression = [
      [110.0, 164.81, 196.0, 261.63], // Am7
      [130.81, 164.81, 196.0, 246.94], // Cmaj7/E
      [98.0, 146.83, 196.0, 220.0],   // Gsus2
      [116.54, 146.83, 174.61, 233.08] // Bb
    ];

    let chordStep = 0;

    const playNextChord = () => {
      if (!this.musicEnabled || !this.ctx || !this.musicGain) return;

      // Clean up previous oscillators
      this.currentDroneNodes.forEach(node => {
        try { node.stop(); node.disconnect(); } catch {}
      });
      this.currentDroneNodes = [];

      const chord = chordProgression[chordStep % chordProgression.length];
      chordStep++;

      chord.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx!.currentTime + 1.5);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx!.currentTime + 5.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 5.8);
        this.currentDroneNodes.push(osc);
      });
    };

    playNextChord();
    this.musicInterval = window.setInterval(playNextChord, 5500);
  }

  public stopAmbientMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentDroneNodes.forEach(node => {
      try { node.stop(); node.disconnect(); } catch {}
    });
    this.currentDroneNodes = [];
  }
}

export const sound = new SoundEngine();
