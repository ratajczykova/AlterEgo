'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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

export default function StampScreen() {
    const { xp, level, activeMission, stamp, ego, city, setCurrentScreen, resetGame, setGuide } = useAppStore();
    const { playSfx } = useGameAudio();
    const [loadingGuide, setLoadingGuide] = useState(false);

    if (!stamp || !ego || !activeMission) return null;

    const currentLvlData = LEVELS.find(l => xp < l.max) || LEVELS[LEVELS.length - 1];
    const nextLvlIndex = LEVELS.indexOf(currentLvlData) + 1;
    const nextLvlInfo = LEVELS[nextLvlIndex] || currentLvlData;

    const xpEarned = activeMission.xp + 50;
    const xpPct = Math.min(((xp - currentLvlData.min) / (currentLvlData.max - currentLvlData.min)) * 100, 100);

    const ghostLocalPct = Math.min((xp / 750) * 100, 100);
    const isGhostLocalUnlocked = xp >= 750;

    const handleFetchGuide = async () => {
        setLoadingGuide(true);
        playSfx('click');
        try {
            const res = await fetch('/api/generate-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city })
            });
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            setGuide(data);
            playSfx('success');
            setCurrentScreen('guide');
        } catch (err) {
            console.error(err);
            setLoadingGuide(false);
            playSfx('glitch');
        }
    };

    return (
        <motion.div
            id="screen-stamp"
            className="screen active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="xp-banner">
                <div className="xp-left">
                    <p className="xp-label-sm">XP EARNED</p>
                    <p className="xp-amount">+{xpEarned}</p>
                </div>
                <div className="xp-progress-col">
                    <div className="xp-prog-label">
                        <span>LEVEL {level}</span>
                        <span>→ {xp >= 750 ? 'MAX LEVEL' : 'NEXT LEVEL'}</span>
                    </div>
                    <div className="xp-prog-track">
                        <motion.div
                            className="xp-prog-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpPct}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>
                <div className="xp-level-tag">LVL {level}</div>
            </div>

            <div className="stamp-outer transform scale-[0.65] sm:scale-75 md:scale-100 -my-12 md:my-0">
                <motion.div
                    className="soul-stamp"
                    initial={{ scale: 1.5, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
                >
                    <div className="sc tl"></div>
                    <div className="sc tr"></div>
                    <div className="sc bl"></div>
                    <div className="sc br"></div>

                    <div className="stamp-seal">{stamp.seal_emoji}</div>

                    <div className="stamp-emoji-lg relative overflow-hidden h-[120px] w-[120px] mx-auto rounded-md border-2 border-border mt-4 mb-2">
                        {ego.avatar_id && (
                            <Image
                                src={`/avatars/${ego.avatar_id}`}
                                alt={ego.name}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,12,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none mix-blend-overlay"></div>
                    </div>
                    <h3 className="stamp-name-lg">{ego.name}</h3>
                    <p className="stamp-origin">— {ego.origin?.toUpperCase()} —</p>

                    <div className="stamp-divider">
                        <div className="stamp-divider-line"></div>
                        <div className="stamp-divider-dot"></div>
                        <div className="stamp-divider-line"></div>
                    </div>

                    <p className="stamp-moment-txt">{stamp.moment}</p>
                    <p className="stamp-date-txt">GENERATED {new Date().toLocaleDateString()}</p>
                </motion.div>
            </div>

            <motion.div
                className="confrontation-panel p-4 md:p-8 mt-[-30px] md:mt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <div className="conf-header">
                    <div className="conf-tag">CONFRONTATION</div>
                    <div className="conf-name">{ego.name.toUpperCase()} SPEAKS</div>
                </div>
                <p className="conf-text">"{stamp.confrontation}"</p>
            </motion.div>

            {/* GUIDE TEASER */}
            <motion.div
                className="guide-teaser mt-4 md:mt-0 p-4 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                {isGhostLocalUnlocked ? (
                    <div
                        className="guide-teaser-unlocked"
                        onClick={handleFetchGuide}
                        onMouseEnter={() => !loadingGuide && playSfx('hover')}
                    >
                        {loadingGuide ? (
                            <div className="text-center text-green2 font-share my-4">GENERATING YOUR LOCAL CONNECTION...</div>
                        ) : (
                            <>
                                <div className="guide-unlock-badge">
                                    <div className="guide-unlock-dot"></div>
                                    <div className="guide-unlock-label">GHOST LOCAL UNLOCKED</div>
                                </div>
                                <div className="guide-preview-row">
                                    <div className="guide-preview-emoji">🧑</div>
                                    <div className="guide-preview-text">
                                        <div className="guide-preview-name">??????????</div>
                                        <div className="guide-preview-sub">VERIFIED LOCAL GUIDE</div>
                                    </div>
                                </div>
                                <div className="guide-preview-cta text-center mt-4">
                                    CLICK TO REVEAL LOCAL CONNECTION ▶
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="guide-teaser-locked">
                        <div className="guide-lock-icon">🔒</div>
                        <div className="guide-lock-text flex-1">
                            <div className="guide-lock-title">THE GHOST LOCAL</div>
                            <div className="guide-lock-sub">Unlock to meet a real verified local guide in {city}.</div>
                            <div className="guide-lock-bar-wrap w-full">
                                <div className="guide-lock-bar-track">
                                    <div className="guide-lock-bar-fill" style={{ width: `${ghostLocalPct}%` }}></div>
                                </div>
                                <div className="guide-lock-pct">{xp} / 750 XP</div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.button
                className="btn-again"
                onClick={resetGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                ↩  PLAY AGAIN WITH A NEW ALTER EGO
            </motion.button>
        </motion.div>
    );
}
