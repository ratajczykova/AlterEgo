'use client';

import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import HUD from './components/HUD';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import EgoScreen from './components/EgoScreen';
import DebriefScreen from './components/DebriefScreen';
import StampScreen from './components/StampScreen';
import GuideScreen from './components/GuideScreen';
import ProfileScreen from './components/ProfileScreen';

export default function Home() {
  const { currentScreen } = useAppStore();

  return (
    <>
      <HUD />
      <AnimatePresence mode="wait">
        {currentScreen === 'intro' && <IntroScreen key="intro" />}
        {currentScreen === 'loading' && <LoadingScreen key="loading" />}
        {currentScreen === 'ego' && <EgoScreen key="ego" />}
        {currentScreen === 'debrief' && <DebriefScreen key="debrief" />}
        {currentScreen === 'stamp' && <StampScreen key="stamp" />}
        {currentScreen === 'guide' && <GuideScreen key="guide" />}
        {currentScreen === 'profile' && <ProfileScreen key="profile" />}
      </AnimatePresence>
    </>
  );
}
