import { client } from './client';
import type { Trade } from '../mocks/trades'; 
import { mockTrades } from '../mocks/trades';

// 브라우저 비밀 금고의 열쇠 이름
const STORAGE_KEY = 'my_stock_trades';

/**
 * 1. 매매일지 목록 가져오기 (Read)
 */
export const fetchTrades = async () => {
  // ---------------------------------------------------------
  // [나중에 서버 생기면]: 아래 주석을 풀고, 밑에 [임시 코드]는 지우세요.
  /*
  const response = await client.get<Trade[]>('/trades');
  return response.data;
  */
  // ---------------------------------------------------------

  // [임시 코드]: 서버 없을 때 Local Storage 사용
  await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 0.5초 흉내

  const savedData = localStorage.getItem(STORAGE_KEY);

  // 저장된 게 있으면 그거 주고, 없으면 기본(mock) 데이터 줌
  if (savedData) {
    return JSON.parse(savedData) as Trade[];
  } else {
    // 처음 실행하면 mockTrades가 보임
    return mockTrades;
  }
};

/**
 * 2. 새 거래 기록하기 (Create)
 */
export const createTrade = async (newTrade: Trade) => {
  // ---------------------------------------------------------
  // [나중에 서버 생기면]: 아래 주석을 풀고, 밑에 [임시 코드]는 지우세요.
  /*
  const response = await client.post<Trade>('/trades', newTrade);
  return response.data;
  */
  // ---------------------------------------------------------

  // [임시 코드]: 서버 없을 때 Local Storage에 저장
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 1. 현재 저장된 데이터를 가져옴 (없으면 mockData가 기준이 됨)
  const savedData = localStorage.getItem(STORAGE_KEY);
  const currentTrades = savedData ? JSON.parse(savedData) : mockTrades;

  // 2. 새 거래 데이터 완성 (ID가 없으면 시간으로 생성)
  const tradeToSave = { 
    ...newTrade, 
    id: newTrade.id || Date.now().toString() 
  };

  // 3. [중요] 새 거래를 '맨 앞'에 붙임 (New + [기존 데이터])
  // 이렇게 하면 새 거래가 항상 테이블 맨 위에 뜹니다!
  const updatedTrades = [tradeToSave, ...currentTrades];

  // 4. 금고에 다시 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));

  return tradeToSave;
};