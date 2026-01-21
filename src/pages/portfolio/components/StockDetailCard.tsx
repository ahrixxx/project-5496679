import { useState } from 'react';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  ownedQuantity?: number;
  totalValue?: number;
  sector: string;
  chartData: number[];
  marketCap: string;
  peRatio: number;
  weekRange52: { low: number; high: number };
  isWatching: boolean;
}

interface StockDetailCardProps {
  stock: Stock;
  formatCurrency: (value: number) => string;
  onClose: () => void;
}

export default function StockDetailCard({ stock, formatCurrency, onClose }: StockDetailCardProps) {
  const [activeIndicator, setActiveIndicator] = useState<string>('price');
  const [showComparison, setShowComparison] = useState(false);

  const isPositive = stock.dailyChange >= 0;

  // Mock chart data for 30 days
  const generateChartData = () => {
    const basePrice = stock.currentPrice;
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 20;
      data.push(basePrice + variation);
    }
    data[data.length - 1] = stock.currentPrice;
    return data;
  };

  const chartData = generateChartData();

  const PriceChart = () => {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;
    
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = range > 0 ? ((max - value) / range) * 100 : 50;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-64 relative bg-gray-50 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <polyline
            fill="url(#chartGradient)"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="2"
            points={`0,100 ${points} 100,100`}
          />
          <polyline
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="3"
            points={points}
          />
          {/* Trade marker at the end */}
          <circle
            cx="100"
            cy={range > 0 ? ((max - stock.currentPrice) / range) * 100 : 50}
            r="3"
            fill={isPositive ? "#22c55e" : "#ef4444"}
          />
        </svg>
        
        {/* Chart controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {['price', 'rsi', 'sma', 'volume'].map((indicator) => (
            <button
              key={indicator}
              onClick={() => setActiveIndicator(indicator)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeIndicator === indicator
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {indicator === 'price' && '가격'}
              {indicator === 'rsi' && 'RSI'}
              {indicator === 'sma' && 'SMA'}
              {indicator === 'volume' && '거래량'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Mock AI analysis
  const aiAnalysis = {
    trend: "상승 추세",
    confidence: 73,
    summary: "RSI가 65로 상승하며 모멘텀이 강화되고 있습니다. SMA(20) > SMA(60)으로 완만한 상승 추세를 나타냅니다.",
    signals: ["기술적 지표 긍정적", "거래량 증가", "지지선 돌파"]
  };

  // Mock news data
  const newsData = [
    {
      headline: "애플, 차세대 iPhone에 AI 기능 확대 예정",
      summary: "하드웨어 수요에 긍정적 영향 예상",
      sentiment: "positive"
    },
    {
      headline: "3분기 실적 발표 앞두고 시장 관심 집중",
      summary: "애널리스트들 긍정적 전망 유지",
      sentiment: "positive"
    },
    {
      headline: "공급망 이슈로 일부 제품 출시 지연 우려",
      summary: "단기적 영향은 제한적일 것으로 분석",
      sentiment: "neutral"
    }
  ];

  return (
    <Card className="mt-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold">{stock.ticker} 상세 정보</h2>
          <p className="text-gray-600">{stock.companyName}</p>
        </div>
        <Button
          onClick={onClose}
          className="bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <i className="ri-close-line"></i>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Price Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">30일 가격 차트</h3>
            <Button
              onClick={() => setShowComparison(!showComparison)}
              className={`text-sm ${showComparison ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              현재 vs 과거 비교
            </Button>
          </div>
          <PriceChart />
        </div>

        {/* Right: Key Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">주요 지표</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">현재가</span>
              <span className="font-semibold">{formatCurrency(stock.currentPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">일일 변동</span>
              <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stock.dailyChangePercent.toFixed(2)}%
              </span>
            </div>
            {stock.totalValue && (
              <div className="flex justify-between">
                <span className="text-gray-600">총 평가액</span>
                <span className="font-semibold">{formatCurrency(stock.totalValue)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">시가총액</span>
              <span className="font-semibold">{stock.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PER</span>
              <span className="font-semibold">{stock.peRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">52주 범위</span>
              <span className="font-semibold text-sm">
                {formatCurrency(stock.weekRange52.low)} - {formatCurrency(stock.weekRange52.high)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Dual Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-0">
        {/* AI Chart Analysis */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-robot-line text-purple-600 text-xl"></i>
            <h4 className="font-semibold text-purple-900">AI 차트 분석</h4>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-700">{aiAnalysis.summary}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">추세 신뢰도</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${aiAnalysis.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-purple-600">{aiAnalysis.confidence}%</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {aiAnalysis.signals.map((signal, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Key News Summary */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-newspaper-line text-blue-600 text-xl"></i>
            <h4 className="font-semibold text-blue-900">주요 뉴스 요약</h4>
          </div>
          
          <div className="space-y-3">
            {newsData.map((news, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3">
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    news.sentiment === 'positive' ? 'bg-green-500' :
                    news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-900 leading-tight">
                      {news.headline}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">{news.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
}