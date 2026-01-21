export interface Trade {
  id: string;
  date: string;
  ticker: string;
  action: 'Buy' | 'Sell';
  price: number;
  quantity: number;
  pnl: number;
  confidence: number;
  behaviorTag: string;
  note: string;
  context: {
    currentPrice: number;
    rsi: number;
    sma20: number;
    sma50: number;
    volatility: number;
    sentiment: string;
  };
}

export const behaviorTags = {
  buy: [
    '모멘텀 추종자',
    '트렌드 지속',
    '하락 매수자',
    '회복 희망',
    '뉴스 반응',
    '정책/공시 반응',
    '펀더멘털 신봉자',
    '보고서 기반',
    '복수 거래자',
    '평균 단가 낮추기',
    '군중 추종자',
    '실적 플레이'
  ],
  sell: [
    '목표 달성자',
    '빠른 이익 실현',
    '공황 매도자',
    '지연된 손절',
    '트렌드 브레이크 감지',
    '모멘텀 페이더',
    '불안 탈출',
    '후회 회피'
  ]
};

export const mockTrades = [
  {
    id: '1',
    date: '2024-01-15',
    ticker: 'AAPL',
    action: 'Buy' as const,
    price: 185.50,
    quantity: 10,
    pnl: 8.2,
    confidence: 85,
    behaviorTag: '모멘텀 추종자',
    note: '강한 실적 보고서와 애널리스트 업그레이드 후 매수',
    context: {
      currentPrice: 200.71,
      rsi: 72.5,
      sma20: 182.30,
      sma50: 178.90,
      volatility: 0.28,
      sentiment: '긍정적'
    }
  },
  {
    id: '2',
    date: '2024-01-20',
    ticker: 'TSLA',
    action: 'Sell' as const,
    price: 210.00,
    quantity: 5,
    pnl: -3.5,
    confidence: 60,
    behaviorTag: '공황 매도자',
    note: '시장 변동성과 EV 경쟁 우려로 매도',
    context: {
      currentPrice: 202.65,
      rsi: 45.2,
      sma20: 215.80,
      sma50: 220.15,
      volatility: 0.42,
      sentiment: '부정적'
    }
  },
  {
    id: '3',
    date: '2024-01-25',
    ticker: 'MSFT',
    action: 'Buy' as const,
    price: 405.20,
    quantity: 3,
    pnl: 12.1,
    confidence: 90,
    behaviorTag: '펀더멘털 신봉자',
    note: 'AI 성장과 클라우드 확장에 대한 강한 믿음',
    context: {
      currentPrice: 454.23,
      rsi: 68.8,
      sma20: 398.50,
      sma50: 385.20,
      volatility: 0.22,
      sentiment: '매우 긍정적'
    }
  },
  {
    id: '4',
    date: '2024-02-01',
    ticker: 'NVDA',
    action: 'Buy' as const,
    price: 615.75,
    quantity: 2,
    pnl: 15.8,
    confidence: 95,
    behaviorTag: '실적 플레이',
    note: 'AI 칩 수요 급증과 실적 발표 전 매수',
    context: {
      currentPrice: 712.89,
      rsi: 78.3,
      sma20: 605.40,
      sma50: 580.25,
      volatility: 0.35,
      sentiment: '매우 긍정적'
    }
  },
  {
    id: '5',
    date: '2024-02-05',
    ticker: 'GOOGL',
    action: 'Sell' as const,
    price: 142.80,
    quantity: 8,
    pnl: 5.7,
    confidence: 70,
    behaviorTag: '목표 달성자',
    note: '목표 가격 도달 후 이익 실현',
    context: {
      currentPrice: 150.95,
      rsi: 65.1,
      sma20: 140.25,
      sma50: 135.80,
      volatility: 0.25,
      sentiment: '긍정적'
    }
  },
  {
    id: '6',
    date: '2024-02-10',
    ticker: 'AMD',
    action: 'Buy' as const,
    price: 185.30,
    quantity: 6,
    pnl: -2.8,
    confidence: 65,
    behaviorTag: '하락 매수자',
    note: '최근 하락 후 반등 기대하며 매수',
    context: {
      currentPrice: 180.12,
      rsi: 42.7,
      sma20: 188.90,
      sma50: 195.40,
      volatility: 0.38,
      sentiment: '중립적'
    }
  }
];
