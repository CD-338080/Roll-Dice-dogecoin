// components/Mine.tsx

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

import { useState } from 'react';
import IceCubes from '@/icons/IceCubes';
import { calculateMineUpgradeCost, calculateProfitPerHour, useGameStore } from '@/utils/game-mechanics';
import Snowflake from '@/icons/Snowflake';
import TopInfoSection from '@/components/TopInfoSection';
import { MAXIMUM_INACTIVE_TIME_FOR_MINE, mineUpgradeBaseBenefit, mineUpgradeBasePrice, mineUpgradeBenefitCoefficient, mineUpgradeCostCoefficient } from '@/utils/consts';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { useToast } from '@/contexts/ToastContext';
import Info from '@/icons/Info';

interface MineProps {
    setCurrentView: (view: string) => void;
}

export default function Mine({ setCurrentView }: MineProps) {
    const showToast = useToast();

    const {
        userTelegramInitData,
        pointsBalance,
        profitPerHour,
        mineLevelIndex,
        upgradeMineLevelIndex
    } = useGameStore();
    const [isLoading, setIsLoading] = useState(false);

    const upgradeCost = calculateMineUpgradeCost(mineLevelIndex);
    const upgradeIncrease = calculateProfitPerHour(mineLevelIndex + 1) - calculateProfitPerHour(mineLevelIndex);

    const maxInactiveHours = MAXIMUM_INACTIVE_TIME_FOR_MINE / (60 * 60 * 1000);

    const handleUpgrade = async () => {
        if (pointsBalance >= upgradeCost && !isLoading) {
            setIsLoading(true);
            try {
                triggerHapticFeedback(window);
                const response = await fetch('/api/upgrade/mine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        initData: userTelegramInitData,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to upgrade mine');
                }

                const result = await response.json();

                console.log("Result from server:", result);

                // Update local state with the new values
                upgradeMineLevelIndex();

                showToast('Mine Upgrade Successful!', 'success');
            } catch (error) {
                console.error('Error upgrading mine:', error);
                showToast('Failed to upgrade mine. Please try again.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-[#FFD166] flex justify-center min-h-screen">
            <div className="w-full bg-[#FFD166] text-white font-bold flex flex-col max-w-xl">
                <TopInfoSection setCurrentView={setCurrentView} />

                <div className="flex-grow mt-4 bg-[#F2A900] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#FFF8E1] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <h1 className="text-2xl text-center mt-4 text-[#F2A900]">Upgrade Dogecoin Mining</h1>

                            <div className="px-4 mt-4 flex justify-center">
                                <div className="px-4 py-2 flex items-center space-x-2">
                                    <IceCubes className="w-12 h-12 mx-auto" />
                                    <p className="text-4xl text-[#F2A900]" suppressHydrationWarning >{Math.floor(pointsBalance).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-[#F2A900]/30 rounded-lg p-4 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[#F2A900]">Current DOGE per hour:</p>
                                    <p className="text-[#CB8D00]">{formatNumber(profitPerHour)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[#F2A900]">Upgrade cost:</p>
                                    <p className="text-[#CB8D00]">{formatNumber(upgradeCost)}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#F2A900]">DOGE per hour increase:</p>
                                    <p className="text-[#CB8D00]">+{formatNumber(upgradeIncrease)}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={pointsBalance < upgradeCost || isLoading}
                                className={`w-full mt-6 py-3 rounded-lg text-center text-[#F2A900] font-bold ${pointsBalance >= upgradeCost && !isLoading ? 'bg-[#CB8D00]' : 'bg-gray-400 cursor-not-allowed'
                                    } relative`}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    'Upgrade'
                                )}
                            </button>

                            <div className="bg-[#F2A900]/30 rounded-lg p-4 mt-6 flex items-start">
                                <Info className="w-6 h-6 text-[#CB8D00] mr-3 flex-shrink-0 mt-1" />
                                <p className="text-sm text-[#F2A900]">
                                    Your mine automatically produces DOGE for up to <span className="font-bold">{maxInactiveHours} hours</span> after your last activity. Make sure to check in regularly to maximize your Dogecoin mining!
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}