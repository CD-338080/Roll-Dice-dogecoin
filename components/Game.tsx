// components/Game.tsx

/**
 * This project was developed by Nikandr Surkov.
 * You may not use this code if you purchased it from any source other than the official website https://nikandr.com.
 * If you purchased it from the official website, you may use it for your own projects,
 * but you may not resell it or publish it publicly.
 * 
 * Website: https://nikandr.com
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * Telegram: https://t.me/nikandr_s
 * Telegram channel for news/updates: https://t.me/clicker_game_news
 * GitHub: https://github.com/nikandr-surkov
 */

'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, lightning } from '@/images';
import IceCube from '@/icons/IceCube';
import IceCubes from '@/icons/IceCubes';
import Rocket from '@/icons/Rocket';
import Energy from '@/icons/Energy';
import Link from 'next/link';
import { useGameStore } from '@/utils/game-mechanics';
import Snowflake from '@/icons/Snowflake';
import TopInfoSection from '@/components/TopInfoSection';
import { LEVELS } from '@/utils/consts';
import { triggerHapticFeedback } from '@/utils/ui';
import SendMessage from '@/components/popups/SendMessage';

interface GameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Game({ currentView, setCurrentView }: GameProps) {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);
  const [showReward, setShowReward] = useState(false);
  const [lastRolls, setLastRolls] = useState<[number, number] | null>(null);

  const {
    points,
    pointsBalance,
    pointsPerClick,
    energy,
    maxEnergy,
    gameLevelIndex,
    clickTriggered,
    updateLastClickTimestamp,
  } = useGameStore();

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);
    triggerHapticFeedback(window);
    let rolls = 0;
    const maxRolls = 20;
    const rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
        const finalValue1 = Math.floor(Math.random() * 6) + 1;
        const finalValue2 = Math.floor(Math.random() * 6) + 1;
        setDiceValues([finalValue1, finalValue2]);
        setLastRolls([finalValue1, finalValue2]);
        if (finalValue1 + finalValue2 === 6) {
          setShowReward(true);
          setTimeout(() => setShowReward(false), 2000);
          clickTriggered();
          updateLastClickTimestamp();
        }
      }
    }, 100);
  };

  return (
    <div className="bg-gradient-to-b from-[#F2A900] to-[#FFD166] flex justify-center min-h-screen">
      <div className="w-full text-white h-screen font-bold flex flex-col max-w-xl">
        <TopInfoSection isGamePage={true} setCurrentView={setCurrentView} />

        <div className="flex-grow mt-4 bg-gradient-to-r from-[#CB8D00] to-[#F2A900] rounded-t-[48px] relative top-glow z-0 shadow-lg">
          <div className="mt-[2px] bg-gradient-to-b from-[#F2A900] to-[#FFD166] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-24">

              {/* Points Display */}
              <div className="px-4 mt-4 flex justify-center">
                <div className="px-6 py-3 bg-[#F2A900]/10 backdrop-blur-sm rounded-xl flex items-center space-x-3 shadow-inner">
                  <div className="w-12 h-12 bg-[#F2A900] rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-black">Ð</span>
                  </div>
                  <p className="text-4xl text-white font-extrabold" suppressHydrationWarning>
                    {Math.floor(pointsBalance).toLocaleString()} Dogecoin
                  </p>
                </div>
              </div>

              {/* Level Display */}
              <div className="flex justify-center gap-2 mt-3 bg-white/10 py-2 rounded-full px-4">
                <p className="text-white">{LEVELS[gameLevelIndex].name}</p>
                <p className="text-white/60">&#8226;</p>
                <p>{gameLevelIndex + 1} <span className="text-white/60">/ {LEVELS.length}</span></p>
              </div>

              {/* Dice Game Section */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[#f0b90b] to-[#f3ba2f] bg-clip-text text-transparent">
                  Lucky Dice
                </h2>
                
                <div className="flex justify-center mb-6 gap-6">
                  {[0, 1].map((idx) => (
                    <div 
                      key={idx}
                      className={`w-32 h-32 bg-white rounded-2xl shadow-lg transform transition-all duration-300 ${isRolling ? 'animate-bounce' : ''}`}
                      style={{
                        transform: isRolling ? 'rotate(360deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease-in-out'
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1 p-2">
                          {[...Array(9)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full ${
                                getDiceDots(diceValues[idx]).includes(i) ? 'bg-[#F2A900]' : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isRolling 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#f0b90b] to-[#f3ba2f] hover:from-[#f3ba2f] hover:to-[#f0b90b] text-[#0a1f17]'
                  }`}
                >
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </button>

                {lastRolls && (
                  <div className="mt-4 text-center">
                    <p className="text-lg">
                      Last roll: <span className="font-bold">{lastRolls[0]}</span> + <span className="font-bold">{lastRolls[1]}</span> = <span className="font-bold">{lastRolls[0] + lastRolls[1]}</span>
                    </p>
                    {lastRolls[0] + lastRolls[1] === 6 && (
                      <p className="text-white font-bold mt-2">
                        +{pointsPerClick} Dogecoin Won! 🎉
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Game Instructions */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[#f0b90b] to-[#f3ba2f] bg-clip-text text-transparent">
                  How to Play
                </h2>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#f0b90b] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black text-sm font-bold">1</span>
                    </div>
                    <p>Roll the dice and test your luck!</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#f0b90b] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black text-sm font-bold">2</span>
                    </div>
                    <p>Land on 6 to win <span className="text-white font-bold">+{pointsPerClick} Dogecoin</span>!</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#f0b90b] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black text-sm font-bold">3</span>
                    </div>
                    <p>Watch your balance grow with each lucky roll!</p>
                  </div>
                </div>
              </div>

              {/* Live Payouts button - Replacing Energy Display */}
              <div className="px-4 mt-6">
                <button
                  onClick={() => {
                    triggerHapticFeedback(window);
                    setCurrentView('airdrop');
                    localStorage.setItem('scrollToTransactions', 'true');
                  }}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#f3ba2f] rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold">Live Payouts</p>
                        <p className="text-white/60 text-sm">Check your recent transactions</p>
                      </div>
                    </div>
                    <div className="text-[#f3ba2f]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-bounce text-6xl">🎉</div>
          <div className="absolute text-4xl font-bold text-white animate-float">
            +{pointsPerClick} Dogecoin
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 2s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .filter.drop-shadow-glow-yellow {
          filter: drop-shadow(0 0 8px rgba(242, 169, 0, 0.3));
        }
        .top-glow {
          box-shadow: 0 -10px 30px -5px rgba(242, 169, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

// Helper function to get dice dots positions
function getDiceDots(value: number): number[] {
  const dotsMap: { [key: number]: number[] } = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  return dotsMap[value] || [];
}