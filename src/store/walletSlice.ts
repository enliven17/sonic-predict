import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chain: "EVM" | null;
  networkId: number | null; // Sonic testnet chain ID: 14601
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chain: null,
  networkId: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet(state, action: PayloadAction<{ address: string; chain: "EVM"; networkId: number }>) {
      state.address = action.payload.address;
      state.isConnected = true;
      state.chain = action.payload.chain;
      state.networkId = action.payload.networkId;
    },
    disconnectWallet(state) {
      state.address = null;
      state.isConnected = false;
      state.chain = null;
      state.networkId = null;
    },
    switchNetwork(state, action: PayloadAction<{ networkId: number }>) {
      state.networkId = action.payload.networkId;
    },
  },
});

export const { connectWallet, disconnectWallet, switchNetwork } = walletSlice.actions;
export default walletSlice.reducer;
export type { WalletState }; 