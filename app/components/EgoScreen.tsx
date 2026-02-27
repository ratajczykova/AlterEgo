'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAppStore } from '../store/useAppStore';
import { useGameAudio } from '../hooks/useGameAudio';

export default function EgoScreen() {
    const { ego, setActiveMission, activeMission, setCurrentScreen } = useAppStore();
    const { playSfx } = useGameAudio();

    if (!ego) return null;

    const handleMissionSelect = (mission: any, e: React.MouseEvent) => {
        setActiveMission(mission);

        // Create XP Float popup
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.textContent = `+${mission.xp} XP`;
        popup.style.left = `${e.clientX - 30}px`;
        popup.style.top = `${e.clientY - 20}px`;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 1300);
    };

    return (
        <motion.div
            id="screen-ego"
            className="screen active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="char-card p-4 md:p-8" id="char-card">
                <div className="char-header flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="char-emoji-frame relative overflow-hidden group w-24 h-24 md:w-32 md:h-32 flex-shrink-0" id="char-emoji">
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
                    <div className="char-title-block">
                        <p className="char-role text-[10px] md:text-sm">// YOUR ALTER EGO · TUNISIA</p>
                        <h2 className="char-name text-4xl md:text-6xl" id="char-name">{ego.name}</h2>
                        <p className="char-sub text-xs md:text-base" id="char-sub">{ego.age} YRS · {ego.origin?.toUpperCase()}</p>
                    </div>
                </div>

                <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="stat-block">
                        <p className="stat-name">PACE</p>
                        <div className="stat-bar-track">
                            <motion.div
                                className="stat-bar-fill speed"
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.min(ego.stats.pace, 10) / 10) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                            />
                        </div>
                        <p className="stat-val">{Math.min(ego.stats.pace, 10)}/10</p>
                    </div>
                    <div className="stat-block">
                        <p className="stat-name">CULTURE</p>
                        <div className="stat-bar-track">
                            <motion.div
                                className="stat-bar-fill culture"
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.min(ego.stats.culture, 10) / 10) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                            />
                        </div>
                        <p className="stat-val">{Math.min(ego.stats.culture, 10)}/10</p>
                    </div>
                    <div className="stat-block">
                        <p className="stat-name">SOCIAL</p>
                        <div className="stat-bar-track">
                            <motion.div
                                className="stat-bar-fill social"
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.min(ego.stats.social, 10) / 10) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                            />
                        </div>
                        <p className="stat-val">{Math.min(ego.stats.social, 10)}/10</p>
                    </div>
                </div>

                <div className="profile-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 border-y border-border py-4 md:py-6 mb-6 md:mb-8">
                    <div className="profile-cell">
                        <p className="profile-cell-label text-[10px] md:text-xs">How they move</p>
                        <p className="profile-cell-value">{ego.movement}</p>
                    </div>
                    <div className="profile-cell">
                        <p className="profile-cell-label">What they notice</p>
                        <p className="profile-cell-value">{ego.notices}</p>
                    </div>
                    <div className="profile-cell">
                        <p className="profile-cell-label">What they never do</p>
                        <p className="profile-cell-value">{ego.never}</p>
                    </div>
                </div>

                <div className="quote-strip bg-panel border-l-4 border-gold p-4 md:p-6 italic relative my-6">
                    <div className="quote-sym absolute -top-4 -left-3 text-5xl md:text-7xl text-border font-bebas opacity-50">"</div>
                    <p className="quote-text-inner text-sm md:text-lg text-sand2 relative z-10">"{ego.quote}"</p>
                </div>
            </div>

            <div className="mission-section">
                <div className="section-header">
                    <div className="section-tag">MISSIONS</div>
                    <div className="section-line"></div>
                    <div className="section-sub">SELECT ONE · GO DO IT · COME BACK</div>
                </div>

                <div id="missions-list">
                    {ego.missions.map((m: any, i: number) => {
                        const isSelected = activeMission?.text === m.text;
                        const diffClass = m.difficulty === 'EASY' ? 'diff-easy' : m.difficulty === 'MEDIUM' ? 'diff-medium' : 'diff-hard';

                        return (
                            <div
                                key={i}
                                className={`mission-card ${isSelected ? 'selected' : ''}`}
                                onClick={(e) => handleMissionSelect(m, e)}
                                onMouseEnter={() => playSfx('hover')} // Added hover sound effect
                            >
                                <div className="mission-side">
                                    <span className="mission-num">0{i + 1}</span>
                                    <span className="mission-xp">+{m.xp} XP</span>
                                </div>
                                <div className="mission-body">
                                    <p className={`mission-difficulty ${diffClass}`}>{m.difficulty}</p>
                                    <p className="mission-txt">{m.text}</p>
                                </div>
                                <div className="mission-check">✓</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                className="btn-go"
                onClick={() => {
                    playSfx('success'); // Added success sound effect
                    setCurrentScreen('debrief');
                }}
                onMouseEnter={() => !(!activeMission) && playSfx('hover')} // Added hover sound effect, only if activeMission is not null
                disabled={!activeMission}
            >
                ▶ &nbsp; MISSION ACCEPTED &nbsp; ▶
            </button>
        </motion.div>
    );
}
