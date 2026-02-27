'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useGameAudio } from '../hooks/useGameAudio';

export default function IntroScreen() {
    const { name: storedName, setName, setCity, setStyle, setCurrentScreen, collection } = useAppStore();
    const { playSfx } = useGameAudio();

    const [localName, setLocalName] = useState(storedName || '');
    const [localCity, setLocalCity] = useState('');
    const [localStyle, setLocalStyle] = useState('');
    const [showError, setShowError] = useState(false);

    const handleStartGame = () => {
        const finalName = storedName || localName.trim();
        if (!finalName || !localCity || !localStyle) {
            setShowError(true);
            playSfx('glitch'); // Play glitch sound on error
            return;
        }

        setShowError(false);
        setName(finalName);
        setCity(localCity);
        setStyle(localStyle);
        playSfx('success'); // Play success sound
        setCurrentScreen('loading');
    };

    return (
        <motion.div
            id="screen-intro"
            className="screen active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="intro-pre">▶ NEW GAME · تونس</p>
            <h1 className="intro-title text-6xl md:text-8xl lg:text-[130px] flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 mb-2 md:mb-0 transition-all">
                <span className="alter">ALTER</span>
                <span className="ego">EGO</span>
            </h1>
            <p className="intro-sub">TOURIST EDITION · TUNISIA 2025</p>
            <p className="intro-arabic">كن شخصاً آخر</p>

            <div className="stats-preview flex flex-wrap justify-center gap-2 md:gap-4 my-6">
                <div className="stat-chip text-[10px] md:text-xs">🏅 XP SYSTEM</div>
                <div className="stat-chip text-[10px] md:text-xs">🎭 3 MISSIONS</div>
                <div className="stat-chip text-[10px] md:text-xs">🔖 SOUL STAMP</div>
            </div>

            <div className="form-panel">
                <p className="panel-title">// CHARACTER SETUP</p>

                <div className="f-group">
                    <label className="f-label" htmlFor="u-name">Player name</label>
                    <input
                        className={`f-input ${storedName ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="text"
                        id="u-name"
                        placeholder="Enter your name"
                        maxLength={24}
                        autoComplete="off"
                        value={storedName || localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        disabled={!!storedName}
                    />
                </div>

                <div className="f-group">
                    <label className="f-label">Select destination</label>
                    <div className="city-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                        {[
                            { id: 'c1', value: 'Tunis', icon: '🕌' },
                            { id: 'c2', value: 'Sidi Bou Said', icon: '🔵' },
                            { id: 'c3', value: 'Djerba', icon: '🏖️' },
                            { id: 'c4', value: 'Sousse', icon: '🏛️' },
                            { id: 'c5', value: 'Douz', icon: '🐪' },
                            { id: 'c6', value: 'Carthage', icon: '🏺' }
                        ].map(city => (
                            <div key={city.id}>
                                <input
                                    className="city-opt"
                                    type="radio"
                                    name="city"
                                    id={city.id}
                                    value={city.value}
                                    checked={localCity === city.value}
                                    onChange={() => setLocalCity(city.value)}
                                />
                                <label className="city-lbl" htmlFor={city.id}>
                                    <span className="city-icon">{city.icon}</span>
                                    <span className="city-name">{city.value}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="f-group">
                    <label className="f-label">Your travel style</label>
                    <div className="style-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                        {[
                            { id: 's1', value: 'Comfortable & guided', label: '😌 Comfortable' },
                            { id: 's2', value: 'Fast & efficient', label: '⚡ Fast' },
                            { id: 's3', value: 'Planned & researched', label: '📋 Planned' },
                            { id: 's4', value: 'Luxury & curated', label: '✨ Luxury' }
                        ].map(style => (
                            <div key={style.id}>
                                <input
                                    className="s-opt"
                                    type="radio"
                                    name="style"
                                    id={style.id}
                                    value={style.value}
                                    checked={localStyle === style.value}
                                    onChange={() => setLocalStyle(style.value)}
                                />
                                <label className="s-lbl" htmlFor={style.id}>
                                    {style.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="btn-start"
                    id="btn-start"
                    onClick={handleStartGame}
                    onMouseEnter={() => playSfx('hover')}
                >
                    ▶ &nbsp; START GAME
                </button>

                {collection && collection.length > 0 && (
                    <button
                        className="btn-again mt-4 w-full"
                        onClick={() => {
                            playSfx('click');
                            setCurrentScreen('profile');
                        }}
                        onMouseEnter={() => playSfx('hover')}
                    >
                        ❖ &nbsp; VIEW PASSPORT PROFILE
                    </button>
                )}

                {showError && (
                    <motion.p
                        className="form-err"
                        id="form-err"
                        style={{ display: 'block' }}
                        initial={{ x: -10 }}
                        animate={{ x: [0, -6, 6, -6, 6, 0] }}
                        transition={{ duration: 0.3 }}
                    >
                        ⚠ Fill all fields to continue.
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}
