'use client';

import { useCallback } from 'react';

// Reusable audio context singleton so we don't spam contexts
let audioCtx: AudioContext | null = null;

export function useGameAudio() {
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    };

    const playSfx = useCallback((type: 'hover' | 'click' | 'success' | 'glitch') => {
        try {
            const ctx = initAudio();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case 'hover':
                    // High-pitched short bleep
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'click':
                    // Mechanical clack / low thud
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
                    gainNode.gain.setValueAtTime(0.1, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'success':
                    // Rising harmonious chord (arpeggio simulated)
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, now); // A4
                    osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                    osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
                    osc.frequency.setValueAtTime(880, now + 0.3); // A5

                    gainNode.gain.setValueAtTime(0.1, now);
                    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.3);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                    osc.start(now);
                    osc.stop(now + 0.8);
                    break;

                case 'glitch':
                    // Static noise (using a very rapid square wave sweep as a proxy for white noise)
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(2000, now + 0.02);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.04);
                    osc.frequency.linearRampToValueAtTime(4000, now + 0.06);

                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
            }
        } catch (e) {
            // Audio context might fail to initialize if user hasn't interacted with page yet 
            console.warn('Audio play failed:', e);
        }
    }, []);

    return { playSfx };
}
