export class SoundEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicInterval = null;
    this.notePointer = 0;
    this.nextNoteAt = 0;
    this.tempo = 112;
    this.settings = {
      music: true,
      sfx: true,
    };
  }

  async resumeFromGesture() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    if (!this.context) {
      this.context = new AudioCtx();
      this.masterGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.sfxGain = this.context.createGain();

      this.masterGain.gain.value = 0.72;
      this.musicGain.gain.value = this.settings.music ? 0.16 : 0;
      this.sfxGain.gain.value = this.settings.sfx ? 0.32 : 0;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.startMusicLoop();
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  setOptions(settings) {
    this.settings.music = settings.music;
    this.settings.sfx = settings.sfx;

    if (!this.context) {
      return;
    }

    this.musicGain.gain.setTargetAtTime(settings.music ? 0.16 : 0, this.context.currentTime, 0.06);
    this.sfxGain.gain.setTargetAtTime(settings.sfx ? 0.32 : 0, this.context.currentTime, 0.03);
  }

  startMusicLoop() {
    if (this.musicInterval || !this.context) {
      return;
    }

    this.nextNoteAt = this.context.currentTime + 0.1;
    this.notePointer = 0;
    this.musicInterval = window.setInterval(() => this.scheduleMusic(), 140);
  }

  scheduleMusic() {
    if (!this.context || !this.settings.music) {
      return;
    }

    const horizon = this.context.currentTime + 0.45;
    const eighth = 60 / this.tempo / 2;
    while (this.nextNoteAt < horizon) {
      this.scheduleStep(this.notePointer, this.nextNoteAt);
      this.notePointer += 1;
      this.nextNoteAt += eighth;
    }
  }

  scheduleStep(step, time) {
    const bassLine = [
      130.81,
      null,
      164.81,
      null,
      196.0,
      null,
      174.61,
      null,
      146.83,
      null,
      164.81,
      null,
      110.0,
      null,
      123.47,
      null,
    ];

    const chordHits = {
      0: [261.63, 329.63, 392.0],
      4: [293.66, 349.23, 415.3],
      8: [246.94, 311.13, 392.0],
      12: [220.0, 293.66, 369.99],
    };

    const bass = bassLine[step % bassLine.length];
    if (bass) {
      this.playTone({
        frequency: bass,
        time,
        duration: 0.18,
        type: "triangle",
        gain: 0.11,
        detuneSpread: 6,
      });
    }

    const chord = chordHits[step % 16];
    if (chord) {
      chord.forEach((frequency, index) => {
        this.playTone({
          frequency,
          time: time + index * 0.01,
          duration: 0.22,
          type: "sawtooth",
          gain: 0.03,
          detuneSpread: 10,
        });
      });
    }

    if (step % 4 === 0) {
      this.playNoiseBurst(time, 0.045, 0.025, 920, 0.12);
      this.playTone({
        frequency: 72,
        time,
        duration: 0.08,
        type: "sine",
        gain: 0.12,
        sweepTo: 40,
      });
    } else if (step % 2 === 1) {
      this.playNoiseBurst(time, 0.025, 0.02, 3400, 0.03);
    }
  }

  playTone({ frequency, time, duration, type, gain, sweepTo = null, detuneSpread = 0 }) {
    if (!this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.setValueAtTime((Math.random() - 0.5) * detuneSpread, time);
    if (sweepTo) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), time + duration);
    }

    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(envelope);
    envelope.connect(this.musicGain ?? this.sfxGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  playNoiseBurst(time, duration, gain, cutoff, outputGain) {
    if (!this.context) {
      return;
    }

    const buffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * gain;
    }

    const noise = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();

    noise.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);

    envelope.gain.setValueAtTime(outputGain, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noise.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.sfxGain);
    noise.start(time);
  }

  playMenuTap() {
    this.playSfxTone(760, 0.08, "triangle", 0.16, 640);
  }

  playSpin() {
    this.playSfxTone(340, 0.28, "sawtooth", 0.18, 760);
    this.playNoiseBurst(this.context?.currentTime ?? 0, 0.1, 0.04, 2200, 0.07);
  }

  playTriggerPull() {
    this.playSfxTone(220, 0.18, "square", 0.15, 180);
  }

  playBlankShot() {
    this.playSfxTone(880, 0.07, "square", 0.18, 420);
    this.playSfxTone(310, 0.12, "triangle", 0.1, 190);
  }

  playBlast() {
    if (!this.context || !this.settings.sfx) {
      return;
    }

    const time = this.context.currentTime;
    this.playNoiseBurst(time, 0.25, 0.18, 1600, 0.25);
    this.playSfxTone(110, 0.22, "sawtooth", 0.22, 54);
    this.playSfxTone(540, 0.16, "square", 0.08, 220);
  }

  playBoing() {
    this.playSfxTone(420, 0.24, "sine", 0.18, 180);
  }

  playRoundStart() {
    this.playSfxTone(440, 0.14, "triangle", 0.14, 520);
    this.playSfxTone(660, 0.18, "triangle", 0.1, 780, 0.08);
  }

  playGameOver() {
    this.playSfxTone(330, 0.2, "triangle", 0.12, 210);
    this.playSfxTone(220, 0.28, "triangle", 0.12, 130, 0.14);
  }

  playSfxTone(frequency, duration, type, gain, sweepTo, delay = 0) {
    if (!this.context || !this.settings.sfx) {
      return;
    }

    const time = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, sweepTo), time + duration);

    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(envelope);
    envelope.connect(this.sfxGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.05);
  }
}
