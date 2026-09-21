// Web Audio API 기반 레트로 8-bit 사운드 엔진
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmTimer = null;
    this.bgmGain = null;
    this.bgmType = null; // 'battle' | 'boss', 음소거 해제 시 이어서 재생하기 위해 기억
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopBgm(true);
    } else if (this.bgmType === 'battle') {
      this.startBattleBgm();
    } else if (this.bgmType === 'boss') {
      this.startBossBgm();
    }
    return this.enabled;
  }

  // 루프 BGM 정지. keepType이 true면 다음 음소거 해제 시 이어서 재생할 수 있도록 bgmType은 유지한다.
  stopBgm(keepType = false) {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmGain = null;
    if (!keepType) this.bgmType = null;
  }

  // 저볼륨 루프 배경음 재생 (짧은 멜로디 패턴을 계속 반복)
  playBgmLoop(pattern) {
    this.stopBgm(true);
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.05;
    gain.connect(this.ctx.destination);
    this.bgmGain = gain;

    let i = 0;
    const playStep = () => {
      if (this.bgmGain !== gain) return; // 그 사이 정지/교체되었으면 중단
      const note = pattern[i % pattern.length];
      try {
        const osc = this.ctx.createOscillator();
        osc.type = note.type || 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);
        osc.connect(gain);
        osc.start();
        osc.stop(this.ctx.currentTime + note.d * 0.9);
      } catch (e) {}
      i++;
      this.bgmTimer = setTimeout(playStep, note.d * 1000);
    };
    playStep();
  }

  // 평시 전투 BGM (차분한 루프)
  startBattleBgm() {
    this.bgmType = 'battle';
    this.playBgmLoop([
      { f: 392.00, d: 0.3 }, { f: 440.00, d: 0.3 }, { f: 493.88, d: 0.3 }, { f: 440.00, d: 0.3 },
      { f: 392.00, d: 0.3 }, { f: 349.23, d: 0.3 }, { f: 392.00, d: 0.6 }
    ]);
  }

  // 보스전 BGM (긴장감 있는 단조 루프)
  startBossBgm() {
    this.bgmType = 'boss';
    this.playBgmLoop([
      { f: 220.00, d: 0.2 }, { f: 233.08, d: 0.2 }, { f: 220.00, d: 0.2 }, { f: 196.00, d: 0.2 },
      { f: 174.61, d: 0.2 }, { f: 196.00, d: 0.2 }, { f: 220.00, d: 0.4 }
    ]);
  }

  // 기본 톤 재생 유틸
  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1, decay = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      if (decay) {
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 1. 버튼 클릭 효과음
  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.08);
  }

  // 2. 정답 맞힘 / 학점 획득 (경쾌한 아르페지오)
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.12, 0.12);
      }, idx * 60);
    });
  }

  // 3. 오답 / 데미지 피격음 (레트로 버저)
  playDamage() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // 4. 과목 이수 / 웨이브 승리 팡파레
  playVictory() {
    if (!this.enabled) return;
    this.init();
    const melody = [
      { f: 587.33, d: 0.1 }, // D5
      { f: 587.33, d: 0.1 },
      { f: 587.33, d: 0.1 },
      { f: 783.99, d: 0.35 }  // G5
    ];
    let time = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, 'square', note.d, 0.12);
      }, time);
      time += note.d * 1000 + 30;
    });
  }

  // 5. 보스전 조우 경보음
  playBossEncounter() {
    if (!this.enabled) return;
    this.init();
    const freqs = [220, 207.65, 196, 185];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sawtooth', 0.15, 0.15);
      }, i * 100);
    });
  }

  // 6. 보상 카드 획득 (아이템 득템 징글)
  playRewardPick() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'triangle', 0.15, 0.12);
      }, i * 70);
    });
  }

  // 7. 졸업 엔딩 영광의 팡파레
  playEndingFanfare() {
    if (!this.enabled) return;
    this.init();
    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.50, d: 0.4 },
      { f: 880.00, d: 0.15 },
      { f: 1046.50, d: 0.6 }
    ];
    let delay = 0;
    notes.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, 'sine', n.d, 0.18);
      }, delay);
      delay += n.d * 1000 + 40;
    });
  }
}

window.soundEngine = new SoundEngine();
