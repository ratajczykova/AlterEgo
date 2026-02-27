'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

const AUDIO_TRACKS: Record<string, string> = {
    main: '/music/The Astounding Eyes Of Rita.mp3',
    Tunis: '/music/E M E L - Holm (A Dream) (Official Video).mp3',
    'Sidi Bou Said': '/music/ROMEO & LEILA.mp3',
    Djerba: '/music/Houeida Hedfi - Appel du Danube.mp3',
    Sousse: '/music/Tunisian Medley - Farah Fersi.mp3',
    Douz: '/music/Tinariwen (IO_I) - Sastanàqqàm.mp3',
    Carthage: '/music/Birds Canticum Birds Requiem Suite.mp3',
};

export default function AudioManager() {
    const { currentScreen, city, isMuted } = useAppStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio tag single-time gracefully
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.15; // Set base volume

        // Browsers block autoplay until user has interacted with the document
        // We attach an unlock listener that triggers playback on any click/tap/keypress
        const unlockAudio = () => {
            const currentMuted = useAppStore.getState().isMuted;
            if (audioRef.current && audioRef.current.paused && !currentMuted) {
                // Ignore the promise catch if it fails
                audioRef.current.play().catch(() => { });
            }
            // Once unlocked, we safely remove the listeners to prevent spam calls
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });

        // Cleanup when dismounting
        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Watch screen states to change audio tracks seamlessly
    useEffect(() => {
        if (!audioRef.current) return;

        let targetTrack = AUDIO_TRACKS.main;

        if (currentScreen !== 'intro' && currentScreen !== 'profile') {
            targetTrack = AUDIO_TRACKS[city] || AUDIO_TRACKS.main;
        }

        // Attempting to inject new src avoids restarting the SAME song on re-renders
        if (audioRef.current.src && !audioRef.current.src.endsWith(encodeURI(targetTrack))) {
            audioRef.current.src = targetTrack;
            if (!isMuted) {
                audioRef.current.play().catch(e => console.warn('Music play inhibited by browser until interaction', e));
            }
        } else if (!audioRef.current.src) {
            audioRef.current.src = targetTrack;
        }

    }, [currentScreen, city, isMuted]);

    // Handle Mute logic reacting purely to state
    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.volume = isMuted ? 0 : 0.15;

        if (isMuted) {
            audioRef.current.pause();
        } else {
            // Attempt to play if unmuted
            if (audioRef.current.src) {
                audioRef.current.play().catch(e => console.warn('Autoplay blocked:', e));
            }
        }
    }, [isMuted]);

    return null; // pure headless logical component
}
