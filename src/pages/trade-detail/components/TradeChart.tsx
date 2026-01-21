
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

interface TradeChartProps {
  trade: Trade;
  showCurrentPrice: boolean;
}

export default function TradeChart({ trade, showCurrentPrice }: TradeChartProps) {
  const [activeIndicators, setActiveIndicators] = useState({
    rsi: true,
    sma20: true,
    sma50: false,
    volatility: false
  });

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div>
      {/* Chart Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => toggleIndicator('rsi')}
          className={`text-xs ${activeIndicators.rsi ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          RSI ({trade.context.rsi})
        </Button>
        <Button
          onClick={() => toggleIndicator('sma20')}
          className={`text-xs ${activeIndicators.sma20 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          SMA(20)
        </Button>
        <Button
          onClick={() => toggleIndicator('sma50')}
          className={`text-xs ${activeIndicators.sma50 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          SMA(50)
        </Button>
        <Button
          onClick={() => toggleIndicator('volatility')}
          className={`text-xs ${activeIndicators.volatility ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Volatility
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
                    r="6"
                    fill={trade.action === 'Buy' ? '#10B981' : '#EF4444'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={`${x}%`}
                    y={`${y - 15}%`}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {trade.action === 'Buy' ? '↑' : '↓'} {trade.action}
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
          <div className="mb-1">Trade: {formatCurrency(trade.price)}</div>
          {showCurrentPrice && (
            <div className="text-yellow-400">Current: {formatCurrency(currentPrice)}</div>
          )}
        </div>

        {/* Date labels */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-gray-400 text-xs">
          <span>-14d</span>
          <span className="text-white font-medium">Trade Day</span>
          <span>+13d</span>
        </div>
      </div>

      {/* Technical Indicators */}
      {(activeIndicators.rsi || activeIndicators.sma20 || activeIndicators.sma50) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Indicators</h4>
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

      {/* Sentiment Bar */}
      <div className="mt-4 p-4 bg-white border rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Market Sentiment</h4>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
            <div 
              className={`h-3 rounded-full ${
                trade.context.sentiment.toLowerCase().includes('positive') 
                  ? 'bg-green-500' 
                  : trade.context.sentiment.toLowerCase().includes('negative')
                  ? 'bg-red-500'
                  : 'bg-gray-400'
              }`}
              style={{ 
                width: trade.context.sentiment.toLowerCase().includes('positive') 
                  ? '75%' 
                  : trade.context.sentiment.toLowerCase().includes('negative')
                  ? '25%'
                  : '50%'
              }}
            ></div>
          </div>
          <span className={`text-sm font-medium ${
            trade.context.sentiment.toLowerCase().includes('positive') 
              ? 'text-green-600' 
              : trade.context.sentiment.toLowerCase().includes('negative')
              ? 'text-red-600'
              : 'text-gray-600'
          }`}>
            {trade.context.sentiment}
          </span>
        </div>
      </div>
    </div>
  );
}
