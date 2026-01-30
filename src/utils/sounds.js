/**
 * Sound effects using Web Audio API
 * Synthesizes sounds without external audio files
 */

let audioContext = null;
let lastFanfareTime = 0;

function getAudioContext() {
  if (!audioContext) {
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
