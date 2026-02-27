'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useGameAudio } from '../hooks/useGameAudio';

const TW_LINES = [
    'Scanning the medinas of [CITY]...',
    'Finding your complete opposite...',
    'Rebuilding a life from scratch...',
    'Loading Tunisian cultural memory...',
    'Your alter ego is taking shape...'
];

export default function LoadingScreen() {
    const { name, city, style, setEgo, setCurrentScreen } = useAppStore();
    const { playSfx } = useGameAudio();

    const [lineIndex, setLineIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    // Typewriter effect logic
    useEffect(() => {
        const fullText = TW_LINES[lineIndex].replace('[CITY]', city || 'Tunisia');
        let i = 0;

        // reset displayed text when switching lines
        setDisplayedText('');

        const typingInterval = setInterval(() => {
            if (i <= fullText.length) {
                setDisplayedText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 40);

        const lineTimer = setTimeout(() => {
            setLineIndex((prev) => (prev + 1) % TW_LINES.length);
        }, 2200);

        return () => {
            clearInterval(typingInterval);
            clearTimeout(lineTimer);
        };
    }, [lineIndex, city]);

    // Fake Progress bar logic
    useEffect(() => {
        const t = setInterval(() => {
            setProgress(p => Math.min(p + Math.random() * 8, 92)); // stop at 92% until API returns
        }, 200);
        return () => clearInterval(t);
    }, []);

    // API Call logic
    useEffect(() => {
        let isMounted = true;

        async function fetchEgo() {
            try {
                const res = await fetch('/api/generate-ego', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, city, style })
                });

                if (res.status === 429) {
                    throw new Error('429');
                }

                if (!res.ok) throw new Error('API Error');

                const data = await res.json();

                if (isMounted) {
                    setProgress(100);
                    setTimeout(() => {
                        setEgo(data);
                        setCurrentScreen('ego');
                    }, 400); // tiny delay so user sees 100%
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err.message === '429') {
                        setError('⚠ Too many requests. Neural link cooling down... please wait.');
                    } else {
                        setError('⚠ Connection error. Could not generate alter ego.');
                    }
                }
            }
        }

        // Small timeout to let the UI show up before locking into the heavy API request
        setTimeout(() => {
            if (isMounted) fetchEgo();
        }, 500);

        return () => { isMounted = false; };
    }, [name, city, style, setEgo, setCurrentScreen]);

    return (
        <motion.div
            id="screen-loading"
            className="screen active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="loading-grid">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="load-cell"
                        initial={{ backgroundColor: 'var(--border)' }}
                        animate={{
                            backgroundColor: ['var(--red)', 'var(--gold)', 'var(--blue2)', 'var(--green2)', 'var(--red2)', 'var(--gold2)', 'var(--blue)', 'var(--green)', 'var(--muted)', 'var(--sand)', 'var(--red)', 'var(--gold)', 'var(--blue2)', 'var(--green2)', 'var(--red2)'][i]
                        }}
                        transition={{ delay: i * 0.06 + 0.2, duration: 0.3 }}
                    />
                ))}
            </div>

            <p className="loading-name">{name || '—'}</p>
            <p className="loading-status">
                GENERATING ALTER EGO
            </p>

            <div className="typewriter-box relative">
                <p className="tw-text">
                    {displayedText}
                    <span className="cursor" />
                </p>

                {error && (
                    <div className="absolute top-full left-0 mt-4 text-red2 font-share text-xs">
                        {error}
                        <button
                            className="block mt-2 border border-red2 px-4 py-2 text-white bg-red"
                            onClick={() => {
                                playSfx('click');
                                setCurrentScreen('intro');
                            }}
                            onMouseEnter={() => playSfx('hover')}
                        >
                            ↩ RETRY
                        </button>
                    </div>
                )}
            </div>

            <div className="progress-wrap">
                <div className="progress-label">
                    <span>LOADING</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%`, transition: 'width 0.4s ease' }} />
                </div>
            </div>
        </motion.div>
    );
}
