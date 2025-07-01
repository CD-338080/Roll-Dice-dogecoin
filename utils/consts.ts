// utils/consts.ts

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

import { crystal1, crystal2, crystal3, crystal4, crystal5, crystal6, crystal7, crystal8, crystal9, mainCharacter } from "@/images";
import { StaticImageData } from "next/image";

export const ALLOW_ALL_DEVICES = true;

export const WALLET_MANIFEST_URL = "https://violet-traditional-rabbit-103.mypinata.cloud/ipfs/QmcFgnfXoiNtp8dvy25xA9hMEjz5AzugTuPQNTHQMTw9Tf";

export interface LevelData {
  name: string;
  minPoints: number;
  bigImage: StaticImageData;
  smallImage: StaticImageData;
  color: string;
  friendBonus: number;
  friendBonusPremium: number;
}

export const LEVELS: LevelData[] = [
  {
    name: "Doge Pup",
    minPoints: 0,
    bigImage: mainCharacter,
    smallImage: crystal1,
    color: "#F2A900", // Dogecoin gold
    friendBonus: 0,
    friendBonusPremium: 0,
  },
  {
    name: "Shibe Starter",
    minPoints: 100,
    bigImage: mainCharacter,
    smallImage: crystal2,
    color: "#FFD166", // Light gold
    friendBonus: 5,
    friendBonusPremium: 10,
  },
  {
    name: "Meme Miner",
    minPoints: 500,
    bigImage: mainCharacter,
    smallImage: crystal3,
    color: "#CB8D00", // Dark gold
    friendBonus: 10,
    friendBonusPremium: 20,
  },
  {
    name: "Dogecoin Devotee",
    minPoints: 1000,
    bigImage: mainCharacter,
    smallImage: crystal4,
    color: "#F2A900", // Dogecoin gold
    friendBonus: 15,
    friendBonusPremium: 30,
  },
  {
    name: "To The Moon Traveler",
    minPoints: 5000,
    bigImage: mainCharacter,
    smallImage: crystal5,
    color: "#FFD166", // Light gold
    friendBonus: 25,
    friendBonusPremium: 50,
  },
  {
    name: "Doge Strategist",
    minPoints: 10000,
    bigImage: mainCharacter,
    smallImage: crystal6,
    color: "#CB8D00", // Dark gold
    friendBonus: 50,
    friendBonusPremium: 100,
  },
  {
    name: "Wow Master",
    minPoints: 25000,
    bigImage: mainCharacter,
    smallImage: crystal7,
    color: "#F2A900", // Dogecoin gold
    friendBonus: 100,
    friendBonusPremium: 200,
  },
  {
    name: "Much Rich Shibe",
    minPoints: 50000,
    bigImage: mainCharacter,
    smallImage: crystal8,
    color: "#FFD166", // Light gold
    friendBonus: 200,
    friendBonusPremium: 400,
  },
  {
    name: "Dogecoin Whale",
    minPoints: 100000,
    bigImage: mainCharacter,
    smallImage: crystal9,
    color: "#CB8D00", // Dark gold
    friendBonus: 500,
    friendBonusPremium: 1000,
  }
];

export const DAILY_REWARDS = [
  5,
  10,
  15,
  25,
  50,
  75,
  100,
  200,
  500,
  1000
];

export const MAXIMUM_INACTIVE_TIME_FOR_MINE = 24*60*60*1000; // 24 hours in milliseconds

export const MAX_ENERGY_REFILLS_PER_DAY = 4;
export const ENERGY_REFILL_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
export const TASK_WAIT_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export const REFERRAL_BONUS_BASE = 85;
export const REFERRAL_BONUS_PREMIUM = 120;


// Multitap
export const multitapUpgradeBasePrice = 50;
export const multitapUpgradeCostCoefficient = 1.5;

export const multitapUpgradeBaseBenefit = 1;
export const multitapUpgradeBenefitCoefficient = 1;

// Energy
export const energyUpgradeBasePrice = 75;
export const energyUpgradeCostCoefficient = 1.5;

export const energyUpgradeBaseBenefit = 25;
export const energyUpgradeBenefitCoefficient = 1.2;

// Mine (profit per hour)
export const mineUpgradeBasePrice = 100;
export const mineUpgradeCostCoefficient = 1.3;

export const mineUpgradeBaseBenefit = 5;
export const mineUpgradeBenefitCoefficient = 1.1;