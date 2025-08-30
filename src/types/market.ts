export type MarketStatus = "open" | "closed" | "resolved";

export type BetSide = "yes" | "no";

export interface Bet {
  id: string;
  userId: string;
  marketId: string;
  amount: number; // S (Sonic) cinsinden
  fee: number; // Bet fee in S tokens
  totalAmount: number; // Total amount including fee
  side: BetSide;
  timestamp: number;
  signature?: string; // MetaMask signature
  message?: string; // Signed message
  treasuryTxHash?: string; // Transaction hash for treasury payment
}

export interface Market {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: number;
  closesAt: number;
  initialPool: number; // Market açılışında eklenen S (Sonic)
  minBet: number;
  maxBet: number;
  status: MarketStatus;
  bets: Bet[];
  result?: BetSide; // Oracle sonucu
  txHash?: string; // Sonic testnet contract transaction hash
} 