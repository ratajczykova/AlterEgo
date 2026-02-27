'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useGameAudio } from '../hooks/useGameAudio';

const LEVELS = [
    { name: 'OUTSIDER', min: 0, max: 150 },
    { name: 'TRAVELER', min: 150, max: 280 },
    { name: 'WANDERER', min: 280, max: 420 },
    { name: 'RESIDENT', min: 420, max: 580 },
    { name: 'INSIDER', min: 580, max: 750 },
    { name: 'GHOST LOCAL', min: 750, max: 9999 }
];

export default function DebriefScreen() {
    const { name, city, style, ego, activeMission, xp, setXp, setLevel, setStamp, setCurrentScreen, saveStampToCollection } = useAppStore();
    const { playSfx } = useGameAudio();

    const [debrief, setDebrief] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!activeMission || !ego) return null;

    const handleSubmit = async () => {
        if (debrief.trim().length === 0) {
            setError('⚠ Write at least a sentence before claiming your stamp.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/generate-stamp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName: name,
                    playerStyle: style,
                    city,
                    egoName: ego.name,
                    egoAge: ego.age,
                    egoOrigin: ego.origin,
                    missionText: activeMission.text,
                    missionXP: activeMission.xp,
                    debrief: debrief.trim()
                })
            });

            if (res.status === 429) {
                throw new Error('429');
            }

            if (!res.ok) throw new Error('API Error');

            const stampData = await res.json();

            // Calculate XP and level
            const newXp = xp + activeMission.xp + 50; // extra 50 purely for the debrief
            setXp(newXp);

            const newLevelData = LEVELS.find(l => newXp < l.max) || LEVELS[LEVELS.length - 1];
            const levelIndex = LEVELS.indexOf(newLevelData) + 1;
            setLevel(levelIndex);

            setStamp(stampData);
            saveStampToCollection();
            playSfx('success');
            setCurrentScreen('stamp');

        } catch (err: any) {
            if (err.message === '429') {
                setError('⚠ Too many requests. Neural link cooling down... please wait.');
            } else {
                setError('⚠ Connection error. Could not generate soul stamp.');
            }
            setLoading(false);
            playSfx('glitch');
        }
    };

    return (
        <motion.div
            id="screen-debrief"
            className="screen active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <div className="debrief-top">
                <div className="debrief-tag">DEBRIEF</div>
                <h2 className="debrief-title">REPORT IN</h2>
                <p className="debrief-hint">// WHAT ACTUALLY HAPPENED OUT THERE?</p>
            </div>

            <div className="debrief-panel w-full max-w-[600px] mx-auto p-4 md:p-8">
                <div className="debrief-mission-recap">
                    <p className="recap-label">YOUR MISSION WAS</p>
                    <p className="recap-text" id="recap-mission">{activeMission.text}</p>
                </div>
                <p className="debrief-label">// YOUR REPORT — be honest, not heroic</p>
                <textarea
                    className="debrief-textarea w-full box-border"
                    id="debrief-input"
                    placeholder="What did you do? What surprised you? What felt wrong or right?..."
                    maxLength={400}
                    value={debrief}
                    onChange={(e) => setDebrief(e.target.value)}
                    disabled={loading}
                />
                <p className="char-limit" id="char-limit">{debrief.length} / 400</p>
            </div>

            <button
                className="btn-submit"
                id="btn-submit"
                onClick={handleSubmit}
                onMouseEnter={() => !loading && playSfx('hover')}
                disabled={loading}
            >
                {loading ? '⬡ PROCESSING...' : '⬡  CLAIM MY SOUL STAMP'}
            </button>

            {error && (
                <p className="debrief-err" id="debrief-err" style={{ display: 'block' }}>
                    {error}
                </p>
            )}
        </motion.div>
    );
}
