import React, { useState, useEffect, useRef } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { sounds } from '../../audio/soundEffects';
import { X, Clock, AlertOctagon, CheckCircle2, ShoppingCart, Sparkles } from 'lucide-react';

type QuizRuleType = 'CORRECT' | 'INCORRECT' | 'NOT_CORRECT' | 'REVERSE_FALSE';

interface MathQuestion {
  questionText: string;
  options: number[];
  correctAnswer: number;
  rule: QuizRuleType;
  ruleDescription: string;
}

const generateQuizQuestions = (): MathQuestion[] => {
  const list: MathQuestion[] = [];
  const rules: QuizRuleType[] = [
    'CORRECT',
    'INCORRECT',
    'NOT_CORRECT',
    'CORRECT',
    'INCORRECT',
    'CORRECT',
    'NOT_CORRECT',
    'REVERSE_FALSE',
    'CORRECT',
    'INCORRECT'
  ];

  for (let i = 0; i < 10; i++) {
    const op = Math.floor(Math.random() * 3);
    let a = 0, b = 0, ans = 0, qText = '';

    if (op === 0) {
      a = Math.floor(Math.random() * 15) + 5;
      b = Math.floor(Math.random() * 15) + 3;
      ans = a + b;
      qText = `${a} + ${b} = ?`;
    } else if (op === 1) {
      a = Math.floor(Math.random() * 8) + 3;
      b = Math.floor(Math.random() * 7) + 2;
      ans = a * b;
      qText = `${a} × ${b} = ?`;
    } else {
      b = Math.floor(Math.random() * 7) + 2;
      ans = Math.floor(Math.random() * 8) + 2;
      a = b * ans;
      qText = `${a} ÷ ${b} = ?`;
    }

    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const offset = (Math.floor(Math.random() * 6) + 1) * (Math.random() < 0.5 ? -1 : 1);
      const wrong = ans + offset;
      if (wrong !== ans && wrong >= 0) distractors.add(wrong);
    }

    const allOpts = [ans, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    const rule = rules[i];

    let desc = "Select the CORRECT answer.";
    if (rule === 'INCORRECT') desc = "Select an INCORRECT answer.";
    if (rule === 'NOT_CORRECT') desc = "Choose the answer that is NOT correct.";
    if (rule === 'REVERSE_FALSE') desc = "Reverse Psychology! Pick the FALSE answer.";

    list.push({
      questionText: qText,
      options: allOpts,
      correctAnswer: ans,
      rule,
      ruleDescription: desc
    });
  }

  return list;
};

export const AdFlowModal: React.FC = () => {
  const { isAdFlowOpen, closeAdFlow, fillEnergy, addToast } = useChaos();

  // Stage: 'quiz' | 'failed_math' | 'failed_rule' | 'passed' | 'countdown' | 'ad'
  const [stage, setStage] = useState<'quiz' | 'failed_math' | 'failed_rule' | 'passed' | 'countdown' | 'ad'>('quiz');
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(60);
  const countdownIntervalRef = useRef<number | null>(null);

  // Fake Ads rotation
  const [activeAdIndex, setActiveAdIndex] = useState<number>(0);

  const FAKE_ADS = [
    {
      title: "NOTHING™",
      tagline: "Premium Nothing",
      description: "The world's leading solution to absolutely nothing. Engineered with zero utility and maximum cost.",
      price: "₹999 / month",
      subprice: "Now with 0 additional features.",
      claims: ["Does nothing", "Requires no purpose", "Completely unnecessary", "Premium uselessness"]
    },
    {
      title: "PREMIUM AIR™",
      tagline: "Air, but expensive.",
      description: "Atmospheric gases compressed into an imaginary flask. You are breathing it right now, but you haven't paid us for it.",
      price: "₹1,499 / breath",
      subprice: "78% Nitrogen, 21% Oxygen, 100% Extortion.",
      claims: ["Does nothing", "Requires no purpose", "Completely unnecessary", "Premium uselessness"]
    },
    {
      title: "INVISIBLE WATER™",
      tagline: "You can't see it. You can't drink it either.",
      description: "Molecular hydration that exists purely in theoretical physics. Thirst quenching capability: strictly null.",
      price: "₹799 / imaginary bottle",
      subprice: "0 calories, 0 hydration, 0 reason to buy.",
      claims: ["Does nothing", "Requires no purpose", "Completely unnecessary", "Premium uselessness"]
    },
    {
      title: "DIGITAL STONE™",
      tagline: "A rock. But online.",
      description: "A digital reproduction of a standard basalt pebble. Completely static. Doesn't rotate. Doesn't do anything.",
      price: "₹499 / stone",
      subprice: "Guaranteed to stay motionless forever.",
      claims: ["Does nothing", "Requires no purpose", "Completely unnecessary", "Premium uselessness"]
    }
  ];

  useEffect(() => {
    if (isAdFlowOpen) {
      startNewQuiz();
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  }, [isAdFlowOpen]);

  const startNewQuiz = () => {
    setQuestions(generateQuizQuestions());
    setCurrentQIndex(0);
    setStage('quiz');
    setCountdownSeconds(60);
    setActiveAdIndex(Math.floor(Math.random() * FAKE_ADS.length));
  };

  const handleAnswerClick = (chosen: number) => {
    const q = questions[currentQIndex];
    const isMathCorrect = chosen === q.correctAnswer;

    let passed = false;
    if (q.rule === 'CORRECT') {
      passed = isMathCorrect;
      if (!passed) {
        sounds.playErrorBuzz();
        setStage('failed_math');
        return;
      }
    } else {
      // rule demanded incorrect
      passed = !isMathCorrect;
      if (!passed) {
        sounds.playErrorBuzz();
        setStage('failed_rule'); // Answered mathematically correctly when told not to!
        return;
      }
    }

    sounds.playTypoBlip();
    if (currentQIndex < 9) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      sounds.playSuccessChime();
      setStage('passed');
    }
  };

  const handleStartCountdown = () => {
    setStage('countdown');
    setCountdownSeconds(60);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdownSeconds((sec) => {
        if (sec <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          setStage('ad');
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
  };

  const getCountdownMessage = (sec: number): string => {
    if (sec > 50) return "You may use this time to question your decisions.";
    if (sec > 40) return "Still here?";
    if (sec > 30) return "This is completely optional. Unfortunately, not skipping it is mandatory.";
    if (sec > 20) return "Halfway there. Emotionally, probably not.";
    if (sec > 10) return "You have committed to this.";
    if (sec > 3) return "Almost. Don't get excited.";
    return "Congratulations. You waited one full minute to see absolutely nothing.";
  };

  const handleClaimAdReward = () => {
    fillEnergy();
    closeAdFlow();
  };

  if (!isAdFlowOpen) return null;

  const currentAd = FAKE_ADS[activeAdIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="max-w-xl w-full bg-[#faf9f5] border-4 border-[#18181b] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#18181b] relative">
        {/* Stage: Quiz */}
        {stage === 'quiz' && questions.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#991b1b]">
                  MANDATORY QUALIFICATION PROCEDURE
                </span>
                <h3 className="text-xl font-black text-[#141413] font-cinzel leading-tight mt-0.5">
                  QUALIFICATION EXAM FOR WATCHING AN ADVERTISEMENT
                </h3>
                <p className="text-xs text-[#52524e] italic mt-1">
                  “Because advertisements are apparently a privilege.”
                </p>
              </div>
              <button
                onClick={closeAdFlow}
                className="p-1 border border-[#18181b] hover:bg-[#ebe7dc] text-[#18181b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sarcastic Details Line */}
            <div className="bg-[#f5f3ec] border border-[#18181b] p-2.5 mb-5 text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span>Question {currentQIndex + 1} / 10</span>
                <span>Difficulty: Completely unnecessary</span>
              </div>
              <div className="text-[#52524e]">
                Your chances of understanding this: <span className="font-bold text-[#141413]">Unknown</span>
              </div>
            </div>

            {/* Rule Banner */}
            <div className="p-3 bg-[#fee2e2] border-2 border-[#991b1b] mb-5 text-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#991b1b] block mb-0.5">
                ACTIVE INSTRUCTION
              </span>
              <p className="text-sm font-black text-[#141413]">
                {questions[currentQIndex].ruleDescription}
              </p>
            </div>

            {/* Question Box */}
            <div className="text-center py-6 bg-[#ebe7dc] border-2 border-[#18181b] mb-6">
              <span className="text-4xl sm:text-5xl font-black text-[#141413] tracking-wider">
                {questions[currentQIndex].questionText}
              </span>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {questions[currentQIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(opt)}
                  className="py-3 px-4 bg-[#faf9f5] hover:bg-[#18181b] hover:text-[#faf9f5] border-2 border-[#18181b] text-[#141413] font-bold text-lg transition-all shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Failed Math */}
        {stage === 'failed_math' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto border-2 border-[#991b1b] bg-[#fee2e2] flex items-center justify-center text-[#991b1b] mb-4">
              <AlertOctagon className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-[#991b1b] mb-3">
              ❌ INCORRECT
            </h3>

            <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] max-w-md mx-auto mb-6 text-xs text-[#2c2b28] leading-relaxed">
              <p className="font-bold mb-2">
                You have failed a mathematics question in order to earn the privilege of seeing an advertisement.
              </p>
              <p className="italic text-[#71716a]">
                Think about that.
              </p>
            </div>

            <button
              onClick={startNewQuiz}
              className="px-6 py-3.5 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#991b1b] cursor-pointer"
            >
              Try Again, For Some Reason
            </button>
          </div>
        )}

        {/* Failed Rule */}
        {stage === 'failed_rule' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto border-2 border-[#991b1b] bg-[#fee2e2] flex items-center justify-center text-[#991b1b] mb-4">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-[#991b1b] mb-3">
              🚫 NOT ELIGIBLE FOR AD
            </h3>

            <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] max-w-md mx-auto mb-6 text-xs text-[#2c2b28] leading-relaxed">
              <p className="font-bold mb-2">
                You successfully answered the question but failed to follow the instructions.
              </p>
              <p className="text-sm font-black text-[#141413]">
                Outstanding.
              </p>
            </div>

            <button
              onClick={startNewQuiz}
              className="px-6 py-3.5 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#991b1b] cursor-pointer"
            >
              Restart Quiz From Question 01
            </button>
          </div>
        )}

        {/* Quiz Passed */}
        {stage === 'passed' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto border-2 border-[#15803d] bg-[#dcfce7] flex items-center justify-center text-[#15803d] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-[#15803d] mb-3">
              QUIZ PASSED ✅
            </h3>

            <p className="text-xs text-[#52524e] max-w-sm mx-auto mb-6">
              Congratulations. You are now unnecessarily qualified to watch an advertisement.
            </p>

            <button
              onClick={handleStartCountdown}
              className="px-8 py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#15803d] cursor-pointer"
            >
              Begin Advertisement Preparation
            </button>
          </div>
        )}

        {/* 60-Second Countdown */}
        {stage === 'countdown' && (
          <div className="text-center py-6">
            <div className="text-xs font-black uppercase text-[#991b1b] mb-1">
              MANDATORY PREPARATION DELAY
            </div>

            <h3 className="text-xl font-black text-[#141413] uppercase mb-4">
              PREPARING YOUR ADVERTISEMENT
            </h3>

            {/* Countdown Box */}
            <div className="w-36 h-36 mx-auto border-4 border-[#18181b] bg-[#ebe7dc] flex flex-col items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#18181b]">
              <div className="text-5xl font-black text-[#141413]">
                {countdownSeconds}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#52524e] mt-1">
                SECONDS REMAINING
              </span>
            </div>

            {/* Dynamic Sarcastic 10s message */}
            <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] max-w-sm mx-auto mb-4 text-xs font-bold text-[#141413] leading-relaxed">
              {getCountdownMessage(countdownSeconds)}
            </div>
          </div>
        )}

        {/* The Sarcastic Fake Advertisement */}
        {stage === 'ad' && (
          <div className="text-center py-2">
            <div className="border-t-2 border-b-2 border-[#18181b] py-1 mb-4 text-[10px] font-black tracking-widest uppercase text-[#52524e]">
              ━━━━━━━━━━━━━━━━━━━━━━━━ SPONSORED PROMOTION ━━━━━━━━━━━━━━━━━━━━━━━━
            </div>

            <h2 className="text-3xl font-black text-[#141413] mb-1 font-cinzel">
              {currentAd.title}
            </h2>
            <p className="text-xs font-bold text-[#991b1b] uppercase tracking-wider mb-4">
              {currentAd.tagline}
            </p>

            <div className="p-5 bg-[#f5f3ec] border-2 border-[#18181b] text-left mb-6 shadow-[3px_3px_0px_0px_#18181b]">
              <p className="text-xs text-[#2c2b28] mb-4 leading-relaxed">
                {currentAd.description}
              </p>

              <div className="border-t border-b border-[#18181b]/30 py-3 mb-4 flex items-center justify-between">
                <span className="text-xl font-black text-[#141413]">{currentAd.price}</span>
                <span className="text-[10px] text-[#71716a] italic">{currentAd.subprice}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#141413]">
                {currentAd.claims.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[#15803d]">✓</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleClaimAdReward}
              className="w-full py-4 bg-[#15803d] hover:bg-[#166534] text-[#faf9f5] font-black text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_#18181b] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>[ CLAIM ENERGY QUOTA & CLOSE AD ]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
