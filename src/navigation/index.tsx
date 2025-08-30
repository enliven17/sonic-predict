"use client";
import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

import { FaSearch, FaBrain, FaCoins } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export function MainNav() {
  const pathname = usePathname();
  const { address: connectedAddress } = useWalletConnection();

  const sonicScore = useSelector((state: RootState) => {
    if (!connectedAddress) return 0;
    const reduxScore = state.markets.userSonicScore[connectedAddress];
    if (reduxScore !== undefined) return reduxScore;
    // Redux'ta yoksa localStorage'dan oku
    if (typeof window !== 'undefined') {
      const localScore = localStorage.getItem(`sonic_score_${connectedAddress}`);
      if (localScore) return Number(localScore);
    }
    return 0;
  });

  return (
    <NavBar>
      <FlexRow>
        <LogoBox>
          <LogoImage src="/sonicpredictlogo.png" alt="Sonic Predict" />
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Sonic Predict</span>
        </LogoBox>
        <NavLinks>
          <NavLink href="/" $active={pathname === "/"}>Markets</NavLink>
          <NavLink href="/user-bets" $active={pathname === "/user-bets"}>My Bets</NavLink>
        </NavLinks>
        <SearchBox>
          <FaSearch style={{ color: '#aaa', fontSize: 16, marginRight: 8 }} />
          <SearchInput placeholder="Search markets..." />
        </SearchBox>
        <SonicScoreBox title="Sonic Score: Prediction Intelligence">
          <FaBrain style={{marginRight: 6, color: '#7f5af0', fontSize: 18}} />
          <SonicScoreValue>{sonicScore}</SonicScoreValue>
        </SonicScoreBox>

        <WalletBox>
          <ConnectWalletButton />
        </WalletBox>
      </FlexRow>
    </NavBar>
  );
}

const NavBar = styled.nav`
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  padding: 0 32px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 2px solid rgba(127, 90, 240, 0.3);
  font-size: 1.1rem;
  font-weight: 600;
  width: 100vw;
  box-sizing: border-box;
  z-index: 100;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  @media (max-width: 1100px) {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 6px;
    gap: 8px;
  }
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  justify-content: space-between;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  filter: drop-shadow(0 2px 8px rgba(127, 90, 240, 0.3));
  transition: all 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 4px 16px rgba(127, 90, 240, 0.5));
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  @media (max-width: 1100px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 18px;
    margin-bottom: 8px;
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 0 0 auto;
  font-size: 1.2em;
  padding: 8px 18px 8px 0;
  border-radius: 16px;
  background: rgba(127, 90, 240, 0.1);
  border: 1px solid rgba(127, 90, 240, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(127, 90, 240, 0.15);
    border-color: rgba(127, 90, 240, 0.4);
    transform: translateY(-1px);
  }
  
  @media (max-width: 1100px) {
    justify-content: center;
    width: 100%;
    margin-bottom: 2px;
    padding: 6px 0;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 6px 16px 6px 12px;
  min-width: 220px;
  max-width: 320px;
  margin: 0 24px;
  flex: 0 0 320px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(127, 90, 240, 0.3);
    box-shadow: 0 6px 24px rgba(127, 90, 240, 0.2);
  }
  
  @media (max-width: 1100px) {
    margin: 8px 0;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    flex: 1 1 100%;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  color: #FFFFFF;
  font-size: 1.08rem;
  padding: 4px 0;
  width: 100%;
  &::placeholder {
    color: #A1A1AA;
    opacity: 0.7;
  }
`;

const WalletBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(127, 90, 240, 0.3);
  padding: 6px 12px;
  max-width: 400px;
  min-width: 280px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(127, 90, 240, 0.5);
    box-shadow: 0 6px 24px rgba(127, 90, 240, 0.3);
  }
  
  @media (max-width: 1100px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 4px;
    padding: 8px 8px;
    max-width: 100%;
    min-width: auto;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active }) => $active ? '#7F5AF0' : '#A1A1AA'};
  font-weight: ${({ $active }) => $active ? "bold" : "normal"};
  text-decoration: none;
  font-size: 20px;
  padding: 8px 18px 4px 18px;
  border-radius: 12px;
  position: relative;
  background: ${({ $active }) => $active ? 'rgba(127, 90, 240, 0.1)' : 'transparent'};
  box-shadow: ${({ $active }) => $active ? '0 4px 18px rgba(127, 90, 240, 0.2)' : 'none'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &::after {
    content: '';
    display: ${({ $active }) => $active ? 'block' : 'none'};
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 2px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, #7F5AF0 0%, #2CB67D 100%);
    box-shadow: 0 2px 8px rgba(127, 90, 240, 0.4);
    opacity: 0.85;
  }
  
  &:hover {
    color: #7F5AF0;
    background: ${({ $active }) => $active ? 'rgba(127, 90, 240, 0.15)' : 'rgba(127, 90, 240, 0.1)'};
    box-shadow: ${({ $active }) => $active ? '0 8px 32px rgba(127, 90, 240, 0.3)' : '0 4px 16px rgba(127, 90, 240, 0.2)'};
    padding: 8px 22px 4px 22px;
    transform: translateY(-1px);
  }
  
  @media (max-width: 1100px) {
    font-size: 17px;
    padding: 6px 10px 2px 10px;
  }
`;

const SonicScoreBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(127, 90, 240, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(127, 90, 240, 0.2);
  padding: 6px 14px;
  margin: 0 10px 0 0;
  font-size: 1.08rem;
  font-weight: 600;
  color: #7F5AF0;
  min-width: 60px;
  height: 38px;
  border: 1px solid rgba(127, 90, 240, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(127, 90, 240, 0.15);
    box-shadow: 0 6px 24px rgba(127, 90, 240, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 800px) {
    padding: 4px 8px;
    font-size: 0.98rem;
    height: 32px;
  }
`;

const SonicScoreValue = styled.span`
  font-weight: 700;
  color: #7F5AF0;
  font-size: 1.08em;
  text-shadow: 0 1px 2px rgba(127, 90, 240, 0.3);
  min-width: 30px;
  text-align: center;
`;

const BalanceBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(44, 182, 125, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(44, 182, 125, 0.2);
  padding: 6px 14px;
  margin: 0 10px 0 0;
  font-size: 1.08rem;
  font-weight: 600;
  color: #2CB67D;
  min-width: 60px;
  height: 38px;
  border: 1px solid rgba(44, 182, 125, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(44, 182, 125, 0.15);
    box-shadow: 0 6px 24px rgba(44, 182, 125, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 800px) {
    padding: 4px 8px;
    font-size: 0.98rem;
    height: 32px;
  }
`;

const BalanceValue = styled.span`
  font-weight: 700;
  color: #2CB67D;
  font-size: 1.08em;
  text-shadow: 0 1px 2px rgba(44, 182, 125, 0.3);
  min-width: 30px;
  text-align: center;
`;