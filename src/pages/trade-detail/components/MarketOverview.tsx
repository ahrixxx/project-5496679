
import { useState } from 'react';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

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
}

interface MarketOverviewProps {
  trade: Trade;
}

export default function MarketOverview({ trade }: MarketOverviewProps) {
  const [activeIndicators, setActiveIndicators] = useState({
    rsi: true,
    sma20: true,
    sma50: false,
    volatility: false
  });
  const [showCurrentPrice, setShowCurrentPrice] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');

  const toggleIndicator = (indicator: keyof typeof activeIndicators) => {
    setActiveIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  // Mock chart data - in real app this would come from API
  const generateMockChartData = () => {
    const basePrice = trade.price;
    const data = [];
    
    // Generate 28 days of data (14 before, trade day, 13 after)
    for (let i = -14; i <= 13; i++) {
      const date = new Date(trade.date);
      date.setDate(date.getDate() + i);
      
      // Create realistic price movement
      const randomFactor = (Math.random() - 0.5) * 0.1;
      const trendFactor = i * 0.002; // Slight upward trend
      const price = basePrice * (1 + randomFactor + trendFactor);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: price,
        isTradeDay: i === 0
      });
    }
    
    return data;
  };

  const chartData = generateMockChartData();
  const currentPrice = trade.context.currentPrice * 1.05; // Mock current price

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

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { label: '과매수', color: 'text-red-600', icon: 'ri-arrow-up-circle-line' };
    if (rsi < 30) return { label: '과매도', color: 'text-green-600', icon: 'ri-arrow-down-circle-line' };
    return { label: '중립', color: 'text-gray-600', icon: 'ri-subtract-line' };
  };

  const getVolatilityLevel = (volatility: number) => {
    if (volatility > 35) return { label: '높음', color: 'bg-red-100 text-red-800' };
    if (volatility > 20) return { label: '보통', color: 'bg-yellow-100 text-yellow-800' };
    return { label: '낮음', color: 'bg-green-100 text-green-800' };
  };

  const rsiSignal = getRSISignal(trade.context.rsi);
  const volatilityLevel = getVolatilityLevel(trade.context.volatility);

  return (
    <Card className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <i className="ri-line-chart-line text-blue-600 text-lg"></i>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">시장 개요</h2>
        <div className="ml-auto flex items-center space-x-3">
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'KRW' : 'USD')}
            className="flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-exchange-line mr-2"></i>
            {currency}
          </button>
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
            지원 맥락
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          {/* Chart Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={() => setShowCurrentPrice(!showCurrentPrice)}
              className={`text-sm transition-all duration-300 ${showCurrentPrice ? 'bg-yellow-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <i className="ri-exchange-line mr-2"></i>
              현재 vs 당시 비교
            </Button>
            <Button
              onClick={() => toggleIndicator('rsi')}
              className={`text-xs transition-all duration-300 ${activeIndicators.rsi ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              RSI ({trade.context.rsi})
            </Button>
            <Button
              onClick={() => toggleIndicator('sma20')}
              className={`text-xs transition-all duration-300 ${activeIndicators.sma20 ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              SMA(20)
            </Button>
            <Button
              onClick={() => toggleIndicator('sma50')}
              className={`text-xs transition-all duration-300 ${activeIndicators.sma50 ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              SMA(50)
            </Button>
            <Button
              onClick={() => toggleIndicator('volatility')}
              className={`text-xs transition-all duration-300 ${activeIndicators.volatility ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              변동성
            </Button>
          </div>

          {/* Chart Area */}
          <div className="relative bg-gray-900 rounded-lg p-6 h-80 overflow-hidden">
            {/* Chart Background Grid */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute w-full border-t border-gray-600" style={{ top: `${i * 20}%` }}></div>
              ))}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="absolute h-full border-l border-gray-600" style={{ left: `${i * 14.28}%` }}></div>
              ))}
            </div>

            {/* Price Line Chart */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Price line */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const minPrice = Math.min(...chartData.map(d => d.price));
                  const maxPrice = Math.max(...chartData.map(d => d.price));
                  const y = 100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 80;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
              
              {/* Trade marker */}
              {chartData.map((point, index) => {
                if (point.isTradeDay) {
                  const x = (index / (chartData.length - 1)) * 100;
                  const minPrice = Math.min(...chartData.map(d => d.price));
                  const maxPrice = Math.max(...chartData.map(d => d.price));
                  const y = 100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 80;
                  
                  return (
                    <g key={index}>
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="8"
                        fill={trade.action === 'Buy' ? '#10B981' : '#EF4444'}
                        stroke="white"
                        strokeWidth="3"
                      />
                      <text
                        x={`${x}%`}
                        y={`${y - 20}%`}
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {trade.action === 'Buy' ? '↑' : '↓'} {trade.action === 'Buy' ? '매수' : '매도'}
                      </text>
                    </g>
                  );
                }
                return null;
              })}

              {/* Current price line (if enabled) */}
              {showCurrentPrice && (
                <line
                  x1="0%"
                  y1="20%"
                  x2="100%"
                  y2="20%"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>

            {/* Price labels */}
            <div className="absolute left-2 top-2 text-white text-sm">
              <div className="mb-1">거래: {formatCurrency(trade.price)}</div>
              {showCurrentPrice && (
                <div className="text-yellow-400">현재: {formatCurrency(currentPrice)}</div>
              )}
            </div>

            {/* Date labels */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-gray-400 text-xs">
              <span>-14일</span>
              <span className="text-white font-medium">거래일</span>
              <span>+13일</span>
            </div>
          </div>

          {/* Technical Indicators */}
          {(activeIndicators.rsi || activeIndicators.sma20 || activeIndicators.sma50) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">활성 지표</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {activeIndicators.rsi && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    <span>RSI: {trade.context.rsi}</span>
                  </div>
                )}
                {activeIndicators.sma20 && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                    <span>SMA(20): {formatCurrency(trade.context.sma20)}</span>
                  </div>
                )}
                {activeIndicators.sma50 && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                    <span>SMA(50): {formatCurrency(trade.context.sma50)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Metrics Panel - Right Side (1/3 width) */}
        <div className="space-y-4">
          {/* RSI Card */}
          <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className={`${rsiSignal.icon} ${rsiSignal.color} mr-2`}></i>
                <span className="text-sm font-medium text-gray-700">RSI</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{trade.context.rsi}</div>
                <div className={`text-xs ${rsiSignal.color}`}>{rsiSignal.label}</div>
              </div>
            </div>
          </div>

          {/* SMA Trend Card */}
          <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="ri-arrow-up-line text-green-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">SMA 추세</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">20: {formatCurrency(trade.context.sma20)}</div>
                <div className="text-sm text-gray-600">50: {formatCurrency(trade.context.sma50)}</div>
                <div className="text-xs text-green-600">상승</div>
              </div>
            </div>
          </div>

          {/* Volatility Card */}
          <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="ri-pulse-line text-purple-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">변동성</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{trade.context.volatility}%</div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${volatilityLevel.color}`}>
                  {volatilityLevel.label}
                </span>
              </div>
            </div>
          </div>

          {/* News Sentiment Card */}
          <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <i className="ri-news-line text-blue-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">뉴스 감정</span>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                긍정적
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>부정적</span>
                <span>긍정적</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600 mb-2">주요 주제:</p>
              <div className="flex flex-wrap gap-1">
                <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">실적</span>
                <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">아이폰 출시</span>
                <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">서비스 성장</span>
              </div>
            </div>
          </div>

          {/* Context Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <i className="ri-lightbulb-line text-blue-600 mr-2 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">상황 요약</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  거래 당시 {trade.ticker}는 {volatilityLevel.label} 변동성과 함께 상승세를 보였습니다. 
                  RSI는 {rsiSignal.label} 상태를 나타냈습니다. 시장 감정은 강한 실적 기대와 함께 긍정적이었습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
