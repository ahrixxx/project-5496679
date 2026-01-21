import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import StockChart from './components/StockChart';

interface StockData {
  ticker: string;
  name: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  high52Week: number;
  low52Week: number;
  peRatio: number;
  beta: number;
  sector: string;
  dividendYield: number;
}

interface HoldingData {
  quantity: number;
  averageCost: number;
  totalValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  publishedAt: string;
  impact: 'high' | 'medium' | 'low';
}

interface ChartAnalysis {
  trend: 'upward' | 'downward' | 'sideways';
  support: number;
  resistance: number;
  momentum: 'strong' | 'weak' | 'neutral';
  volatility: 'high' | 'medium' | 'low';
  signals: string[];
  summary: string;
}

export default function StockDetailPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const [showKeyMetrics, setShowKeyMetrics] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai' as const,
      message: `안녕하세요! ${ticker} 차트 분석 전문 AI입니다. 📊 기술적 분석, 차트 패턴, 지지/저항선, 거래량 분석 등 차트와 관련된 질문에만 답변드립니다. 차트에 대해 궁금한 점을 물어보세요!`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock data - in real app, this would come from API
  const stockData: StockData = {
    ticker: ticker || 'TSLA',
    name: ticker === 'AAPL' ? 'Apple Inc.' : 
          ticker === 'GOOGL' ? 'Alphabet Inc.' :
          ticker === 'MSFT' ? 'Microsoft Corporation' :
          ticker === 'AMZN' ? 'Amazon.com Inc.' :
          ticker === 'NVDA' ? 'NVIDIA Corporation' : 'Tesla, Inc.',
    currentPrice: ticker === 'AAPL' ? 248.42 : 
                  ticker === 'GOOGL' ? 175.35 :
                  ticker === 'MSFT' ? 441.58 :
                  ticker === 'AMZN' ? 185.92 :
                  ticker === 'NVDA' ? 138.07 : 248.50,
    dailyChange: ticker === 'AAPL' ? -13.45 : 
                 ticker === 'GOOGL' ? 8.22 :
                 ticker === 'MSFT' ? -2.15 :
                 ticker === 'AMZN' ? 12.88 :
                 ticker === 'NVDA' ? -7.33 : 15.75,
    dailyChangePercent: ticker === 'AAPL' ? -5.18 : 
                        ticker === 'GOOGL' ? 4.92 :
                        ticker === 'MSFT' ? -0.48 :
                        ticker === 'AMZN' ? 7.44 :
                        ticker === 'NVDA' ? -5.05 : 6.77,
    marketCap: 3800000000000,
    volume: 45230000,
    avgVolume: 52100000,
    high52Week: 271.00,
    low52Week: 164.08,
    peRatio: 65.4,
    beta: 2.31,
    sector: ticker === 'AAPL' ? 'Technology' : 
            ticker === 'GOOGL' ? 'Technology' :
            ticker === 'MSFT' ? 'Technology' :
            ticker === 'AMZN' ? 'Consumer Discretionary' :
            ticker === 'NVDA' ? 'Technology' : 'Consumer Discretionary',
    dividendYield: 0.0
  };

  // Mock holdings data
  const holdingData: HoldingData | null = ticker === 'AAPL' ? {
    quantity: 50,
    averageCost: 185.30,
    totalValue: 12421.00,
    totalCost: 9265.00,
    unrealizedPL: 3156.00,
    unrealizedPLPercent: 34.07
  } : null;

  // Mock news data
  const newsData: NewsItem[] = [
    {
      id: '1',
      title: `${stockData.name} 4분기 실적 호조 발표`,
      summary: `${stockData.ticker}가 4분기 매출 성장과 마진 개선으로 애널리스트 전망치를 상회했습니다.`,
      sentiment: 'positive',
      source: '로이터',
      publishedAt: '2024-01-15',
      impact: 'high'
    },
    {
      id: '2',
      title: `애널리스트들 ${stockData.ticker} 목표가 상향 조정`,
      summary: `주요 투자은행들이 견고한 펀더멘털과 성장 전망에 따라 목표가를 상향 조정했습니다.`,
      sentiment: 'positive',
      source: '블룸버그',
      publishedAt: '2024-01-14',
      impact: 'medium'
    },
    {
      id: '3',
      title: `${stockData.sector} 섹터 역풍 직면`,
      summary: `업계 전반의 도전과 규제 우려로 인해 섹터에 불확실성이 조성되고 있습니다.`,
      sentiment: 'negative',
      source: 'CNBC',
      publishedAt: '2024-01-13',
      impact: 'medium'
    }
  ];

  // Generate news summary
  const generateNewsSummary = () => {
    const summaries = [
      `${stockData.name}(${stockData.ticker})가 4분기 실적 발표에서 애널리스트 전망치를 상회하며 시장의 긍정적인 반응을 이끌어냈습니다.`,
      `주요 투자은행들이 견고한 펀더멘털과 성장 전망을 근거로 ${stockData.ticker}의 목표가를 일제히 상향 조정했습니다.`,
      `${stockData.sector} 섹터 전반에 걸쳐 규제 강화 우려가 제기되고 있으나, ${stockData.name}는 상대적으로 양호한 포지션을 유지하고 있습니다.`,
      `거래량이 평균 대비 ${Math.floor(Math.random() * 30) + 120}% 증가하며 투자자들의 관심이 집중되고 있습니다.`,
      `기술적 분석에 따르면 ${stockData.ticker}는 주요 저항선을 돌파하며 ${stockData.dailyChangePercent > 0 ? '상승' : '조정'} 모멘텀을 이어가고 있습니다.`
    ];
    return summaries.slice(0, 4 + Math.floor(Math.random() * 2)).join(' ');
  };

  const newsSummary = generateNewsSummary();

  // Mock chart analysis
  const chartAnalysis: ChartAnalysis = {
    trend: stockData.dailyChangePercent > 0 ? 'upward' : 'downward',
    support: stockData.currentPrice * 0.95,
    resistance: stockData.currentPrice * 1.05,
    momentum: Math.abs(stockData.dailyChangePercent) > 3 ? 'strong' : 'neutral',
    volatility: stockData.beta > 1.5 ? 'high' : stockData.beta > 1 ? 'medium' : 'low',
    signals: [
      '20일 이동평균선 위에서 거래',
      'RSI 중립적 모멘텀 표시',
      '평균 대비 높은 거래량',
      '저항선 돌파 중'
    ],
    summary: `차트는 ${stockData.dailyChangePercent > 0 ? '강세' : '약세'} 모멘텀을 보이며 ${stockData.beta > 1.5 ? '높은' : '보통'} 변동성을 나타냅니다. 주요 지지선과 저항선이 명확히 정의되어 있습니다.`
  };

  const formatCurrency = (value: number) => {
    if (currency === 'KRW') {
      return `₩${(value * 1320).toLocaleString()}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'ri-arrow-up-circle-line';
      case 'negative': return 'ri-arrow-down-circle-line';
      case 'neutral': return 'ri-subtract-line';
    }
  };

  const getTrendColor = (trend: ChartAnalysis['trend']) => {
    switch (trend) {
      case 'upward': return 'text-green-600';
      case 'downward': return 'text-red-600';
      case 'sideways': return 'text-gray-600';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Check if the question is chart-related
    const chartKeywords = ['차트', '기술적', '지지', '저항', '이동평균', 'RSI', 'MACD', '볼린저', '패턴', '캔들', '거래량', '추세', '돌파', '반등', '조정'];
    const isChartRelated = chartKeywords.some(keyword => newMessage.includes(keyword));

    // Simulate RAG-based chart analysis response
    setTimeout(() => {
      let aiResponse = '';

      if (!isChartRelated) {
        aiResponse = '죄송합니다. 저는 차트 분석 전문 AI로, 기술적 분석과 차트 관련 질문에만 답변드릴 수 있습니다. 📊 차트 패턴, 지지/저항선, 기술적 지표 등에 대해 물어보세요!';
      } else {
        const chartResponses = [
          `📈 ${ticker} 차트를 분석해보니, 현재 ${stockData.dailyChangePercent > 0 ? '상승' : '하락'} 추세선을 형성하고 있습니다. 20일 이동평균선 ${stockData.dailyChangePercent > 0 ? '위에서' : '아래에서'} 거래되고 있어 ${stockData.dailyChangePercent > 0 ? '강세' : '약세'} 신호를 보이고 있습니다.`,
          
          `📊 기술적 지표 분석 결과: RSI는 ${Math.floor(Math.random() * 30) + 40} 수준으로 ${Math.random() > 0.5 ? '중립' : '과매수'} 구간에 있습니다. MACD는 ${stockData.dailyChangePercent > 0 ? '골든크로스' : '데드크로스'} 신호를 보이고 있어 ${stockData.dailyChangePercent > 0 ? '매수' : '매도'} 타이밍으로 해석됩니다.`,
          
          `🎯 지지/저항선 분석: 주요 지지선은 ${formatCurrency(stockData.currentPrice * 0.95)} 근처에 형성되어 있고, 저항선은 ${formatCurrency(stockData.currentPrice * 1.05)} 수준입니다. 현재가가 이 구간에서 ${Math.random() > 0.5 ? '상승' : '하락'} 압력을 받고 있습니다.`,
          
          `📉 차트 패턴 분석: ${ticker}는 현재 ${['삼각수렴', '상승쐐기', '하락쐐기', '직사각형'][Math.floor(Math.random() * 4)]} 패턴을 형성 중입니다. 거래량은 평균 대비 ${Math.random() > 0.5 ? '증가' : '감소'}하여 패턴의 신뢰도가 ${Math.random() > 0.5 ? '높습니다' : '보통입니다'}.`,
          
          `🔍 볼린저 밴드 분석: 현재가가 볼린저 밴드 ${Math.random() > 0.5 ? '상단' : '하단'}에 근접해 있어 ${Math.random() > 0.5 ? '과매수' : '과매도'} 상태입니다. 밴드폭이 ${Math.random() > 0.5 ? '확장' : '수축'}되고 있어 변동성이 ${Math.random() > 0.5 ? '증가' : '감소'} 추세입니다.`,
          
          `⚡ 거래량 분석: 최근 거래량이 평균 대비 ${Math.floor(Math.random() * 50) + 120}% 수준으로 ${Math.random() > 0.5 ? '급증' : '증가'}했습니다. 이는 ${stockData.dailyChangePercent > 0 ? '상승' : '하락'} 모멘텀의 지속 가능성을 시사합니다.`
        ];

        aiResponse = chartResponses[Math.floor(Math.random() * chartResponses.length)];
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openAIAssistant = () => {
    const widget = document.querySelector('#vapi-widget-floating-button') as HTMLElement;
    if (widget) {
      widget.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/portfolio')}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Portfolio
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrency('USD')}
                className={`text-sm ${currency === 'USD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                USD
              </Button>
              <Button
                onClick={() => setCurrency('KRW')}
                className={`text-sm ${currency === 'KRW' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                KRW
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Full Width Layout */}
        <div className="space-y-6">
          {/* Stock Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => setShowKeyMetrics(!showKeyMetrics)}
                    className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {stockData.name}
                  </button>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {stockData.ticker}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(stockData.currentPrice)}
                  </span>
                  <div className={`flex items-center text-lg font-medium ${
                    stockData.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <i className={`ri-arrow-${stockData.dailyChangePercent >= 0 ? 'up' : 'down'}-line mr-1`}></i>
                    {stockData.dailyChangePercent >= 0 ? '+' : ''}{formatCurrency(stockData.dailyChange)} 
                    ({stockData.dailyChangePercent >= 0 ? '+' : ''}{stockData.dailyChangePercent.toFixed(2)}%)
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {stockData.sector} • Market Cap: {formatLargeNumber(stockData.marketCap)}
                </div>
              </div>
            </div>
          </Card>

          {/* Key Metrics - Collapsible */}
          {showKeyMetrics && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Market Cap</div>
                  <div className="font-medium text-gray-900">{formatLargeNumber(stockData.marketCap)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="font-medium text-gray-900">{stockData.volume.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">52W High</div>
                  <div className="font-medium text-gray-900">{formatCurrency(stockData.high52Week)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">52W Low</div>
                  <div className="font-medium text-gray-900">{formatCurrency(stockData.low52Week)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">P/E Ratio</div>
                  <div className="font-medium text-gray-900">{stockData.peRatio.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Beta</div>
                  <div className="font-medium text-gray-900">{stockData.beta.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Avg Volume</div>
                  <div className="font-medium text-gray-900">{stockData.avgVolume.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dividend Yield</div>
                  <div className="font-medium text-gray-900">
                    {stockData.dividendYield > 0 ? `${stockData.dividendYield.toFixed(2)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Holdings Summary */}
          {holdingData && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Your Holdings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-green-700">Shares Owned</div>
                  <div className="text-xl font-bold text-green-900">{holdingData.quantity}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Avg Cost</div>
                  <div className="text-xl font-bold text-green-900">{formatCurrency(holdingData.averageCost)}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Total Value</div>
                  <div className="text-xl font-bold text-green-900">{formatCurrency(holdingData.totalValue)}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Unrealized P&L</div>
                  <div className={`text-xl font-bold ${holdingData.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {holdingData.unrealizedPL >= 0 ? '+' : ''}{formatCurrency(holdingData.unrealizedPL)}
                    <div className="text-sm">
                      ({holdingData.unrealizedPLPercent >= 0 ? '+' : ''}{holdingData.unrealizedPLPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Stock Chart - Full Width */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Chart</h3>
            <StockChart stock={stockData} formatCurrency={formatCurrency} />
          </Card>

          {/* Recent News and Chart Analysis - Two Equal Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent News */}
            <Card>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-newspaper-line text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">오늘의 뉴스 요약</h3>
              </div>
              
              {/* News Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-file-text-line text-white text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                      <i className="ri-sparkle-line mr-2"></i>
                      AI 요약
                    </h4>
                    <p className="text-base text-gray-800 leading-relaxed font-normal">
                      {newsSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* News Sources */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <i className="ri-links-line mr-2 text-gray-500"></i>
                  참고 출처
                </h4>
                <div className="space-y-2">
                  {newsData.map((item) => (
                    <div key={item.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getSentimentColor(item.sentiment)}`}>
                            <i className={`${getSentimentIcon(item.sentiment)} text-xs`}></i>
                          </div>
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                            {item.title}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4 text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                  <i className="ri-external-link-line mr-2"></i>
                  모든 뉴스 보기
                </Button>
              </div>
            </Card>

            {/* Chart Analysis */}
            <Card>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-line-chart-line text-purple-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">차트 분석</h3>
              </div>
              
              {/* Mini Chart Visualization */}
              <div className="bg-gray-900 rounded-lg p-4 h-32 mb-4 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Price Line */}
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points="10,80 25,70 40,75 55,60 70,65 85,50 100,45 115,55 130,40 145,45 160,35 175,30 190,25"
                  />
                  
                  {/* Support/Resistance Lines */}
                  <line x1="0" y1="85" x2="100%" y2="85" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" opacity="0.7"/>
                  <line x1="0" y1="25" x2="100%" y2="25" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.7"/>
                  
                  {/* Current Price Indicator */}
                  <circle cx="190" cy="25" r="3" fill="#3B82F6"/>
                </svg>
                
                {/* Labels */}
                <div className="absolute top-2 left-2 text-white text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>현재가</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-green-400 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>지지선</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-red-400 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>저항선</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">추세</div>
                    <div className={`font-medium ${getTrendColor(chartAnalysis.trend)}`}>
                      {chartAnalysis.trend === 'upward' ? '📈 상승세' : 
                       chartAnalysis.trend === 'downward' ? '📉 하락세' : '➡️ 횡보'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">변동성</div>
                    <div className="font-medium text-gray-900">
                      {chartAnalysis.volatility === 'high' ? '🔴 높음' :
                       chartAnalysis.volatility === 'medium' ? '🟡 보통' : '🟢 낮음'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">지지선</div>
                    <div className="font-medium text-gray-900">{formatCurrency(chartAnalysis.support)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">저항선</div>
                    <div className="font-medium text-gray-900">{formatCurrency(chartAnalysis.resistance)}</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">{chartAnalysis.summary}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">주요 신호</h4>
                  <div className="space-y-1">
                    {chartAnalysis.signals.map((signal, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        {signal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Chart Analysis Chatbot - Full Width Below */}
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-robot-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">차트 분석 AI 어시스턴트</h3>
                  <p className="text-sm text-gray-600">RAG 기반 실시간 기술적 분석 • 차트 전문 AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">온라인</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
              {/* Chat Messages */}
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 mb-6 h-80 overflow-y-auto border border-gray-200">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-4 rounded-lg text-sm ${
                        msg.type === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-sm' 
                          : 'bg-white text-gray-800 border border-indigo-200 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center mb-2">
                            <i className="ri-robot-line text-indigo-600 text-sm mr-2"></i>
                            <span className="text-sm text-indigo-600 font-medium">차트 분석 AI</span>
                          </div>
                        )}
                        <div className="leading-relaxed">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 border border-indigo-200 p-4 rounded-lg rounded-bl-sm text-sm shadow-sm">
                        <div className="flex items-center mb-2">
                          <i className="ri-robot-line text-indigo-600 text-sm mr-2"></i>
                          <span className="text-sm text-indigo-600 font-medium">차트 분석 AI</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="차트 패턴, 기술적 지표, 지지/저항선에 대해 질문해보세요..."
                  className="flex-1 px-4 py-3 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 px-6 py-3"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  전송
                </Button>
              </div>

              {/* Quick Chart Questions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  '현재 추세 분석해줘',
                  '지지/저항선은 어디야?',
                  'RSI 지표 분석',
                  '거래량 패턴 어때?',
                  '차트 패턴 분석',
                  '볼린저 밴드 상태는?',
                  'MACD 신호는?',
                  '이동평균선 분석'
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => setNewMessage(question)}
                    className="text-sm px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors whitespace-nowrap border border-indigo-200"
                  >
                    {question}
                  </button>
                ))}
              </div>

              {/* AI Features Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2">
                  <i className="ri-line-chart-line text-indigo-600"></i>
                  <span className="text-sm text-indigo-800 font-medium">기술적 지표 분석</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-bar-chart-line text-indigo-600"></i>
                  <span className="text-sm text-indigo-800 font-medium">차트 패턴 인식</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-pulse-line text-indigo-600"></i>
                  <span className="text-sm text-indigo-800 font-medium">실시간 RAG 분석</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                💡 이 AI는 차트 분석 전용입니다. 기술적 분석만 제공하며, 투자 조언이 아닙니다. 모든 투자 결정은 신중하게 하시기 바랍니다.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}