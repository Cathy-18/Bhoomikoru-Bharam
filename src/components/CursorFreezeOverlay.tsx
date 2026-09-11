import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/AppChaosContext';
import { ShieldAlert, Wind, MousePointer } from 'lucide-react';

const SARCASTIC_FREEZE_MESSAGES = [
  "“The fan has decided that you've had enough screen time.”",
  "“Please remain calm.”",
  "“You are not allowed to click right now.”",
  "“The cursor has gone on a break.”",
  "“This is completely unnecessary.”",
  "“You could have been finished by now.”",
  "“The fan has spoken.”",
  "“Your mouse privileges will be restored shortly.”",
  "“Thank you for your patience. You were not given a choice.”"
];

export const CursorFreezeOverlay: React.FC = () => {
  const { isCursorFrozen, freezeTimeRemaining } = useChaos();
  const [activeMessageIndex, setActiveMessageIndex] = useState<number>(0);

  // Rotate sarcastic messages every 4.5 seconds during the freeze
  useEffect(() => {
    if (!isCursorFrozen) return;

    const msgInterval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % SARCASTIC_FREEZE_MESSAGES.length);
    }, 4500);

    return () => clearInterval(msgInterval);
  }, [isCursorFrozen]);

  if (!isCursorFrozen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-[#0c0c0e]/85 backdrop-blur-md flex items-center justify-center cursor-not-allowed select-none p-4 font-mono transition-opacity duration-300 pointer-events-auto"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="max-w-lg w-full bg-[#faf9f5] border-4 border-[#991b1b] p-6 sm:p-10 shadow-[10px_10px_0px_0px_#991b1b] text-center animate-wiggle">
        {/* Large Spinning Fan Icon */}
        <div className="w-20 h-20 mx-auto border-3 border-[#991b1b] bg-[#fee2e2] flex items-center justify-center mb-4">
          <Wind className="w-12 h-12 text-[#991b1b] animate-spin-fast" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#991b1b] mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>🌀 FAN INTERRUPTION</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#141413] mb-3 tracking-tight uppercase font-cinzel">
          YOUR CURSOR HAS BEEN TEMPORARILY SUSPENDED.
        </h3>

        {/* Reason Box */}
        <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] text-left text-xs mb-6 space-y-1">
          <span className="font-black text-[#991b1b] uppercase block">Reason:</span>
          <p className="text-[#2c2b28] font-bold leading-relaxed">
            The fan has decided that you have been using the website for too long.
          </p>
        </div>

        {/* 40-Second Countdown */}
        <div className="p-5 bg-[#ebe7dc] border-2 border-[#18181b] mb-6">
          <span className="text-[11px] uppercase font-bold text-[#52524e] tracking-widest block mb-1">
            Cursor will return in:
          </span>
          <div className="text-6xl sm:text-7xl font-black text-[#991b1b] tracking-wider animate-pulse">
            {freezeTimeRemaining}
          </div>
          <span className="text-[10px] text-[#71716a] uppercase font-bold mt-1 block">
            SECONDS OF MANDATORY IDLENESS
          </span>
        </div>

        {/* Rotating Sarcastic Message */}
        <div className="p-3 bg-[#faf9f5] border border-[#d4cfc4] text-xs font-bold text-[#141413] italic min-h-[46px] flex items-center justify-center">
          {SARCASTIC_FREEZE_MESSAGES[activeMessageIndex]}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#71716a]">
          <MousePointer className="w-3.5 h-3.5 text-[#991b1b] line-through" />
          <span>All clicking, typing, and scrolling has been revoked</span>
        </div>
      </div>
    </div>
  );
};
