/**
 * Sound effects using Web Audio API
 * Synthesizes sounds without external audio files
 */

let audioContext = null;
let lastFanfareTime = 0;
let lastYahtzeeTime = 0;
let lastUpperBonusTime = 0;

function getAudioContext() {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a brass-like note at the given frequency
 */
function playBrassNote(ctx, destination, frequency, startTime, duration, volume = 0.3) {
  // Use multiple harmonics to approximate a brass/trumpet timbre
  const harmonics = [1, 2, 3, 4, 5];
  const harmonicVolumes = [1, 0.8, 0.6, 0.3, 0.15];

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency * h;

    const noteVol = volume * harmonicVolumes[i] * 0.25;

    // Brass envelope: quick attack, slight sustain, moderate release
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(noteVol, startTime + 0.04);
    gain.gain.setValueAtTime(noteVol, startTime + duration - 0.08);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

/**
 * Play a trumpet fanfare when the winner is announced
 */
export async function playTrumpetFanfare() {
  try {
    // Prevent duplicate plays from transition re-mounts
    const now = Date.now();
    if (now - lastFanfareTime < 3000) return;
    lastFanfareTime = now;

    const ctx = getAudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    // Fanfare melody: short celebratory arpeggio
    // G3 - B3 - D4 - G4 (hold)
    const notes = [
      { freq: 196.00, start: 0, dur: 0.18 },    // G3
      { freq: 246.94, start: 0.17, dur: 0.18 },  // B3
      { freq: 293.66, start: 0.34, dur: 0.18 },  // D4
      { freq: 392.00, start: 0.51, dur: 0.45 },  // G4 (held)
    ];

    notes.forEach(({ freq, start, dur }) => {
      playBrassNote(ctx, masterGain, freq, t + start, dur);
    });
  } catch {
    // Silently fail if audio is unavailable
  }
}

/**
 * Check if sound effects are enabled via localStorage
 * Used by components that don't have access to SettingsContext
 */
export function isSoundEnabled() {
  try {
    const stored = localStorage.getItem('yahtzee_settings_v1');
    if (stored) {
      const data = JSON.parse(stored);
      return data?.accessibility?.enableSoundEffects ?? false;
    }
  } catch {
    // Fall through
  }
  return false;
}

/**
 * Play a short brass note that pitches up with each die added (~60ms)
 * @param {number} diceCount - Current number of dice (1-5), controls pitch
 */
export async function playDiceAdd(diceCount) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    // Ascending notes in G major: G3, B3, D4, G4, B4
    const pitches = [196.00, 246.94, 293.66, 392.00, 493.88];
    const freq = pitches[Math.min(diceCount - 1, pitches.length - 1)];

    playBrassNote(ctx, masterGain, freq, t, 0.06, 0.25);
  } catch {
    // Silently fail
  }
}

/**
 * Play a subtle descending "dud" tone when a die doesn't contribute to the score (~80ms)
 * Short descending minor second — gentle but distinct from the positive add sound
 */
export async function playDiceDud() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.1;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Descend from ~E4 to ~C4 for a subtle "nope" feel
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  } catch {
    // Silently fail
  }
}

/**
 * Play a celebratory Yahtzee chord stab (~500ms)
 * G major chord bloom, distinct from the arpeggio fanfare
 */
export async function playYahtzeeSound() {
  try {
    const now = Date.now();
    if (now - lastYahtzeeTime < 2000) return;
    lastYahtzeeTime = now;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    // Simultaneous G major chord
    playBrassNote(ctx, masterGain, 196.00, t, 0.40, 0.25);       // G3
    playBrassNote(ctx, masterGain, 246.94, t, 0.40, 0.25);       // B3
    playBrassNote(ctx, masterGain, 293.66, t, 0.40, 0.25);       // D4
    playBrassNote(ctx, masterGain, 392.00, t + 0.05, 0.45, 0.35); // G4 bloom

    // High shimmer for sparkle
    const shimmer1 = ctx.createOscillator();
    const shimmer2 = ctx.createOscillator();
    const shimmerGain = ctx.createGain();

    shimmer1.type = 'sine';
    shimmer1.frequency.value = 784; // G5
    shimmer2.type = 'sine';
    shimmer2.frequency.value = 1568; // G6

    shimmerGain.gain.setValueAtTime(0, t + 0.08);
    shimmerGain.gain.linearRampToValueAtTime(0.02, t + 0.12);
    shimmerGain.gain.linearRampToValueAtTime(0, t + 0.28);

    shimmer1.connect(shimmerGain);
    shimmer2.connect(shimmerGain);
    shimmerGain.connect(masterGain);

    shimmer1.start(t + 0.08);
    shimmer1.stop(t + 0.3);
    shimmer2.start(t + 0.08);
    shimmer2.stop(t + 0.3);
  } catch {
    // Silently fail
  }
}

/**
 * Play a short percussive "stamp" when a score is confirmed (~100ms)
 * Low-frequency thud with fast attack and rapid decay
 */
export async function playScoreConfirm() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  } catch {
    // Silently fail
  }
}

/**
 * Play a bright ascending chime when the upper bonus is achieved (~400ms)
 * C5 → E5 → G5 major triad using triangle waves for a bell-like quality
 */
export async function playUpperBonus() {
  try {
    const now = Date.now();
    if (now - lastUpperBonusTime < 2000) return;
    lastUpperBonusTime = now;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    const notes = [
      { freq: 523.25, start: 0, dur: 0.25 },     // C5
      { freq: 659.25, start: 0.1, dur: 0.25 },    // E5
      { freq: 783.99, start: 0.2, dur: 0.3 },     // G5 (held slightly longer)
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, t + start);
      gain.gain.linearRampToValueAtTime(0.3, t + start + 0.02);
      gain.gain.setValueAtTime(0.3, t + start + dur - 0.1);
      gain.gain.linearRampToValueAtTime(0, t + start + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(t + start);
      osc.stop(t + start + dur);
    });
  } catch {
    // Silently fail
  }
}

/**
 * Play a subtle "pip" when the turn changes to the next player (~60ms)
 * Single high-frequency triangle wave at very low volume
 */
export async function playTurnChange() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;
    masterGain.connect(ctx.destination);

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = 880; // A5

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  } catch {
    // Silently fail
  }
}
