import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Market, Bet, BetSide } from "@/types/market";
import { sonicSeedMarkets } from "@/constants/seedMarkets";
import { RootState } from './index';

// Demo verileri kaldırıldı, başlangıç boş
const initialMarkets: Market[] = [];

interface ClaimableReward {
  userId: string;
  marketId: string;
  amount: number;
  claimed: boolean;
}

interface MarketsState {
  markets: Market[];
  claimableRewards: ClaimableReward[];
  userSonicScore: Record<string, number>;
}

// User bets'i localStorage'dan yükle
function loadUserBetsFromStorage(): Record<string, Bet[]> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('sonic_user_bets');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded user bets from storage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load user bets from storage:', error);
  }
  
  return {};
}

// User bets'i localStorage'a kaydet
function saveUserBetsToStorage(userBets: Record<string, Bet[]>) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('sonic_user_bets', JSON.stringify(userBets));
    console.log('User bets saved to storage:', userBets);
  } catch (error) {
    console.warn('Failed to save user bets to storage:', error);
  }
}

// Markets'leri localStorage'dan yükle
function loadMarketsFromStorage(): Market[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('sonic_markets');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded markets from storage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load markets from storage:', error);
  }
  
  return [];
}

// Markets'leri localStorage'a kaydet
function saveMarketsToStorage(markets: Market[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('sonic_markets', JSON.stringify(markets));
    console.log('Markets saved to storage:', markets);
  } catch (error) {
    console.warn('Failed to save markets to storage:', error);
  }
}

// Initial markets'i yükle (localStorage'dan veya seed'den)
function getInitialMarkets(): Market[] {
  // Önce localStorage'dan yüklemeyi dene
  const storedMarkets = loadMarketsFromStorage();
  
  if (storedMarkets && storedMarkets.length > 0) {
    console.log('Using stored markets from localStorage');
    return storedMarkets;
  }
  
  console.log('No stored markets found, using seed markets');
  
  // Seed markets'i kullan ve localStorage'a kaydet
  const seedMarketsWithBets = sonicSeedMarkets.map(market => ({
    ...market,
    bets: [] // Başlangıçta boş bets array
  }));
  
  saveMarketsToStorage(seedMarketsWithBets);
  console.log('Seed markets saved to localStorage');
  
  return seedMarketsWithBets;
}

const initialState: MarketsState = {
  markets: getInitialMarkets(),
  claimableRewards: [],
  userSonicScore: {
    // Demo kullanıcılar için temsili Sonic puanları
    "user1": 85,
    "user2": 120,
    "user3": 65,
    "user4": 95,
    "user5": 150,
    "user6": 75,
    "user7": 110,
    "user8": 45,
  },
};

const marketsSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {
    addMarket(state, action: PayloadAction<Market>) {
      state.markets = [action.payload, ...state.markets];
      saveMarketsToStorage(state.markets);
    },
    setMarkets(state, action: PayloadAction<Market[]>) {
      state.markets = action.payload;
      saveMarketsToStorage(state.markets);
    },
    addBet(state, action: PayloadAction<Bet>) {
      console.log('=== addBet Reducer Debug ===');
      console.log('Adding bet:', action.payload);
      console.log('Current markets:', state.markets);
      
      const market = state.markets.find(m => m.id === action.payload.marketId);
      console.log('Found market:', market);
      
      if (market) {
        market.bets = [...market.bets, action.payload];
        console.log('Updated market bets:', market.bets);
        saveMarketsToStorage(state.markets);
        console.log('Markets saved to storage');
        
        // User bets'i ayrıca sakla
        const userBets = loadUserBetsFromStorage();
        console.log('Current userBets from storage:', userBets);
        
        if (!userBets[action.payload.userId]) {
          userBets[action.payload.userId] = [];
          console.log('Created new user array for:', action.payload.userId);
        }
        
        userBets[action.payload.userId].push(action.payload);
        console.log('Added bet to user bets:', userBets[action.payload.userId]);
        
        saveUserBetsToStorage(userBets);
        console.log('User bets saved to storage');
        console.log('=== End addBet Reducer Debug ===');
      } else {
        console.error('Market not found for bet:', action.payload.marketId);
      }
    },
    closeMarket(state, action: PayloadAction<{ marketId: string; result: BetSide }>) {
      const market = state.markets.find(m => m.id === action.payload.marketId);
      if (market) {
        market.status = "resolved";
        market.result = action.payload.result;
        saveMarketsToStorage(state.markets);
        
        // User bets'i güncelle
        const userBets = loadUserBetsFromStorage();
        Object.keys(userBets).forEach(userId => {
          userBets[userId] = userBets[userId].map((bet: any) => {
            if (bet.marketId === action.payload.marketId) {
              return { ...bet, marketStatus: 'resolved', marketResult: action.payload.result };
            }
            return bet;
          });
        });
        saveUserBetsToStorage(userBets);
        
        // Payout hesapla
        const totalPool = market.initialPool + market.bets.reduce((sum, b) => sum + b.amount, 0);
        const winners = market.bets.filter(b => b.side === action.payload.result);
        const totalWinnerBet = winners.reduce((sum, b) => sum + b.amount, 0);
        if (totalWinnerBet > 0) {
          winners.forEach(bet => {
            const pay = (bet.amount / totalWinnerBet) * totalPool;
            state.claimableRewards.push({
              userId: bet.userId,
              marketId: market.id,
              amount: pay,
              claimed: false
            });
            // Sonic puanını güncelle (ör: +10 her kazanç için)
            if (!state.userSonicScore[bet.userId]) state.userSonicScore[bet.userId] = 0;
            state.userSonicScore[bet.userId] += 10;
          });
        }
      }
    },
    claimReward(state, action: PayloadAction<{ userId: string; marketId: string }>) {
      const reward = state.claimableRewards.find(r => r.userId === action.payload.userId && r.marketId === action.payload.marketId && !r.claimed);
      if (reward) {
        reward.claimed = true;
      }
    },
    setUserSonicScore(state, action: PayloadAction<{ address: string; score: number }>) {
      state.userSonicScore[action.payload.address] = action.payload.score;
    },
    refreshMarkets(state) {
      // Seed markets'i yeniden yükle
      const seedMarkets = sonicSeedMarkets.map((m) => {
        return { ...m, bets: [] } as any;
      });
      
      // Mevcut bet'leri koru
      const marketsWithBets = seedMarkets.map((seedMarket) => {
        const existingMarket = state.markets.find((s) => s.id === seedMarket.id);
        if (existingMarket && existingMarket.bets) {
          return { ...seedMarket, bets: existingMarket.bets };
        }
        return seedMarket;
      });
      
      state.markets = marketsWithBets;
      saveMarketsToStorage(marketsWithBets);
    }
  }
});

export const { addMarket, addBet, closeMarket, claimReward, setUserSonicScore, refreshMarkets } = marketsSlice.actions;

export default marketsSlice.reducer;
export type { ClaimableReward }; 