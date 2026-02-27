'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAppStore } from '../store/useAppStore';
import { useGameAudio } from '../hooks/useGameAudio';

export default function GuideScreen() {
    const { guide, setCurrentScreen } = useAppStore();
    const { playSfx } = useGameAudio();
    const [modalOpen, setModalOpen] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');

    if (!guide) return null;

    const handleSendRequest = () => {
        if (name && email && date) {
            setRequestSent(true);
        }
    };

    return (
        <motion.div
            id="screen-guide"
            className="screen active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <div className="guide-unlock-hero">
                <div className="guide-unlock-tag">
                    <div className="guide-unlock-tag-dot"></div>
                    GHOST LOCAL ACHIEVEMENT UNLOCKED
                </div>
                <h2 className="guide-unlock-title">YOUR LOCAL<br /><span>GUIDE AWAITS</span></h2>
                <p className="guide-unlock-sub">// You've proven you engage with Tunisia honestly.<br />A real local has agreed to take you somewhere off the map.</p>
            </div>

            <div className="guide-card p-4 md:p-8" id="guide-card">
                <div className="guide-card-header flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                    <div className="guide-avatar relative overflow-hidden group w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                        {guide.avatar_id && (
                            <Image
                                src={`/avatars/${guide.avatar_id}`}
                                alt={guide.name}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,12,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none mix-blend-overlay opacity-80"></div>
                    </div>
                    <div className="guide-identity flex flex-col items-center md:items-start mt-2 md:mt-0">
                        <div className="guide-verified mb-1 text-[9px] font-share tracking-widest text-green2 flex items-center justify-center md:justify-start gap-2">
                            <div className="w-[6px] h-[6px] bg-green rounded-full"></div>
                            VERIFIED LOCAL GUIDE
                        </div>
                        <h3 className="guide-name font-bebas text-3xl md:text-4xl text-sand2 mb-1 leading-none">{guide.name}, {guide.age}</h3>
                        <p className="guide-meta font-share text-[10px] text-muted tracking-[0.15em]">{guide.origin?.toUpperCase()}</p>
                    </div>
                </div>

                <div className="guide-stats-row grid grid-cols-3 border-b border-border mt-4 md:mt-0">
                    <div className="guide-stat p-4 border-r border-border text-center">
                        <div className="guide-stat-val font-share text-lg text-sand2">{guide.years_in_city}</div>
                        <div className="guide-stat-label font-share text-[8px] uppercase tracking-widest text-muted mt-1">Years in city</div>
                    </div>
                    <div className="guide-stat p-4 border-r border-border text-center">
                        <div className="guide-stat-val font-share text-lg text-sand2">{guide.languages}</div>
                        <div className="guide-stat-label font-share text-[8px] uppercase tracking-widest text-muted mt-1">Languages</div>
                    </div>
                    <div className="guide-stat p-4 text-center">
                        <div className="guide-stat-val font-share text-lg text-sand2">★ 5.0</div>
                        <div className="guide-stat-label font-share text-[8px] uppercase tracking-widest text-muted mt-1">Trust score</div>
                    </div>
                </div>

                <div className="guide-details px-6 py-6">
                    <div className="guide-detail-row flex items-start gap-3 mb-5">
                        <span className="guide-detail-icon text-lg">📍</span>
                        <div className="guide-detail-block">
                            <p className="guide-detail-label font-share text-[9px] uppercase tracking-widest text-muted mb-1">Their territory</p>
                            <p className="guide-detail-val text-sand text-sm font-medium">{guide.territory}</p>
                        </div>
                    </div>
                    <div className="guide-detail-row flex items-start gap-3 mb-5">
                        <span className="guide-detail-icon text-lg">🔑</span>
                        <div className="guide-detail-block">
                            <p className="guide-detail-label font-share text-[9px] uppercase tracking-widest text-muted mb-1">What they'll show you</p>
                            <p className="guide-detail-val text-sand text-sm font-medium">{guide.offer}</p>
                        </div>
                    </div>
                    <div className="guide-detail-row flex items-start gap-3">
                        <span className="guide-detail-icon text-lg">⚡</span>
                        <div className="guide-detail-block w-full">
                            <p className="guide-detail-label font-share text-[9px] uppercase tracking-widest text-muted mb-2">Specialties</p>
                            <div className="guide-tags flex flex-wrap gap-2">
                                {guide.specialties.map((s: string, i: number) => (
                                    <span key={i} className="inline-block bg-bg2 border border-border text-[10px] uppercase font-share tracking-widest text-muted px-2 py-1">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="btn-go w-full max-w-[580px] bg-transparent border-2 border-gold text-gold p-4 font-bebas text-xl tracking-[0.4em] cursor-pointer hover:bg-gold hover:text-bg hover:shadow-[0_0_24px_rgba(212,160,23,0.4)] transition-all flex items-center justify-center mb-4"
                onClick={() => {
                    setModalOpen(true);
                    playSfx('click');
                }}
                onMouseEnter={() => playSfx('hover')}
            >
                ✦ &nbsp; REQUEST THIS GUIDE
            </button>

            <button
                className="btn-again w-[580px]"
                onClick={() => {
                    setCurrentScreen('stamp');
                    playSfx('click');
                }}
                onMouseEnter={() => playSfx('hover')}
            >
                ↩ &nbsp; BACK TO MY STAMP
            </button>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="modal-overlay fixed inset-0 bg-bg/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                        onClick={() => setModalOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-box w-full max-w-[460px] max-h-[90vh] overflow-y-auto bg-panel border-2 border-gold p-6 relative shadow-[0_0_40px_rgba(212,160,23,0.2)] my-auto"
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            {!requestSent ? (
                                <div id="modal-form-section">
                                    <div className="modal-header flex items-center justify-between border-b border-border pb-4 mb-6">
                                        <span className="modal-title font-bebas text-2xl text-sand2 tracking-widest">REQUEST A GUIDE</span>
                                        <button className="modal-close text-muted text-xl hover:text-red transition-colors" onClick={() => setModalOpen(false)}>✕</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="modal-guide-row flex items-center gap-4 bg-bg border border-border p-4 mb-6">
                                            <div className="w-14 h-14 relative overflow-hidden rounded-sm border border-border">
                                                {guide.avatar_id && (
                                                    <Image
                                                        src={`/avatars/${guide.avatar_id}`}
                                                        alt={guide.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,12,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none mix-blend-overlay opacity-60"></div>
                                            </div>
                                            <div>
                                                <div className="modal-guide-name font-bebas text-xl text-gold">{guide.name}</div>
                                                <div className="modal-guide-city font-share text-[10px] text-muted tracking-[0.2em]">{guide.origin?.toUpperCase()}</div>
                                            </div>
                                        </div>
                                        <div className="f-group">
                                            <label className="f-label block text-[10px] tracking-[0.35em] uppercase text-muted font-share mb-[10px]">Your name</label>
                                            <input className="f-input w-full bg-bg border border-border border-b-muted p-3 font-rajdhani text-xl font-semibold text-sand2 outline-none focus:border-gold mb-5" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="First name" />
                                        </div>
                                        <div className="f-group">
                                            <label className="f-label block text-[10px] tracking-[0.35em] uppercase text-muted font-share mb-[10px]">Your email</label>
                                            <input className="f-input w-full bg-bg border border-border border-b-muted p-3 font-rajdhani text-xl font-semibold text-sand2 outline-none focus:border-gold mb-5" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
                                        </div>
                                        <div className="f-group mb-6">
                                            <label className="f-label block text-[10px] tracking-[0.35em] uppercase text-muted font-share mb-[10px]">Preferred date in Tunisia</label>
                                            <input className="f-input w-full bg-bg border border-border border-b-muted p-3 font-rajdhani text-xl font-semibold text-sand2 outline-none focus:border-gold" value={date} onChange={e => setDate(e.target.value)} type="date" />
                                        </div>
                                        <button
                                            className="btn-submit !bg-gold !text-bg w-full"
                                            onClick={() => {
                                                handleSendRequest();
                                                playSfx(!name || !email || !date ? 'glitch' : 'click');
                                            }}
                                            disabled={!name || !email || !date}
                                            onMouseEnter={() => playSfx('hover')}
                                        >
                                            ✦  SEND REQUEST
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="modal-success text-center py-8">
                                    <div className="modal-success-icon text-5xl mb-4">✅</div>
                                    <div className="modal-success-title font-bebas text-3xl text-gold mb-2 tracking-widest">REQUEST SENT</div>
                                    <p className="modal-success-msg text-sand text-sm font-medium">Your request for {guide.name} has been processed.<br />Check your email soon.</p>
                                    <button
                                        className="btn-again mt-6 w-full"
                                        onClick={() => {
                                            setModalOpen(false);
                                            playSfx('click');
                                        }}
                                        onMouseEnter={() => playSfx('hover')}
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
