'use client';

import { motion } from 'framer-motion';
import { useGameAudio } from '../hooks/useGameAudio';
import { useAppStore } from '../store/useAppStore';

const LEVELS = [
    { name: 'OUTSIDER', min: 0, max: 150 },
    { name: 'TRAVELER', min: 150, max: 280 },
    { name: 'WANDERER', min: 280, max: 420 },
    { name: 'RESIDENT', min: 420, max: 580 },
    { name: 'INSIDER', min: 580, max: 750 },
    { name: 'GHOST LOCAL', min: 750, max: 9999 }
];

export default function HUD() {
    const { xp, level, city, currentScreen, setCurrentScreen, isMuted, toggleMute } = useAppStore();
    const { playSfx } = useGameAudio();

    const maxLevel = 6;
    if (currentScreen === 'intro') {
        return null;
    }

    const lvlData = LEVELS.find(l => xp < l.max) || LEVELS[LEVELS.length - 1];
    const pct = Math.min(((xp - lvlData.min) / (lvlData.max - lvlData.min)) * 100, 100);

    return (
        <div className="hud visible flex flex-wrap md:flex-nowrap items-center px-2 md:px-6">
            <div className="hud-logo hidden md:block">ALTER EGO</div>
            <div className="hud-sep hidden md:block"></div>
            <div className="hud-xp-wrap">
                <span className="hud-label">XP</span>
                <div className="xp-bar-track">
                    <motion.div
                        className="xp-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                </div>
                <span className="hud-score" suppressHydrationWarning>{xp}</span>
            </div>
            <div className="hud-sep"></div>
            <div className="hud-level text-xs md:text-base" suppressHydrationWarning>LVL {level}</div>
            <div className="hud-sep hidden sm:block"></div>
            <div className="city-plate z-20 hidden sm:flex text-[10px] md:text-sm" id="hud-city">
                {city ? city.toUpperCase() : 'AWAITING REGION'}
            </div>
            {currentScreen !== 'intro' && (
                <div className="flex items-center space-x-2 md:space-x-4 ml-auto md:ml-4 z-20">
                    <button
                        className="font-share text-sand text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] uppercase hover:text-white transition-colors"
                        onClick={() => {
                            playSfx('click');
                            toggleMute();
                        }}
                        onMouseEnter={() => playSfx('hover')}
                    >
                        <span className="md:hidden">[{isMuted ? 'MUTE' : 'SND'}]</span>
                        <span className="hidden md:inline">[{isMuted ? ' SOUND: MUTE ' : ' SOUND: ON '}]</span>
                    </button>
                    <button
                        className="font-bebas text-gold text-sm md:text-lg tracking-[0.1em] md:tracking-[0.2em] hover:text-white transition-colors"
                        onClick={() => {
                            playSfx('click');
                            setCurrentScreen('profile');
                        }}
                        onMouseEnter={() => playSfx('hover')}
                    >
                        PROFILE
                    </button>
                </div>
            )}
        </div>
    );
}
