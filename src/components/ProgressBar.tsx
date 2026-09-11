import React, { useState, useEffect } from 'react';
import { useChaos, AppStep } from '../context/AppChaosContext';
import { AlertCircle } from 'lucide-react';

export const ProgressBar: React.FC = () => {
  const { currentStep, reconsideredProgressNotice } = useChaos();

  const getBasePercentage = (step: AppStep): number => {
    switch (step) {
      case 'step-name': return 14;
      case 'step-blank-1': return 28;
      case 'step-phone': return 42;
      case 'step-gender': return 58;
      case 'step-password': return 74;
      case 'step-confirm': return 88;
      default: return 10;
    }
  };

  const [displayedPercent, setDisplayedPercent] = useState<number>(getBasePercentage(currentStep));

  // Sync with step
  useEffect(() => {
    setDisplayedPercent(getBasePercentage(currentStep));
  }, [currentStep]);

  // When reconsideration triggers, step back by 2%
  useEffect(() => {
    if (reconsideredProgressNotice) {
      setDisplayedPercent((prev) => Math.max(5, prev - 2));
    }
  }, [reconsideredProgressNotice]);

  const remaining = Math.max(0, 100 - displayedPercent);

  // Generate ASCII block progress string
  const totalBlocks = 18;
  const filledBlocks = Math.round((displayedPercent / 100) * totalBlocks);
  const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4 font-mono">
      <div className="bg-[#faf9f5] border-2 border-[#18181b] p-4 shadow-[3px_3px_0px_0px_#18181b]">
        {/* Reconsideration Warning Banner */}
        {reconsideredProgressNotice && (
          <div className="mb-3 p-2 bg-amber-500/20 border border-amber-800 text-amber-900 text-xs font-bold flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-800" />
            <span>“We reconsidered your progress.” (-2% penalty applied)</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 border-b border-[#18181b]/30 pb-1">
          <span>YOUR PROGRESS</span>
          <span className="bg-[#18181b] text-[#faf9f5] px-1.5 py-0.5">{displayedPercent}%</span>
        </div>

        {/* Monospace ASCII progress bar */}
        <div className="text-base sm:text-lg tracking-widest text-[#18181b] select-none my-1 font-mono">
          {asciiBar}
        </div>

        {/* Sarcastic commentary */}
        <div className="mt-3 text-xs text-[#2c2b28] leading-relaxed border-t border-[#18181b]/20 pt-2">
          <p className="font-bold">
            {displayedPercent}% of the journey completed.
          </p>
          <p className="text-[#52524e] italic mt-0.5">
            Unfortunately, the remaining {remaining}% is considerably worse.
          </p>
        </div>
      </div>
    </div>
  );
};
