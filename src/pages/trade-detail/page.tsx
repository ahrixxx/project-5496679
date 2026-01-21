
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { mockTrades } from '../../mocks/trades';
import MarketOverview from './components/MarketOverview';
import DecisionProcess from './components/DecisionProcess';
import LinkedTradesSection from './components/LinkedTradesSection';

interface Trade {
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
  linkedTradeIds?: string[];
  averagePurchasePrice?: number;
  remainingShares?: number;
}

export default function TradeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [linkedTrades, setLinkedTrades] = useState<Trade[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');

  useEffect(() => {
    if (id) {
      const foundTrade = mockTrades.find(t => t.id === id);
      if (foundTrade) {
        setTrade(foundTrade);
        
        // Mock linked trades for sell actions
        if (foundTrade.action === 'Sell') {
          const mockLinkedTrades = mockTrades.filter(t => 
            t.ticker === foundTrade.ticker && 
            t.action === 'Buy' && 
            new Date(t.date) < new Date(foundTrade.date)
          ).slice(0, 2);
          setLinkedTrades(mockLinkedTrades);
        }
      }
    }
  }, [id]);

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">거래를 찾을 수 없습니다</h2>
            <Button onClick={() => navigate('/')} className="mt-4">
              거래 일지로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (currency === 'KRW') {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(value * 1320);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getCompanyName = (ticker: string) => {
    const companies: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'MSFT': 'Microsoft Corporation',
      'NVDA': 'NVIDIA Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMD': 'Advanced Micro Devices'
    };
    return companies[ticker] || ticker;
  };

  const calculatePnLAmount = () => {
    const totalValue = trade.price * trade.quantity;
    return (totalValue * trade.pnl) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 bg-white border border-gray-300"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            거래 일지로 돌아가기
          </Button>
        </div>

        {/* 1️⃣ Sticky Trade Summary Header */}
        <div className="sticky top-0 z-10 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">{trade.ticker.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {trade.ticker} ({getCompanyName(trade.ticker)})
                  </h1>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mr-3 ${
                      trade.action === 'Buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.action === 'Buy' ? '🟢' : '🔴'} {trade.action === 'Buy' ? '매수' : '매도'}
                    </span>
                    <span className="text-gray-600 text-sm">{trade.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">수량 및 가격</p>
                  <p className="font-semibold text-gray-900">
                    {trade.quantity}주 @ {formatCurrency(trade.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">손익</p>
                  <p className={`font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(trade.pnl)} ({formatCurrency(calculatePnLAmount())})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">신뢰도</p>
                  <p className="font-semibold text-blue-600">{trade.confidence}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">행동</p>
                  <p className="font-semibold text-gray-900">{trade.behaviorTag}</p>
                </div>
                {trade.action === 'Sell' && linkedTrades.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">연결된 거래</p>
                    <p className="text-xs text-blue-600">
                      🔗 {linkedTrades.length}개 매수 연결됨
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Linked Trades Section */}
        {trade.action === 'Sell' && linkedTrades.length > 0 && (
          <LinkedTradesSection 
            linkedTrades={linkedTrades}
            currentTrade={trade}
            formatCurrency={formatCurrency}
          />
        )}

        {/* 2️⃣ Decision Process - Main Learning Hub (Above the fold) */}
        <DecisionProcess trade={trade} />

        {/* 3️⃣ Market Overview - Supporting Context */}
        <MarketOverview trade={trade} />

        {/* 4️⃣ AI Chat Reflection - Learning Closure */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <i className="ri-robot-line text-purple-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">
                🤖 AI 채팅 회고
              </h3>
              <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Q: "{trade.ticker}가 실적 발표 후 오를까요?"</p>
                  <p className="text-sm text-gray-800 leading-relaxed">A: "역사적으로 {trade.ticker}는 강한 펀더멘털과 함께 실적 발표 후 3-5% 상승합니다. 현재 RSI {trade.context.rsi}는 모멘텀을 시사하지만, 차익 실현에 주의하세요."</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-purple-600 font-medium">📚 참조된 학습 (과거 질문에서)</p>
                  <p className="text-xs text-gray-500 mt-1">이 거래 2일 전 질문 • 의사결정 과정에서 사용됨</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
