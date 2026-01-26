/**
 * Sound Effects Utility
 * Uses Web Audio API to generate sounds synthetically
 * No external audio files needed
 */

// Audio context singleton - created lazily on first user interaction
let audioContext = null;

/**
 * Get or create the audio context
 * Must be called after user interaction (click, tap, etc.)
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browsers require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Play a simple beep/tone
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {string} type - Oscillator type (sine, square, sawtooth, triangle)
 * @param {number} volume - Volume 0-1
 */
function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope: quick attack, sustain, smooth decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
}

/**
 * Play a sequence of notes
 * @param {Array} notes - Array of {frequency, duration} objects
 * @param {string} type - Oscillator type
 * @param {number} volume - Volume 0-1
 */
function playSequence(notes, type = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    let time = ctx.currentTime;

    notes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(note.frequency, time);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(volume, time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + note.duration);

      oscillator.start(time);
      oscillator.stop(time + note.duration);

      time += note.duration * 0.8; // Slight overlap for smoother sound
    });
  } catch (error) {
    console.warn('Sound sequence playback failed:', error);
  }
}

/**
 * Sound effect: Score entered successfully
 * A pleasant ascending two-note confirmation
 */
export function playScoreEntered() {
  playSequence([
    { frequency: 440, duration: 0.1 },  // A4
    { frequency: 554, duration: 0.15 }, // C#5
  ], 'sine', 0.25);
}

/**
 * Sound effect: Turn changed
 * A subtle notification sound
 */
export function playTurnChange() {
  playTone(660, 0.08, 'sine', 0.15); // E5, short and subtle
}

/**
 * Sound effect: Winner celebration
 * A triumphant ascending arpeggio
 */
export function playWinner() {
  playSequence([
    { frequency: 523, duration: 0.12 },  // C5
    { frequency: 659, duration: 0.12 },  // E5
    { frequency: 784, duration: 0.12 },  // G5
    { frequency: 1047, duration: 0.25 }, // C6
  ], 'triangle', 0.3);
}

/**
 * Sound effect: Button click
 * A subtle click sound
 */
export function playClick() {
  playTone(800, 0.03, 'square', 0.1);
}

/**
 * Sound effect: Error or invalid action
 * A low buzz
 */
export function playError() {
  playSequence([
    { frequency: 200, duration: 0.08 },
    { frequency: 180, duration: 0.12 },
  ], 'sawtooth', 0.15);
}

/**
 * Sound effect: Yahtzee scored!
 * An exciting celebration sound
 */
export function playYahtzee() {
  playSequence([
    { frequency: 523, duration: 0.08 },  // C5
    { frequency: 659, duration: 0.08 },  // E5
    { frequency: 784, duration: 0.08 },  // G5
    { frequency: 1047, duration: 0.08 }, // C6
    { frequency: 784, duration: 0.08 },  // G5
    { frequency: 1047, duration: 0.2 },  // C6
  ], 'triangle', 0.35);
}

/**
 * Initialize audio context on first user interaction
 * Call this early to ensure sounds work on first trigger
 */
export function initAudio() {
  try {
    getAudioContext();
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
}

/**
 * Check if audio is available
 */
export function isAudioAvailable() {
  return !!(window.AudioContext || window.webkitAudioContext);
}
