import React, { useState, useEffect, useRef } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { sounds } from '../../audio/soundEffects';
import { Phone, ArrowRight, Delete, SlidersHorizontal } from 'lucide-react';

export const PhoneStep: React.FC = () => {
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

  const [phoneDigits, setPhoneDigits] = useState<string>(formData.phone || '');
  const [inputOffset, setInputOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTextInvisible, setIsTextInvisible] = useState<boolean>(false);
  const resetTriggeredRef = useRef<boolean>(false);

  // Scrambled sequence
  const [tapeDigits] = useState<number[]>(() => {
    const arr: number[] = [];
    const seed = [7, 3, 8, 2, 1, 9, 4, 6, 5, 0, 8, 3, 7, 1, 2, 9, 0, 4, 5, 8, 6, 2, 7, 3, 1, 0, 9, 5, 8, 4, 2, 6, 3, 7, 1, 8, 0, 9, 4, 5];
    for (let i = 0; i < 4; i++) arr.push(...seed);
    return arr;
  });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 36;
      const offsetY = (Math.random() - 0.5) * 16;
      setInputOffset({ x: Math.round(offsetX), y: Math.round(offsetY) });
    }, 4000);

    return () => clearInterval(moveInterval);
  }, []);

  const appendDigit = (digit: number) => {
    if (phoneDigits.length >= 10) {
      addToast("10 digits maximum reached. Even suffering has a quota.", "info");
      return;
    }

    sounds.playTypoBlip();
    const nextDigits = phoneDigits + digit.toString();
    setPhoneDigits(nextDigits);
    setHasEnteredData((prev) => ({ ...prev, phone: true }));

    if (Math.random() < 0.16 && !isTextInvisible) {
      setIsTextInvisible(true);
      setTimeout(() => setIsTextInvisible(false), 1600);
    }

    if (!resetTriggeredRef.current && nextDigits.length >= 6 && Math.random() < 0.25) {
      resetTriggeredRef.current = true;
      setTimeout(() => {
        const didReset = triggerRandomReset('phone');
        if (didReset) setPhoneDigits('');
      }, 500);
    }
  };

  const handleBackspace = () => {
    if (phoneDigits.length === 0) return;
    sounds.playTypoBlip();
    if (phoneDigits.length > 1 && Math.random() < 0.25) {
      setPhoneDigits((prev) => prev.slice(0, -2));
      addToast("Backspace slipped. Two digits erased.", "error");
    } else {
      setPhoneDigits((prev) => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    handleRapidClick();

    if (phoneDigits.length < 10) {
      sounds.playErrorBuzz();
      triggerSarcasm('mistake');
      return;
    }

    triggerSarcasm('success');
    setFormData((prev) => ({ ...prev, phone: phoneDigits }));
    drainEnergy(12);
    setCurrentStep('step-gender');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#18181b] relative">
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e]">
          <span className="text-[#991b1b] font-black">MANDATORY SECTION B</span>
          <span>PAGE 02 OF UNKNOWN</span>
        </div>

        {/* Dramatic Phase Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
          PHASE 02 — PROVE YOU OWN A PHONE
        </h2>
        <p className="text-sm font-bold text-[#52524e] italic mb-6">
          “This will be harder than necessary.”
        </p>

        {/* Display Box */}
        <div
          className="smooth-dodge relative mb-6"
          style={{ transform: `translate(${inputOffset.x}px, ${inputOffset.y}px)` }}
        >
          <div className="flex items-center justify-between p-4 bg-[#f5f3ec] border-2 border-[#18181b] shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#71716a] font-mono">+91</span>
              <span
                className={`font-mono text-xl tracking-widest font-black ${
                  isTextInvisible ? 'text-transparent selection:text-transparent' : 'text-[#141413]'
                }`}
              >
                {phoneDigits
                  ? phoneDigits.split('').map((d, i) => (i === 5 ? ` ${d}` : d)).join('')
                  : '__________'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isTextInvisible && (
                <span className="text-[10px] text-[#991b1b] font-bold px-2 py-0.5 bg-[#fee2e2] border border-[#991b1b]">
                  “Invisible. Still here.”
                </span>
              )}
              <button
                onClick={handleBackspace}
                className="p-2 border border-[#18181b] bg-[#faf9f5] hover:bg-[#ebe7dc] text-[#141413] transition-colors cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-[11px] text-[#52524e]">
            <span>Digits confirmed: {phoneDigits.length} / 10</span>
            <span>Micro-scroller precision active</span>
          </div>
        </div>

        {/* Micro Digit Scrollbar */}
        <div className="mb-8 p-4 bg-[#f5f3ec] border-2 border-[#18181b]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs font-black uppercase text-[#141413]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Federal Micro-Digit Tape</span>
            </div>
            <span className="text-[10px] text-[#71716a]">
              Scroll using the 3px bar below
            </span>
          </div>

          {/* 3px micro-scrollbar track */}
          <div className="overflow-x-auto micro-scrollbar py-2.5 px-1 border border-[#18181b] bg-[#faf9f5]">
            <div className="flex items-center gap-2 w-max">
              {tapeDigits.map((digit, idx) => (
                <button
                  key={idx}
                  onClick={() => appendDigit(digit)}
                  className="w-10 h-10 flex-shrink-0 bg-[#ebe7dc] hover:bg-[#18181b] hover:text-[#faf9f5] border border-[#18181b] text-[#141413] font-bold text-sm transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_0px_#18181b]"
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#52524e] text-center mt-2 italic">
            Direct keyboard input has been confiscated by security policy.
          </p>
        </div>

        {/* Sarcastic Submit Button */}
        <div className="pt-4 border-t-2 border-[#18181b] flex items-center justify-end">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#b45309] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            <span>Make Things Worse</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
