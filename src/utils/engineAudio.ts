// Web Audio API Circuit Beat & Electro Synthesizer
// Generates a cool, punchy motorsport electronic beat with driving bassline,
// 4-on-the-floor kick, snappy hats, and melodic synth stabs reacting dynamically to RPM.

class MotorBeatSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isRunning: boolean = false;
  private enabled: boolean = false;

  // Sequencer timing
  private currentStep: number = 0;
  private timerId: number | null = null;
  private nextNoteTime: number = 0;
  private lookahead: number = 25.0; // milliseconds
  private scheduleAheadTime: number = 0.1; // seconds

  // Beat parameters
  private bpm: number = 124;
  private baseBpm: number = 122;
  private rpm: number = 1800;
  private filterCutoffMultiplier: number = 1;

  // Callbacks for UI sync (beat indicator)
  private onStepListeners: Array<(step: number, isKick: boolean) => void> = [];
  private onStateListeners: Array<(enabled: boolean) => void> = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.buildNoiseBuffer();
      }
    }
  }

  // Generate 1 second of white noise for crisp snares and metallic hi-hats
  private buildNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 1.5;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  public subscribeStep(listener: (step: number, isKick: boolean) => void) {
    this.onStepListeners.push(listener);
    return () => {
      this.onStepListeners = this.onStepListeners.filter((l) => l !== listener);
    };
  }

  public subscribeState(listener: (enabled: boolean) => void) {
    this.onStateListeners.push(listener);
    listener(this.enabled);
    return () => {
      this.onStateListeners = this.onStateListeners.filter((l) => l !== listener);
    };
  }

  private notifyStateChange() {
    this.onStateListeners.forEach((fn) => {
      try {
        fn(this.enabled);
      } catch {
        // Safe callback execution
      }
    });
  }

  public isAudioEnabled(): boolean {
    return this.enabled;
  }

  public getBPM(): number {
    return this.bpm;
  }

  private volume: number = 0.38;

  public toggleAudio(): boolean {
    this.setAudioEnabled(!this.enabled);
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(newVol: number) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (this.ctx && this.masterGain && this.isRunning) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
      } catch {
        // Gain safety fallback
      }
    }
  }

  public setAudioEnabled(state: boolean) {
    if (this.enabled === state) return;
    this.enabled = state;
    if (state) {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.startBeat();
    } else {
      this.stopBeat();
    }
    this.notifyStateChange();
  }

  private startBeat() {
    if (!this.ctx || this.isRunning || !this.enabled) return;

    try {
      const now = this.ctx.currentTime;

      // Master bus compressor to glue the beat together with punchy warmth
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, now);
      this.compressor.knee.setValueAtTime(8, now);
      this.compressor.ratio.setValueAtTime(4.5, now);
      this.compressor.attack.setValueAtTime(0.005, now);
      this.compressor.release.setValueAtTime(0.12, now);
      this.compressor.connect(this.ctx.destination);

      // Master volume
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.38, now + 0.15);
      this.masterGain.connect(this.compressor);

      this.currentStep = 0;
      this.nextNoteTime = this.ctx.currentTime + 0.05;
      this.isRunning = true;

      // Start the scheduler loop
      this.scheduler();
    } catch {
      this.isRunning = false;
    }
  }

  private scheduler = () => {
    if (!this.isRunning || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(this.scheduler, this.lookahead);
  };

  private advanceStep() {
    // 16th note timing: 60s / BPM / 4
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += 0.25 * secondsPerBeat;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  // Schedule rhythmic sound elements on each 16th note step
  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const isQuarterBeat = step % 4 === 0;
    const isKick = isQuarterBeat; // Four-on-the-floor
    const isSnare = step === 4 || step === 12; // Snare on 2 and 4
    const isOffbeatHat = step % 4 === 2; // Upbeat hat
    const isSixteenthHat = step % 2 === 1 && this.rpm > 3500; // Rolling hats as RPM rises

    // Trigger UI notification
    setTimeout(() => {
      this.onStepListeners.forEach((fn) => fn(step, isKick));
    }, Math.max(0, (time - this.ctx.currentTime) * 1000));

    // 1. Kick Drum (Punchy, subby electronic kick)
    if (isKick) {
      this.playKick(time);
    }

    // 2. Snare / Clapper
    if (isSnare) {
      this.playSnare(time);
    }

    // 3. Hi-Hats
    if (isOffbeatHat || isSixteenthHat) {
      this.playHiHat(time, isOffbeatHat);
    }

    // 4. Synth Rolling Bassline (Groovy F-minor motorsport progression)
    this.playBassStep(step, time);

    // 5. Ambient Cyber Synth Chords / Stabs
    if (step === 0 || step === 6 || step === 10) {
      this.playChords(step, time);
    }
  }

  // --- Drum Synthesizers ---

  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch sweep: 155Hz punch down to 42Hz sub
    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);

    // Volume envelope
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);

    // Transient click for extra punch
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(320, time);
    clickOsc.frequency.exponentialRampToValueAtTime(40, time + 0.02);

    clickGain.gain.setValueAtTime(0.4, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);

    clickOsc.start(time);
    clickOsc.stop(time + 0.035);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Noise layer
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.2);

    // Snare body (tonal transient)
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(210, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(120, time + 0.09);

    bodyGain.gain.setValueAtTime(0.4, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.masterGain);

    bodyOsc.start(time);
    bodyOsc.stop(time + 0.12);
  }

  private playHiHat(time: number, isOpen: boolean) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const hatSource = this.ctx.createBufferSource();
    hatSource.buffer = this.noiseBuffer;

    const hatFilter = this.ctx.createBiquadFilter();
    hatFilter.type = 'bandpass';
    hatFilter.frequency.setValueAtTime(9500, time);
    hatFilter.Q.setValueAtTime(3.5, time);

    const hatGain = this.ctx.createGain();
    const decay = isOpen ? 0.14 : 0.045;
    const peakVolume = isOpen ? 0.35 : 0.22;

    hatGain.gain.setValueAtTime(peakVolume, time);
    hatGain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    hatSource.connect(hatFilter);
    hatFilter.connect(hatGain);
    hatGain.connect(this.masterGain);

    hatSource.start(time);
    hatSource.stop(time + decay + 0.01);
  }

  // --- Melodic Synthesizer: Rolling Bass & Cyber Chords ---

  private playBassStep(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // F-minor driving bass pattern (F1, G#1, C2, D#2)
    // F1 = 43.65Hz, G#1 = 51.91Hz, A#1 = 58.27Hz, C2 = 65.41Hz, D#2 = 77.78Hz
    const bassNotes = [
      43.65, 43.65, 58.27, 43.65, // Steps 0-3
      43.65, 51.91, 43.65, 65.41, // Steps 4-7
      43.65, 43.65, 77.78, 43.65, // Steps 8-11
      51.91, 58.27, 65.41, 43.65, // Steps 12-15
    ];

    const freq = bassNotes[step % 16];

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Resonant Low Pass filter (opens with higher RPM)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.min(
      3800,
      350 + (this.rpm / 9500) * 2200 * this.filterCutoffMultiplier
    );
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.setValueAtTime(4.5, time);

    // Bass Envelope with sidechain feel on kicks
    const gain = this.ctx.createGain();
    const isKickStep = step % 4 === 0;
    const startGain = isKickStep ? 0.05 : 0.45;

    gain.gain.setValueAtTime(startGain, time);
    if (isKickStep) {
      // Duck on kick, swell immediately after
      gain.gain.linearRampToValueAtTime(0.42, time + 0.06);
    }
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.19);
  }

  private playChords(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // F-minor cyberpunk chord stabs (F3, G#3, C4, Eb4)
    // F3 = 174.61Hz, Ab3 = 207.65Hz, C4 = 261.63Hz, Eb4 = 311.13Hz
    const chords = [
      [174.61, 207.65, 261.63], // Fm
      [155.56, 196.0, 233.08], // Eb
      [130.81, 164.81, 196.0], // C
    ];

    const chord =
      step === 0 ? chords[0] : step === 6 ? chords[1] : chords[2];

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const detune = idx === 0 ? -4 : idx === 1 ? 0 : 5;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(detune, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + (this.rpm / 9500) * 1400, time);
      filter.Q.setValueAtTime(2.0, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  // Update beat tempo & filter dynamics based on scroll RPM
  public updateRPM(rpm: number) {
    this.rpm = Math.max(1000, Math.min(9500, rpm));
    const normalized = (this.rpm - 1000) / 8500; // 0 to 1

    // Tempo dynamically accelerates from 122 BPM (idle) to 136 BPM (high-speed straight)
    this.bpm = Math.round(this.baseBpm + normalized * 14);

    // Filter cutoff opens up so the beat sounds brighter and more intense
    this.filterCutoffMultiplier = 1 + normalized * 1.5;
  }

  public triggerThrottleBlip() {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Temporary tempo surge + sub-drop effect
    this.bpm = 138;
    this.filterCutoffMultiplier = 2.4;

    try {
      const now = this.ctx.currentTime;
      const blipOsc = this.ctx.createOscillator();
      const blipGain = this.ctx.createGain();

      blipOsc.type = 'sawtooth';
      blipOsc.frequency.setValueAtTime(320, now);
      blipOsc.frequency.exponentialRampToValueAtTime(70, now + 0.6);

      blipGain.gain.setValueAtTime(0.3, now);
      blipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      blipOsc.connect(blipGain);
      blipGain.connect(this.ctx.destination);

      blipOsc.start(now);
      blipOsc.stop(now + 0.7);

      setTimeout(() => {
        this.updateRPM(this.rpm);
      }, 1200);
    } catch {
      // Audio parameter safe fallback
    }
  }

  private stopBeat() {
    if (this.isRunning && this.ctx) {
      try {
        if (this.timerId !== null) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }

        const now = this.ctx.currentTime;
        if (this.masterGain) {
          this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        }

        setTimeout(() => {
          this.masterGain?.disconnect();
          this.compressor?.disconnect();
          this.isRunning = false;
        }, 120);
      } catch {
        this.isRunning = false;
      }
    }
  }
}

export const engineAudio = new MotorBeatSynthesizer();
