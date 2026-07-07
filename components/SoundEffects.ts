"use client";

interface CustomWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Check if sound is enabled
const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("getmybus_sound_enabled") === "true";
};

// Subtle premium micro-click synth tone (pure sine sweep)
export const playClickSound = (volume: number = 0.05) => {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.04);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // Ignored (browser safety policy)
  }
};

// Ultra-premium gentle swell tone for hovers
export const playHoverSound = (volume: number = 0.02) => {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch {
    // Ignored
  }
};

// Success chime for when routing solves or simulation finishes
export const playSuccessChime = (volume: number = 0.06) => {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const now = audioCtx.currentTime;
    
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gainNode.gain.setValueAtTime(0.001, start);
      gainNode.gain.linearRampToValueAtTime(volume, start + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };
    
    // Warm musical third swell (C5 to E5 to G5)
    playNote(523.25, now, 0.18); // C5
    playNote(659.25, now + 0.08, 0.22); // E5
    playNote(783.99, now + 0.16, 0.3);  // G5
  } catch {
    // Ignored
  }
};

// Notification chime for lock screen simulation alert
export const playAlertChime = (volume: number = 0.08) => {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const now = audioCtx.currentTime;
    
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "triangle"; // Slightly softer timbre than sine, matches notification feels
      osc.frequency.setValueAtTime(freq, start);
      
      gainNode.gain.setValueAtTime(0.001, start);
      gainNode.gain.linearRampToValueAtTime(volume, start + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };
    
    // Classic Apple-style dual chord chime (A5 to F#5)
    playNote(880.00, now, 0.25);
    playNote(739.99, now + 0.08, 0.35);
  } catch {
    // Ignored
  }
};
