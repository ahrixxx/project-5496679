
import { useState } from 'react';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface StockData {
  ticker: string;
  name: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
}

interface StockChartProps {
  stock: StockData;
  formatCurrency: (value: number) => string;
}

export default function StockChart({ stock, formatCurrency }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [showVolume, setShowVolume] = useState(true);
  const [indicators, setIndicators] = useState({
    sma20: false,
    sma50: false,
    rsi: false,
    volume: true
  });

  // Safe currency formatting function
  const safeCurrencyFormat = (value: number) => {
    if (typeof formatCurrency === 'function') {
      return formatCurrency(value);
    }
    // Fallback formatting
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Mock chart data generation
  const generateChartData = () => {
    const days = timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const data = [];
    const basePrice = stock.currentPrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomFactor = (Math.random() - 0.5) * 0.05;
      const trendFactor = (days - i) * 0.001;
      const price = basePrice * (1 + randomFactor + trendFactor);
      
      const volume = Math.floor(Math.random() * 50000000) + 20000000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: price,
        volume: volume,
        high: price * 1.02,
        low: price * 0.98,
        open: price * 0.995,
        close: price
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const minPrice = Math.min(...chartData.map(d => d.low));
  const maxPrice = Math.max(...chartData.map(d => d.high));
  const maxVolume = Math.max(...chartData.map(d => d.volume));

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  return (
    <Card>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
            {stock.ticker} 차트 분석
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setChartType(chartType === 'line' ? 'candle' : 'line')}
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {chartType === 'line' ? '캔들차트' : '라인차트'}
            </Button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-2 mb-4">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-xs ${
                timeframe === tf 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            onClick={() => toggleIndicator('sma20')}
            className={`text-xs ${
              indicators.sma20 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            SMA(20)
          </Button>
          <Button
            onClick={() => toggleIndicator('sma50')}
            className={`text-xs ${
              indicators.sma50 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            SMA(50)
          </Button>
          <Button
            onClick={() => toggleIndicator('rsi')}
            className={`text-xs ${
              indicators.rsi ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            RSI
          </Button>
          <Button
            onClick={() => setShowVolume(!showVolume)}
            className={`text-xs ${
              showVolume ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            거래량
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Price Chart */}
        <div className="bg-gray-900 rounded-lg p-4 h-80 mb-4 relative overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full border-t border-gray-600" style={{ top: `${i * 20}%` }}></div>
            ))}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="absolute h-full border-l border-gray-600" style={{ left: `${i * 14.28}%` }}></div>
            ))}
          </div>

          {/* Price Line/Candles */}
          <svg className="absolute inset-0 w-full h-full">
            {chartType === 'line' ? (
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 80;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
            ) : (
              chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const openY = 100 - ((point.open - minPrice) / (maxPrice - minPrice)) * 80;
                const closeY = 100 - ((point.close - minPrice) / (maxPrice - minPrice)) * 80;
                const highY = 100 - ((point.high - minPrice) / (maxPrice - minPrice)) * 80;
                const lowY = 100 - ((point.low - minPrice) / (maxPrice - minPrice)) * 80;
                const isGreen = point.close > point.open;
                
                return (
                  <g key={index}>
                    {/* High-Low line */}
                    <line
                      x1={`${x}%`}
                      y1={`${highY}%`}
                      x2={`${x}%`}
                      y2={`${lowY}%`}
                      stroke={isGreen ? '#22c55e' : '#ef4444'}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={`${x - 0.5}%`}
                      y={`${Math.min(openY, closeY)}%`}
                      width="1%"
                      height={`${Math.abs(closeY - openY)}%`}
                      fill={isGreen ? '#22c55e' : '#ef4444'}
                    />
                  </g>
                );
              })
            )}

            {/* SMA Lines */}
            {indicators.sma20 && (
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="3,3"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const sma20 = point.price * 0.98; // Mock SMA20
                  const y = 100 - ((sma20 - minPrice) / (maxPrice - minPrice)) * 80;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
            )}

            {indicators.sma50 && (
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                strokeDasharray="5,5"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const sma50 = point.price * 0.95; // Mock SMA50
                  const y = 100 - ((sma50 - minPrice) / (maxPrice - minPrice)) * 80;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
            )}
          </svg>

          {/* Price Labels */}
          <div className="absolute left-2 top-2 text-white text-sm space-y-1">
            <div>현재가: {safeCurrencyFormat(stock.currentPrice)}</div>
            <div className={`${stock.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stock.dailyChange >= 0 ? '+' : ''}{safeCurrencyFormat(stock.dailyChange)} ({stock.dailyChangePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Date Range */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-gray-400 text-xs">
            <span>{chartData[0]?.date}</span>
            <span>{chartData[chartData.length - 1]?.date}</span>
          </div>
        </div>

        {/* Volume Chart */}
        {showVolume && (
          <div className="bg-gray-100 rounded-lg p-4 h-24 relative">
            <h4 className="text-sm font-medium text-gray-700 mb-2">거래량</h4>
            <div className="flex items-end h-16 space-x-1">
              {chartData.map((point, index) => (
                <div
                  key={index}
                  className="bg-blue-400 rounded-t"
                  style={{
                    height: `${(point.volume / maxVolume) * 100}%`,
                    width: `${100 / chartData.length}%`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* RSI Indicator */}
        {indicators.rsi && (
          <div className="mt-4 bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-900 mb-2">RSI (14)</h4>
            <div className="relative h-16 bg-white rounded border">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1 bg-gray-200 relative">
                  <div className="absolute top-0 h-1 bg-red-200" style={{ left: '70%', width: '30%' }}></div>
                  <div className="absolute top-0 h-1 bg-green-200" style={{ left: '0%', width: '30%' }}></div>
                  <div 
                    className="absolute top-0 w-2 h-2 bg-purple-600 rounded-full transform -translate-y-0.5" 
                    style={{ left: '65%' }}
                  ></div>
                </div>
              </div>
              <div className="absolute bottom-1 left-0 text-xs text-gray-500">0</div>
              <div className="absolute bottom-1 left-1/4 text-xs text-gray-500">30</div>
              <div className="absolute bottom-1 left-1/2 text-xs text-gray-500">50</div>
              <div className="absolute bottom-1 left-3/4 text-xs text-gray-500">70</div>
              <div className="absolute bottom-1 right-0 text-xs text-gray-500">100</div>
            </div>
            <p className="text-xs text-purple-700 mt-2">현재 RSI: 65.2 (과매수 구간 근접)</p>
          </div>
        )}
      </div>

      {/* Chart Analysis Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📊 차트 요약</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 현재 {timeframe} 기간 동안 {stock.dailyChangePercent > 0 ? '상승' : '하락'} 추세를 보이고 있습니다.</p>
          <p>• 거래량은 평균 대비 {Math.random() > 0.5 ? '높은' : '보통'} 수준입니다.</p>
          <p>• 기술적 지표는 {Math.random() > 0.5 ? '긍정적' : '중립적'} 신호를 나타내고 있습니다.</p>
        </div>
      </div>
    </Card>
  );
}
