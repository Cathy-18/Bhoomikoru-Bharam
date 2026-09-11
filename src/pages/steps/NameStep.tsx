import React, { useState, useEffect, useRef } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { sounds } from '../../audio/soundEffects';
import { User, ArrowRight, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const NameStep: React.FC = () => {
  const {
    formData,
    setFormData,
    setCurrentStep,
    drainEnergy,
    setHasEnteredData,
    triggerRandomReset,
    triggerSarcasm,
    addToast,
    handleRapidClick
  } = useChaos();

  const [actualValue, setActualValue] = useState<string>(formData.fullName || '');
  const [displayValue, setDisplayValue] = useState<string>(formData.fullName || '');
  const [isTextInvisible, setIsTextInvisible] = useState<boolean>(false);
  const [hasReappearedNotice, setHasReappearedNotice] = useState<boolean>(false);
  const [inputOffset, setInputOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMovedNotice, setHasMovedNotice] = useState<boolean>(false);
  const [reEntryPraise, setReEntryPraise] = useState<boolean>(false);

  const typoCountRef = useRef<number>(0);
  const resetAttemptedRef = useRef<boolean>(false);
  const hasResetOnceRef = useRef<boolean>(false);

  // Input relocation every 4 seconds
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 44;
      const offsetY = (Math.random() - 0.5) * 20;
      setInputOffset({ x: Math.round(offsetX), y: Math.round(offsetY) });
      setHasMovedNotice(true);
      setTimeout(() => setHasMovedNotice(false), 2400);
    }, 4200);

    return () => clearInterval(moveInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setActualValue(newVal);
    setHasEnteredData((prev) => ({ ...prev, fullName: true }));

    if (hasResetOnceRef.current && newVal.length >= 6 && !reEntryPraise) {
      setReEntryPraise(true);
      addToast("“Excellent dedication.”", "info");
    }

    // Disappearing bug
    if (Math.random() < 0.14 && !isTextInvisible && newVal.length > 3) {
      setIsTextInvisible(true);
      setHasReappearedNotice(false);
      setTimeout(() => {
        setIsTextInvisible(false);
        setHasReappearedNotice(true);
        setTimeout(() => setHasReappearedNotice(false), 2200);
      }, 1900);
    }

    // Typo chaos (~3 typos)
    let visualText = newVal;
    if (newVal.length > 4 && typoCountRef.current < 3 && Math.random() < 0.28) {
      typoCountRef.current += 1;
      sounds.playTypoBlip();
      const typoType = Math.floor(Math.random() * 3);
      const idx = Math.max(0, newVal.length - 2);

      if (typoType === 0 && newVal.length > 2) {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const char = letters[Math.floor(Math.random() * letters.length)];
        visualText = newVal.substring(0, idx) + char + newVal.substring(idx + 1);
      } else if (typoType === 1) {
        visualText = newVal.substring(0, idx) + 'z' + newVal.substring(idx);
      } else if (typoType === 2 && newVal.length > 3) {
        visualText = newVal.substring(0, idx) + newVal.substring(idx + 1);
      }
    }

    setDisplayValue(visualText);

    // Random reset check
    if (!resetAttemptedRef.current && newVal.length >= 8 && Math.random() < 0.18) {
      resetAttemptedRef.current = true;
      setTimeout(() => {
        const didReset = triggerRandomReset('fullName');
        if (didReset) {
          hasResetOnceRef.current = true;
          setActualValue('');
          setDisplayValue('');
        }
      }, 700);
    }
  };

  const handleContinue = () => {
    handleRapidClick();

    if (!actualValue.trim()) {
      sounds.playErrorBuzz();
      triggerSarcasm('mistake');
      return;
    }

    triggerSarcasm('success');
    setFormData((prev) => ({ ...prev, fullName: actualValue.trim() }));
    drainEnergy(12);
    setCurrentStep('step-blank-1');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#18181b] relative">
        {/* Phase Badge */}
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e]">
          <span className="text-[#991b1b] font-black">MANDATORY SECTION A</span>
          <span>PAGE 01 OF UNKNOWN</span>
        </div>

        {/* Dramatic Phase Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
          PHASE 01 — IDENTIFY YOURSELF
        </h2>
        <p className="text-sm font-bold text-[#52524e] italic mb-6">
          “Because apparently we don't know who you are.”
        </p>

        {/* Input box */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-2">
            Citizen Full Legal Designation
          </label>

          <div
            className="smooth-dodge relative"
            style={{ transform: `translate(${inputOffset.x}px, ${inputOffset.y}px)` }}
          >
            <input
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              placeholder="e.g. Catherine Nixon"
              autoComplete="off"
              spellCheck="false"
              className={`w-full px-4 py-3.5 bg-[#f5f3ec] border-2 border-[#18181b] text-base font-bold text-[#141413] placeholder:text-[#a8a29e] focus:outline-none focus:bg-[#faf9f5] shadow-[3px_3px_0px_0px_#18181b] transition-colors ${
                isTextInvisible ? 'text-transparent selection:text-transparent' : ''
              }`}
            />
          </div>

          {/* Sarcastic Input Messages */}
          <div className="mt-3 space-y-1 text-xs">
            {isTextInvisible && (
              <p className="text-[#991b1b] font-bold flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>“Your text is still here. We just don't want you to see it.”</span>
              </p>
            )}

            {hasReappearedNotice && (
              <p className="text-[#15803d] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>“There it is.”</span>
              </p>
            )}

            {hasMovedNotice && (
              <p className="text-[#b45309] font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>“The input field has relocated. Please follow it.”</span>
              </p>
            )}

            {!isTextInvisible && !hasReappearedNotice && !hasMovedNotice && (
              <p className="text-[#71716a] text-[11px]">
                Typing normally will introduce realistic administrative typing anomalies.
              </p>
            )}
          </div>
        </div>

        {/* Sarcastic Submit Button */}
        <div className="pt-4 border-t-2 border-[#18181b] flex items-center justify-end">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#991b1b] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            <span>I Accept My Fate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
