import React, { useState, useEffect, useRef } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { sounds } from '../../audio/soundEffects';
import { ArrowRight, Eye, EyeOff, Check, X, HelpCircle } from 'lucide-react';

export const PasswordStep: React.FC = () => {
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

  const [password, setPassword] = useState<string>(formData.password || '');
  const [isEyeOpen, setIsEyeOpen] = useState<boolean>(true); // Eye open -> HIDDEN
  const [inputOffset, setInputOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTextInvisible, setIsTextInvisible] = useState<boolean>(false);
  const resetTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 14;
      setInputOffset({ x: Math.round(offsetX), y: Math.round(offsetY) });
    }, 3800);

    return () => clearInterval(moveInterval);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setHasEnteredData((prev) => ({ ...prev, password: true }));

    if (Math.random() < 0.16 && !isTextInvisible && val.length > 2) {
      setIsTextInvisible(true);
      setTimeout(() => setIsTextInvisible(false), 1700);
    }

    if (!resetTriggeredRef.current && val.length >= 8 && Math.random() < 0.2) {
      resetTriggeredRef.current = true;
      setTimeout(() => {
        const didReset = triggerRandomReset('password');
        if (didReset) setPassword('');
      }, 600);
    }
  };

  const toggleEye = () => {
    sounds.playTypoBlip();
    setIsEyeOpen((prev) => !prev);
  };

  const handleContinue = () => {
    handleRapidClick();

    if (password.length < 6) {
      sounds.playErrorBuzz();
      triggerSarcasm('mistake');
      return;
    }

    triggerSarcasm('success');
    setFormData((prev) => ({ ...prev, password }));
    drainEnergy(12);
    setCurrentStep('step-confirm');
  };

  const reqs = [
    { label: "Contains at least 6 characters of deep regret", met: password.length >= 6 },
    { label: "Complies with the reversed laws of physics", met: isEyeOpen },
    { label: "Guaranteed to be forgotten within 12 seconds", met: password.length >= 4 }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#18181b] relative">
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e]">
          <span className="text-[#991b1b] font-black">MANDATORY SECTION D</span>
          <span>PAGE 04 OF UNKNOWN</span>
        </div>

        {/* Dramatic Phase Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
          PHASE 04 — CREATE A PASSWORD
        </h2>
        <p className="text-sm font-bold text-[#52524e] italic mb-6">
          “Please remember something we will probably reject later.”
        </p>

        {/* Input box with Reversed Eye */}
        <div
          className="smooth-dodge relative mb-6"
          style={{ transform: `translate(${inputOffset.x}px, ${inputOffset.y}px)` }}
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-[#141413] mb-2">
            Confidential Verification Token
          </label>

          <div className="relative">
            <input
              type={isEyeOpen ? "password" : "text"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password..."
              autoComplete="off"
              className={`w-full px-4 py-3.5 pr-28 bg-[#f5f3ec] border-2 border-[#18181b] text-base font-bold text-[#141413] placeholder:text-[#a8a29e] focus:outline-none focus:bg-[#faf9f5] shadow-[3px_3px_0px_0px_#18181b] transition-colors ${
                isTextInvisible ? 'text-transparent selection:text-transparent' : ''
              }`}
            />

            {/* Inverted Eye Button with Tooltip */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 group">
              <button
                type="button"
                onClick={toggleEye}
                className="p-2 border border-[#18181b] bg-[#faf9f5] hover:bg-[#ebe7dc] text-[#141413] transition-all cursor-pointer"
                title="Maamanodonnum thonnalle."
              >
                {isEyeOpen ? <Eye className="w-5 h-5 text-[#141413]" /> : <EyeOff className="w-5 h-5 text-[#991b1b]" />}
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <div className="bg-[#18181b] text-[#faf9f5] text-xs font-bold px-3 py-1.5 border border-[#faf9f5] shadow-xl whitespace-nowrap">
                  “Maamanodonnum thonnalle.”
                </div>
                <div className="w-2 h-2 bg-[#18181b] rotate-45 -mt-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] text-[#52524e]">
            <div className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#18181b]" />
              <span>
                Reversed Protocol: Eye is {isEyeOpen ? "OPEN (Hidden)" : "CLOSED (Visible)"}
              </span>
            </div>
            <span>{password.length} characters</span>
          </div>
        </div>

        {/* Validation Parameters */}
        <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] mb-8 space-y-1.5">
          <span className="text-[10px] uppercase font-black text-[#52524e] block mb-1">
            Mandatory Bureaucratic Tests
          </span>
          {reqs.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {r.met ? (
                <Check className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-[#991b1b] shrink-0" />
              )}
              <span className={r.met ? 'text-[#141413] font-bold' : 'text-[#71716a]'}>
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {/* Sarcastic Submit Button */}
        <div className="pt-4 border-t-2 border-[#18181b] flex items-center justify-end">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#ea580c] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            <span>Yes, Unfortunately</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
