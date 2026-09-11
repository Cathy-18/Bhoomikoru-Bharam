import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { sounds } from '../audio/soundEffects';

export type AppStep =
  | 'landing'
  | 'step-name'
  | 'step-blank-1'
  | 'step-phone'
  | 'step-gender'
  | 'step-password'
  | 'step-confirm'
  | 'login'
  | 'crash';

export interface FormDataState {
  fullName: string;
  phone: string;
  gender: string;
  password: string;
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: 'snark' | 'reset' | 'info' | 'error' | 'success' | 'alert';
}

export interface PhoneCallData {
  id: string;
  caller: string;
  number: string;
  reason: string;
}

export type SarcasmTrigger = 
  | 'success'
  | 'mistake'
  | 'wait'
  | 'new_step'
  | 'back'
  | 'energy_low'
  | 'energy_full';

export type CursorPhase = 'active' | 'frozen';

interface CursorCycleState {
  phase: CursorPhase;
  activeTimeRemaining: number;
  freezeTimeRemaining: number;
}

interface ChaosContextType {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  goToPreviousStep: (step: AppStep) => void;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  hasEnteredData: { [key: string]: boolean };
  setHasEnteredData: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;

  // Sarcasm Engine
  triggerSarcasm: (trigger: SarcasmTrigger) => void;

  // Energy System
  energy: number;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  drainEnergy: (amount: number) => void;
  fillEnergy: () => void;
  isAdFlowOpen: boolean;
  setIsAdFlowOpen: (open: boolean) => void;
  openAdFlow: () => void;
  closeAdFlow: () => void;

  // Fan System & 10s/40s Global Cursor Cycle
  isFanOn: boolean;
  fanCountdown: number | null;
  fanSoundEnabled: boolean;
  toggleFanPower: () => void;
  toggleFanSound: () => void;
  cursorPhase: CursorPhase;
  activeTimeRemaining: number;
  freezeTimeRemaining: number;
  cursorFreezeCountdown: number; // alias of freezeTimeRemaining
  isCursorFrozen: boolean;

  // Resets System
  totalResets: number;
  triggerRandomReset: (fieldName: keyof FormDataState) => boolean;

  // Progress reconsideration
  reconsideredProgressNotice: string | null;

  // Phone Call Popup System
  activeCall: PhoneCallData | null;
  dismissCall: (action: 'accepted' | 'declined') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (msg: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Login attempts
  loginAttempts: number;
  handleLoginAttempt: (username: string, pass: string) => { success: boolean; message: string; sub?: string };

  // Restart Website
  restartWebsite: () => void;

  // Sound Engine mute toggle
  isMuted: boolean;
  toggleMute: () => void;

  // Micro-interaction handlers
  handleRapidClick: () => void;
  handleDisabledHover: () => string;
}

const ChaosContext = createContext<ChaosContextType | null>(null);

const SARCASM_BANK: Record<SarcasmTrigger, string[]> = {
  success: [
    "Excellent. Humanity progresses. That information was completely unnecessary.",
    "✓ Information accepted. Unfortunately, we need more.",
    "Good job. You have successfully completed a step that absolutely did not need to exist."
  ],
  mistake: [
    "Impressive. That was somehow wrong.",
    "Incorrect. We expected better.",
    "Nice try. Unfortunately, the website disagrees.",
    "You were so close. Not actually."
  ],
  wait: [
    "Please wait... We are finding a reason to keep you waiting.",
    "Processing... This should not take this long. But it will.",
    "Almost done. This statement is legally meaningless."
  ],
  new_step: [
    "Congratulations. There is another step.",
    "Welcome to the next phase. You could have been done by now.",
    "Excellent progress. Only several completely unnecessary steps remain."
  ],
  back: [
    "Going back? Bold decision.",
    "You chose to return. We respect your poor decision-making."
  ],
  energy_low: [
    "ENERGY CRITICAL: Apparently filling out a form requires stamina.",
    "You are running out of energy. This is somehow your problem."
  ],
  energy_full: [
    "ENERGY: 100%: You are now fully powered to continue doing absolutely nothing."
  ]
};

const CALL_PRESETS = [
  { caller: "Dept. of Unrequested Inquiries", number: "+91 98470 41209", reason: "Calling to verify if you are still wasting time on Phase 01." },
  { caller: "Suresh's Mandatory Catering", number: "+91 94471 88231", reason: "Demanding payment for 200 nonexistent samosas." },
  { caller: "Federal Redundancy Commission", number: "+1 800 404 0000", reason: "Notice of impending unnecessary bureaucracy audit." },
  { caller: "Your Former Kindergarten Teacher", number: "+91 97455 12903", reason: "Asking why you haven't memorized your 10-digit number yet." }
];

export const ChaosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStepState] = useState<AppStep>(() => {
    return (localStorage.getItem('bb_step') as AppStep) || 'landing';
  });

  const [formData, setFormData] = useState<FormDataState>(() => {
    const saved = localStorage.getItem('bb_formData');
    return saved ? JSON.parse(saved) : { fullName: '', phone: '', gender: '', password: '' };
  });

  const [hasEnteredData, setHasEnteredData] = useState<{ [key: string]: boolean }>({});
  const [totalResets, setTotalResets] = useState<number>(() => {
    return parseInt(localStorage.getItem('bb_resets') || '0', 10);
  });

  const [energy, setEnergy] = useState<number>(() => {
    const saved = localStorage.getItem('bb_energy');
    return saved !== null ? parseInt(saved, 10) : 40;
  });

  const [isAdFlowOpen, setIsAdFlowOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Fan & Cursor Cycle State: 10s ACTIVE -> 40s FROZEN -> 10s ACTIVE -> 40s FROZEN -> REPEAT
  const [isFanOn, setIsFanOn] = useState<boolean>(true);
  const [fanCountdown, setFanCountdown] = useState<number | null>(null);
  const [fanSoundEnabled, setFanSoundEnabled] = useState<boolean>(false);

  const [cursorCycle, setCursorCycle] = useState<CursorCycleState>({
    phase: 'active',
    activeTimeRemaining: 10,
    freezeTimeRemaining: 40
  });

  // Progress reconsideration banner
  const [reconsideredProgressNotice, setReconsideredProgressNotice] = useState<string | null>(null);

  // Call popup
  const [activeCall, setActiveCall] = useState<PhoneCallData | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Login
  const [loginAttempts, setLoginAttempts] = useState<number>(0);

  // Timers & counters for micro-interactions
  const fanCountdownTimerRef = useRef<number | null>(null);
  const callIntervalRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const clickCountRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);
  const modalOpenCountRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('bb_step', currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('bb_formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('bb_energy', energy.toString());
  }, [energy]);

  useEffect(() => {
    localStorage.setItem('bb_resets', totalResets.toString());
  }, [totalResets]);

  const addToast = (message: string, type: ToastMessage['type'] = 'snark', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-3), { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 5200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerSarcasm = (trigger: SarcasmTrigger) => {
    const bank = SARCASM_BANK[trigger];
    if (bank && bank.length > 0) {
      const msg = bank[Math.floor(Math.random() * bank.length)];
      addToast(msg, trigger === 'mistake' || trigger === 'energy_low' ? 'error' : 'snark');
    }
  };

  const setCurrentStep = (next: AppStep) => {
    setCurrentStepState(next);
    if (next !== 'landing' && next !== 'crash') {
      triggerSarcasm('new_step');
    }
  };

  const goToPreviousStep = (prev: AppStep) => {
    setCurrentStepState(prev);
    triggerSarcasm('back');
  };

  // =========================================================================
  // GLOBAL 10s ACTIVE -> 40s FROZEN CYCLE (NEVER RESETS ON PAGE NAVIGATION)
  // =========================================================================
  useEffect(() => {
    if (currentStep === 'crash') return;

    const cycleTimer = window.setInterval(() => {
      setCursorCycle((prev) => {
        if (prev.phase === 'active') {
          if (prev.activeTimeRemaining <= 1) {
            // TRANSITION TO 40 SECONDS FROZEN
            sounds.playErrorBuzz();
            return {
              phase: 'frozen',
              activeTimeRemaining: 10,
              freezeTimeRemaining: 40
            };
          }
          return {
            ...prev,
            activeTimeRemaining: prev.activeTimeRemaining - 1
          };
        } else {
          // PHASE IS FROZEN
          if (prev.freezeTimeRemaining <= 1) {
            // RESTORE TO 10 SECONDS ACTIVE!
            sounds.playSuccessChime();
            addToast("Enjoy your freedom. It will not last.", "info", "CURSOR RESTORED ✓");
            return {
              phase: 'active',
              activeTimeRemaining: 10,
              freezeTimeRemaining: 40
            };
          }
          return {
            ...prev,
            freezeTimeRemaining: prev.freezeTimeRemaining - 1
          };
        }
      });
    }, 1000);

    return () => clearInterval(cycleTimer);
  }, [currentStep]);

  // Global Keyboard and Scroll suppression during frozen phase
  useEffect(() => {
    if (cursorCycle.phase !== 'frozen') return;

    const blockEvent = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('keydown', blockEvent, { capture: true });
    window.addEventListener('keypress', blockEvent, { capture: true });
    window.addEventListener('keyup', blockEvent, { capture: true });
    window.addEventListener('wheel', blockEvent, { capture: true, passive: false });
    window.addEventListener('touchmove', blockEvent, { capture: true, passive: false });

    return () => {
      window.removeEventListener('keydown', blockEvent, { capture: true });
      window.removeEventListener('keypress', blockEvent, { capture: true });
      window.removeEventListener('keyup', blockEvent, { capture: true });
      window.removeEventListener('wheel', blockEvent, { capture: true });
      window.removeEventListener('touchmove', blockEvent, { capture: true });
    };
  }, [cursorCycle.phase]);

  // Micro-interaction: Idle detector (after 24s idle)
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        if (currentStep !== 'landing' && currentStep !== 'crash') {
          addToast("Are you reconsidering? It's okay, nobody wanted this form anyway.", "snark", "IDLE ADVISORY");
        }
      }, 24000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentStep]);

  // Micro-interaction: Window focus / Tab return
  useEffect(() => {
    const handleFocus = () => {
      if (currentStep !== 'landing' && currentStep !== 'crash') {
        addToast("You came back? We genuinely expected you to close the tab.", "info", "SURPRISED SYSTEM");
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentStep]);

  // Micro-interaction: Rapid clicking
  const handleRapidClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 400) {
      clickCountRef.current += 1;
      if (clickCountRef.current === 3) {
        addToast("Relax.", "snark");
      } else if (clickCountRef.current >= 5) {
        addToast("We heard you. The button does not care.", "error");
        clickCountRef.current = 0;
      }
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;
  };

  const handleDisabledHover = () => {
    return "Not yet. Patience is a mandatory regulatory requirement.";
  };

  // Periodic random reconsideration of progress
  useEffect(() => {
    if (!currentStep.startsWith('step-')) return;

    const reconInterval = window.setInterval(() => {
      if (Math.random() < 0.25) {
        setReconsideredProgressNotice("We reconsidered your progress. Deducting 2% for emotional re-evaluation.");
        sounds.playErrorBuzz();
        setTimeout(() => setReconsideredProgressNotice(null), 4000);
      }
    }, 20000);

    return () => clearInterval(reconInterval);
  }, [currentStep]);

  // Periodic Random Phone Call Engine
  useEffect(() => {
    if (currentStep === 'landing' || currentStep === 'crash') {
      if (activeCall) setActiveCall(null);
      return;
    }

    const scheduleNextCall = () => {
      const delay = 45000 + Math.random() * 30000;
      callIntervalRef.current = window.setTimeout(() => {
        if (!activeCall) {
          const callData = CALL_PRESETS[Math.floor(Math.random() * CALL_PRESETS.length)];
          setActiveCall({ ...callData, id: Math.random().toString() });
          sounds.startPhoneRing();
        }
        scheduleNextCall();
      }, delay);
    };

    scheduleNextCall();

    return () => {
      if (callIntervalRef.current) clearTimeout(callIntervalRef.current);
      sounds.stopPhoneRing();
    };
  }, [currentStep, activeCall]);

  const dismissCall = (action: 'accepted' | 'declined') => {
    sounds.stopPhoneRing();
    if (activeCall) {
      if (action === 'accepted') {
        addToast(`Accepted call from ${activeCall.caller}: "Hello? Please cancel this form immediately." *Line disconnected*`, 'info', "COMMUNICATION LOG");
      } else {
        addToast(`Declined call from ${activeCall.caller}. They will file an official complaint.`, 'info', "INCIDENT FILED");
      }
      setActiveCall(null);
    }
  };

  // Fan Sound Management
  useEffect(() => {
    if (isFanOn && fanSoundEnabled && !isMuted) {
      sounds.startFanHum();
    } else {
      sounds.stopFanHum();
    }
  }, [isFanOn, fanSoundEnabled, isMuted]);

  // Turn Fan Off -> Auto-Restart in exactly 5 seconds (Does NOT stop cursor freeze cycle!)
  const toggleFanPower = () => {
    if (isFanOn) {
      setIsFanOn(false);
      setFanCountdown(5);
      sounds.stopFanHum();

      let currentCount = 5;
      if (fanCountdownTimerRef.current) clearInterval(fanCountdownTimerRef.current);

      fanCountdownTimerRef.current = window.setInterval(() => {
        currentCount -= 1;
        setFanCountdown(currentCount);

        if (currentCount <= 0) {
          if (fanCountdownTimerRef.current) clearInterval(fanCountdownTimerRef.current);
          setFanCountdown(null);
          setIsFanOn(true);
          addToast("Fan restored. Crisis avoided.", "info", "AUTOMATIC RESTART");
        }
      }, 1000);
    } else {
      if (fanCountdownTimerRef.current) clearInterval(fanCountdownTimerRef.current);
      setFanCountdown(null);
      setIsFanOn(true);
    }
  };

  const toggleFanSound = () => {
    setFanSoundEnabled((prev) => !prev);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  const drainEnergy = (amount: number) => {
    setEnergy((prev) => {
      const next = Math.max(0, prev - amount);
      if (next <= 20) {
        triggerSarcasm('energy_low');
      }
      return next;
    });
  };

  const fillEnergy = () => {
    setEnergy(100);
    triggerSarcasm('energy_full');
  };

  const openAdFlow = () => {
    modalOpenCountRef.current += 1;
    if (modalOpenCountRef.current > 1) {
      addToast("Again? You voluntarily requested another advertisement examination.", "snark");
    }
    setIsAdFlowOpen(true);
  };

  const closeAdFlow = () => {
    addToast("Finally. Back to the pointless paperwork.", "snark");
    setIsAdFlowOpen(false);
  };

  const triggerRandomReset = (fieldName: keyof FormDataState): boolean => {
    if (totalResets >= 3) return false;

    setFormData((prev) => ({ ...prev, [fieldName]: '' }));
    setTotalResets((r) => r + 1);
    sounds.playErrorBuzz();

    addToast("We have decided that your previous effort was not valuable.", "reset", "EFFORT REVOCATION");
    return true;
  };

  const handleLoginAttempt = (_username: string, _pass: string) => {
    const newAttempt = loginAttempts + 1;
    setLoginAttempts(newAttempt);

    if (newAttempt >= 5) {
      sounds.playSuccessChime();
      return { 
        success: true, 
        message: "🎉 SUCCESS! YOU ACTUALLY DID IT.", 
        sub: "After all that, you successfully logged in." 
      };
    } else {
      sounds.playErrorBuzz();
      if (newAttempt === 1) {
        return { 
          success: false, 
          message: "LOGIN FAILED", 
          sub: "Your credentials appear to be correct. We have decided that this is not enough." 
        };
      } else if (newAttempt === 2) {
        return { 
          success: false, 
          message: "Authentication failed.", 
          sub: "Reason: Yes." 
        };
      } else {
        return { 
          success: false, 
          message: "LOGIN FAILED", 
          sub: "You have attempted this several times. We admire the commitment. We do not intend to help." 
        };
      }
    }
  };

  const restartWebsite = () => {
    localStorage.removeItem('bb_step');
    localStorage.removeItem('bb_formData');
    localStorage.removeItem('bb_energy');
    localStorage.removeItem('bb_resets');

    setFormData({ fullName: '', phone: '', gender: '', password: '' });
    setHasEnteredData({});
    setTotalResets(0);
    setEnergy(40);
    setLoginAttempts(0);
    setIsAdFlowOpen(false);
    setCursorCycle({
      phase: 'active',
      activeTimeRemaining: 10,
      freezeTimeRemaining: 40
    });
    setCurrentStepState('landing');
  };

  return (
    <ChaosContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        goToPreviousStep,
        formData,
        setFormData,
        hasEnteredData,
        setHasEnteredData,
        triggerSarcasm,
        energy,
        setEnergy,
        drainEnergy,
        fillEnergy,
        isAdFlowOpen,
        setIsAdFlowOpen,
        openAdFlow,
        closeAdFlow,
        isFanOn,
        fanCountdown,
        fanSoundEnabled,
        toggleFanPower,
        toggleFanSound,
        cursorPhase: cursorCycle.phase,
        activeTimeRemaining: cursorCycle.activeTimeRemaining,
        freezeTimeRemaining: cursorCycle.freezeTimeRemaining,
        cursorFreezeCountdown: cursorCycle.freezeTimeRemaining,
        isCursorFrozen: cursorCycle.phase === 'frozen',
        totalResets,
        triggerRandomReset,
        reconsideredProgressNotice,
        activeCall,
        dismissCall,
        toasts,
        addToast,
        removeToast,
        loginAttempts,
        handleLoginAttempt,
        restartWebsite,
        isMuted,
        toggleMute,
        handleRapidClick,
        handleDisabledHover
      }}
    >
      {children}
    </ChaosContext.Provider>
  );
};

export const useChaos = () => {
  const ctx = useContext(ChaosContext);
  if (!ctx) throw new Error("useChaos must be used within ChaosProvider");
  return ctx;
};
