'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
    const { collection, xp, setCurrentScreen } = useAppStore();

    const totalCities = new Set(collection.map(item => item.city.toLowerCase())).size;

    return (
        <motion.div
            className="screen active overflow-y-auto flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '120px 24px 64px 24px', background: 'var(--bg)' }}
        >
            <div className="max-w-[800px] w-full flex-shrink-0">
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="bg-gold text-bg font-bebas text-sm tracking-[0.4em] px-4 py-1 mb-4">CONFIDENTIAL RECORD</div>
                    <h2 className="font-bebas text-5xl md:text-7xl text-sand2 tracking-widest mb-2">TRAVELER PASSPORT</h2>
                    <div className="font-share text-muted tracking-[0.2em] uppercase text-xs">
                        TOTAL XP: <span className="text-gold">{xp}</span> &nbsp;&nbsp;|&nbsp;&nbsp;
                        CITIES VISITED: <span className="text-sand">{totalCities} / 6</span>
                    </div>
                </div>

                {collection.length === 0 ? (
                    <div className="border border-border border-dashed p-12 text-center">
                        <p className="font-share text-muted tracking-widest uppercase">No records found. Complete a mission to earn your first Soul Stamp.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {collection.map(item => (
                            <motion.div
                                key={item.id}
                                className="bg-panel border border-border p-6 relative group overflow-hidden"
                                whileHover={{ y: -5, borderColor: 'var(--gold)' }}
                            >
                                {/* Background glow on hover */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="font-share text-[10px] text-muted tracking-[0.3em] uppercase">{item.city}</div>
                                    <div className="text-xs text-muted font-share">{new Date(item.date).toLocaleDateString()}</div>
                                </div>

                                <div className="text-center relative z-10">
                                    <div className="text-4xl mb-4 filter drop-shadow-[0_0_8px_rgba(212,160,23,0.4)]">{item.stampData.seal_emoji}</div>

                                    {/* The moment text appears on hover */}
                                    <div className="h-[60px] overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                                            <div className="font-bebas text-xl text-sand2 tracking-widest">SOUL STAMP</div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center text-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                                            <p className="font-share text-[11px] text-sand italic leading-tight">{item.stampData.moment}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b border-r border-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t border-l border-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 w-full flex justify-center pb-12">
                    <button
                        className="btn-again max-w-[400px] w-full mx-auto"
                        onClick={() => setCurrentScreen('intro')}
                    >
                        ↩  RETURN TO START
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
