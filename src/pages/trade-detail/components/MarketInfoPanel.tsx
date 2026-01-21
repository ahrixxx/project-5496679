
import Card from '../../../components/base/Card';

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

interface MarketInfoPanelProps {
  trade: Trade;
}

export default function MarketInfoPanel({ trade }: MarketInfoPanelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getVolatilityLevel = (volatility: number) => {
    if (volatility < 0.25) return { level: 'Low', color: 'text-green-600 bg-green-50' };
    if (volatility < 0.35) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'High', color: 'text-red-600 bg-red-50' };
  };

  const getSMADirection = (current: number, sma20: number, sma50: number) => {
    if (current > sma20 && sma20 > sma50) return { direction: 'Rising', color: 'text-green-600', icon: 'ri-arrow-up-line' };
    if (current < sma20 && sma20 < sma50) return { direction: 'Falling', color: 'text-red-600', icon: 'ri-arrow-down-line' };
    return { direction: 'Flat', color: 'text-gray-600', icon: 'ri-arrow-right-line' };
  };

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: 'Overbought', color: 'text-red-600', icon: 'ri-arrow-up-circle-line' };
    if (rsi < 30) return { signal: 'Oversold', color: 'text-green-600', icon: 'ri-arrow-down-circle-line' };
    return { signal: 'Neutral', color: 'text-gray-600', icon: 'ri-checkbox-blank-circle-line' };
  };

  const volatilityInfo = getVolatilityLevel(trade.context.volatility);
  const smaInfo = getSMADirection(trade.price, trade.context.sma20, trade.context.sma50);
  const rsiInfo = getRSISignal(trade.context.rsi);

  // Mock news keywords based on ticker
  const getNewsKeywords = (ticker: string) => {
    const keywords: { [key: string]: string[] } = {
      'AAPL': ['Earnings', 'iPhone Launch', 'Services Growth'],
      'TSLA': ['Delivery Numbers', 'Autopilot', 'Energy Storage'],
      'MSFT': ['Azure Growth', 'AI Integration', 'Cloud Services'],
      'NVDA': ['AI Chips', 'Data Center', 'Gaming Revenue'],
      'GOOGL': ['Search Revenue', 'YouTube Ads', 'Cloud Competition'],
      'AMD': ['CPU Market Share', 'Data Center', 'Gaming GPUs']
    };
    return keywords[ticker] || ['Market Update', 'Sector News', 'Economic Data'];
  };

  const newsKeywords = getNewsKeywords(trade.ticker);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Snapshot</h3>
      
      <div className="space-y-4">
        {/* RSI */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <i className={`${rsiInfo.icon} ${rsiInfo.color} mr-2`}></i>
            <span className="text-sm font-medium text-gray-700">RSI</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{trade.context.rsi}</div>
            <div className={`text-xs ${rsiInfo.color}`}>{rsiInfo.signal}</div>
          </div>
        </div>

        {/* SMA Trend */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <i className={`${smaInfo.icon} ${smaInfo.color} mr-2`}></i>
            <span className="text-sm font-medium text-gray-700">SMA Trend</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              20: {formatCurrency(trade.context.sma20)}
            </div>
            <div className="text-sm text-gray-600">
              50: {formatCurrency(trade.context.sma50)}
            </div>
            <div className={`text-xs ${smaInfo.color}`}>{smaInfo.direction}</div>
          </div>
        </div>

        {/* Volatility */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <i className="ri-pulse-line text-purple-600 mr-2"></i>
            <span className="text-sm font-medium text-gray-700">Volatility</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {(trade.context.volatility * 100).toFixed(1)}%
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${volatilityInfo.color}`}>
              {volatilityInfo.level}
            </span>
          </div>
        </div>

        {/* News Sentiment */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <i className="ri-news-line text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">News Sentiment</span>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              trade.context.sentiment.toLowerCase().includes('positive') 
                ? 'text-green-600 bg-green-50' 
                : trade.context.sentiment.toLowerCase().includes('negative')
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 bg-gray-50'
            }`}>
              {trade.context.sentiment}
            </span>
          </div>
          
          {/* Sentiment Score Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Negative</span>
              <span>Positive</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
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
          </div>

          {/* Key News Keywords */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Key Topics:</p>
            <div className="flex flex-wrap gap-1">
              {newsKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Market Context Summary */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <i className="ri-lightbulb-line text-blue-600 mr-2 mt-0.5"></i>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Context Summary</h4>
              <p className="text-xs text-blue-700">
                At trade time, {trade.ticker} was {smaInfo.direction.toLowerCase()} with {volatilityInfo.level.toLowerCase()} volatility. 
                RSI indicated {rsiInfo.signal.toLowerCase()} conditions. 
                Market sentiment was {trade.context.sentiment.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
