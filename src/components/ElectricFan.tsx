import React from 'react';
import { useChaos } from '../context/AppChaosContext';
import { Power, Volume2, VolumeX, Wind, Clock } from 'lucide-react';

export const ElectricFan: React.FC = () => {
  const {
    currentStep,
    isFanOn,
    fanCountdown,
    fanSoundEnabled,
    toggleFanPower,
    toggleFanSound,
    cursorPhase,
    activeTimeRemaining,
    freezeTimeRemaining
  } = useChaos();

  if (currentStep === 'crash') return null;

  // Format single digit with leading zero e.g. 07s
  const formatSec = (num: number) => (num < 10 ? `0${num}s` : `${num}s`);

  return (
    <aside className="fixed bottom-6 right-6 z-30 flex flex-col items-center bg-[#faf9f5] border-3 border-[#18181b] p-4 shadow-[5px_5px_0px_0px_#18181b] w-64 font-mono text-left select-none">
      {/* Header */}
      <div className="w-full border-b-2 border-[#18181b] pb-2 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Wind className="w-4 h-4 text-[#18181b]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#141413]">
            🌀 ENVIRONMENTAL COMFORT
          </span>
        </div>
        <button
          onClick={toggleFanSound}
          className="p-1 border border-[#18181b] hover:bg-[#ebe7dc] transition-colors cursor-pointer"
          title={fanSoundEnabled ? "Fan Sound: ON" : "Fan Sound: OFF"}
        >
          {fanSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-700" /> : <VolumeX className="w-3.5 h-3.5 text-[#71716a]" />}
        </button>
      </div>

      {/* Control Panel Readout */}
      <div className="w-full bg-[#f5f3ec] border-2 border-[#18181b] p-2.5 mb-3 text-xs space-y-1">
        <div className="flex items-center justify-between font-bold">
          <span>FAN:</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isFanOn ? 'bg-emerald-600 animate-ping' : 'bg-rose-600'}`} />
            <span className={isFanOn ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
              ● {isFanOn ? 'ON' : 'OFF'}
            </span>
          </span>
        </div>

        <div className="border-t border-[#18181b]/20 pt-1 flex items-center justify-between">
          <span className="text-[#52524e] font-bold">Cursor:</span>
          <span className={`font-black uppercase ${cursorPhase === 'active' ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
            {cursorPhase === 'active' ? 'ACTIVE' : 'FROZEN'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#52524e]">
            {cursorPhase === 'active' ? 'Next interruption:' : 'Restoration in:'}
          </span>
          <span className="font-mono font-black text-[#141413] bg-[#ebe7dc] px-1.5 py-0.5 border border-[#18181b]">
            {cursorPhase === 'active' ? formatSec(activeTimeRemaining) : formatSec(freezeTimeRemaining)}
          </span>
        </div>
      </div>

      {/* Fan Visual Container */}
      <div className="relative w-28 h-28 flex items-center justify-center my-1 bg-[#ebe7dc] rounded-full border-2 border-[#18181b] p-2 shadow-inner">
        {/* Guard Grills */}
        <div className="absolute inset-2 rounded-full border border-[#18181b]/40 pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#18181b]/30 rotate-45" />
          <div className="w-full h-[1px] bg-[#18181b]/30 -rotate-45" />
          <div className="w-full h-[1px] bg-[#18181b]/30 rotate-90" />
          <div className="w-full h-[1px] bg-[#18181b]/30" />
        </div>

        {/* Rotating Blades */}
        <div className={`relative w-20 h-20 transition-all ${isFanOn ? 'animate-spin-fast' : 'rotate-45'}`}>
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#18181b] z-10 border border-[#faf9f5] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#faf9f5]" />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-10 bg-[#52524e] rounded-full opacity-90 origin-bottom" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 h-5 w-10 bg-[#52524e] rounded-full opacity-90 origin-left" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-10 bg-[#52524e] rounded-full opacity-90 origin-top" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-5 w-10 bg-[#52524e] rounded-full opacity-90 origin-right" />
        </div>

        {/* Countdown overlay when Fan is turned OFF */}
        {!isFanOn && fanCountdown !== null && (
          <div className="absolute inset-0 bg-[#faf9f5]/90 rounded-full flex flex-col items-center justify-center text-center p-2 z-20">
            <span className="text-2xl font-black text-rose-700 animate-bounce">{fanCountdown}</span>
          </div>
        )}
      </div>

      <div className="w-3 h-3 bg-[#18181b]" />
      <div className="w-16 h-2 bg-[#18181b] mb-3" />

      {/* Fan Restarting countdown box */}
      {!isFanOn && fanCountdown !== null && (
        <div className="w-full bg-[#fee2e2] border-2 border-[#991b1b] p-2 mb-2 text-center text-[10px] text-[#991b1b] leading-tight">
          <p className="font-black mb-0.5">FAN RESTARTING...</p>
          <div className="text-lg font-black">{fanCountdown}</div>
        </div>
      )}

      {/* Turn Fan Off button */}
      <button
        onClick={toggleFanPower}
        className="w-full py-2.5 px-3 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#52524e] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Power className="w-3.5 h-3.5" />
        <span>TURN FAN {isFanOn ? 'OFF' : 'ON'}</span>
      </button>

      <div className="flex items-center gap-1 mt-2 text-[9px] text-[#71716a] text-center">
        <Clock className="w-3 h-3 text-[#b45309] shrink-0" />
        <span>10s Active • 40s Frozen cycle continues</span>
      </div>
    </aside>
  );
};
