// Web Audio API Synthesizer for Bhoomikkoru Bharam

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private fanOscillator: OscillatorNode | null = null;
  private fanGain: GainNode | null = null;
  private phoneInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopFanHum();
      this.stopPhoneRing();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Fan sound: Gentle motor oscillation
  public startFanHum() {
    if (this.isMuted || this.fanOscillator) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.fanOscillator = ctx.createOscillator();
      this.fanGain = ctx.createGain();

      this.fanOscillator.type = 'triangle';
      this.fanOscillator.frequency.setValueAtTime(80, ctx.currentTime); // low hum

      // Modulate frequency slightly to simulate blade spin
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(14, ctx.currentTime);
      lfoGain.gain.setValueAtTime(12, ctx.currentTime);
      lfo.connect(this.fanOscillator.frequency);
      lfo.start();

      this.fanGain.gain.setValueAtTime(0.04, ctx.currentTime); // quiet hum

      this.fanOscillator.connect(this.fanGain);
      this.fanGain.connect(ctx.destination);
      this.fanOscillator.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopFanHum() {
    if (this.fanOscillator) {
      try {
        this.fanOscillator.stop();
        this.fanOscillator.disconnect();
      } catch {}
      this.fanOscillator = null;
      this.fanGain = null;
    }
  }

  // Phone Ring: Classic dual tone European / Indian telephone ring
  public startPhoneRing() {
    if (this.isMuted) return;
    this.stopPhoneRing();

    const ringOnce = () => {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(400, ctx.currentTime);
      osc2.frequency.setValueAtTime(450, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    };

    ringOnce();
    this.phoneInterval = window.setInterval(ringOnce, 2500);
  }

  public stopPhoneRing() {
    if (this.phoneInterval) {
      clearInterval(this.phoneInterval);
      this.phoneInterval = null;
    }
  }

  // Error buzzer: harsh sarcastic buzz
  public playErrorBuzz() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  // Typo click sound
  public playTypoBlip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // Success chime
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch {}
  }

  // Crash / Glitch sound
  public playCrashSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Harsh noise explosion
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.8);
    } catch {}
  }
}

export const sounds = new SoundEngine();
