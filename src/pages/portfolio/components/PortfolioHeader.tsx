
import { useState } from 'react';
import Card from '../../../components/base/Card';
import Modal from '../../../components/base/Modal';
import Button from '../../../components/base/Button';

interface PortfolioHeaderProps {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  activeTab: 'holdings' | 'watchlist';
  onTabChange: (tab: 'holdings' | 'watchlist') => void;
  currency: 'USD' | 'KRW';
  onCurrencyChange: (currency: 'USD' | 'KRW') => void;
  formatCurrency: (value: number) => string;
  holdingsCount: number;
  watchlistCount: number;
}

export default function PortfolioHeader({
  totalValue,
  dailyChange,
  dailyChangePercent,
  activeTab,
  onTabChange,
  currency,
  onCurrencyChange,
  formatCurrency,
  holdingsCount,
  watchlistCount
}: PortfolioHeaderProps) {
  const [showChartModal, setShowChartModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  const timeframes = [
    { label: '1일', value: '1D' },
    { label: '1주', value: '1W' },
    { label: '1개월', value: '1M' },
    { label: '3개월', value: '3M' },
    { label: '1년', value: '1Y' }
  ];

  const generateChartData = (timeframe: string) => {
    const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const data = [];
    let value = totalValue - (dailyChange * 30);
    
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.45) * (totalValue * 0.02);
      data.push({
        date: new Date(Date.now() - (points - i) * (timeframe === '1D' ? 3600000 : 86400000)).toLocaleDateString(),
        value: Math.max(value, totalValue * 0.8)
      });
    }
    return data;
  };

  const chartData = generateChartData(selectedTimeframe);
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <>
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Value */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">총 포트폴리오 가치</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            <div 
              className={`text-sm mt-1 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors flex items-center ${
                dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
              onClick={() => setShowAnalysisModal(true)}
            >
              {dailyChange >= 0 ? '+' : ''}{formatCurrency(dailyChange)} ({dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
              <i className="ri-arrow-right-s-line ml-1"></i>
            </div>
          </div>

          {/* Chart */}
          <div 
            className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={() => setShowChartModal(true)}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-2">30일 성과</h3>
            <div className="h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={dailyChange >= 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth="2"
                  points="0,77.77777777777779 16.666666666666664,55.55555555555556 33.33333333333333,100 50,22.22222222222222 66.66666666666666,44.44444444444444 83.33333333333334,0 100,16.666666666666664"
                />
              </svg>
              <div className="absolute top-2 right-2 text-xs text-gray-400">
                <i className="ri-external-link-line"></i>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div>
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => onTabChange('holdings')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'holdings'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                보유 종목 ({holdingsCount})
              </button>
              <button
                onClick={() => onTabChange('watchlist')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'watchlist'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                관심 종목 ({watchlistCount})
              </button>
            </div>
            
            {/* Currency Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currency === 'USD'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => onCurrencyChange('KRW')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currency === 'KRW'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                KRW
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart Detail Modal */}
      <Modal 
        isOpen={showChartModal} 
        onClose={() => setShowChartModal(false)} 
        title="포트폴리오 성과 차트"
        size="xl"
      >
        <div className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-80 bg-gray-50 rounded-lg p-4">
            <div className="h-full relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Chart Line */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 400;
                    const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                
                {/* Data Points */}
                {chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 400;
                  const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#22c55e"
                      className="hover:r-5 transition-all cursor-pointer"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">최고값</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(maxValue)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">최저값</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(minValue)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">변동률</p>
              <p className="text-lg font-semibold text-green-600">
                +{(((maxValue - minValue) / minValue) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">평균값</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(Math.round(chartData.reduce((sum, point) => sum + point.value, 0) / chartData.length))}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowChartModal(false)}>
              닫기
            </Button>
            <Button>
              <i className="ri-download-line mr-2"></i>
              차트 다운로드
            </Button>
          </div>
        </div>
      </Modal>

      {/* Analysis Detail Modal */}
      <Modal 
        isOpen={showAnalysisModal} 
        onClose={() => setShowAnalysisModal(false)} 
        title="포트폴리오 수익률 분석"
        size="lg"
      >
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">주간 수익률</p>
              <p className="text-xl font-bold text-green-600">+3.24%</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">월간 수익률</p>
              <p className="text-xl font-bold text-blue-600">+8.17%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">연간 수익률</p>
              <p className="text-xl font-bold text-purple-600">+24.8%</p>
            </div>
          </div>

          {/* Top Performers */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">오늘의 최고 수익 종목</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">AAPL</p>
                  <p className="text-sm text-gray-600">Apple Inc.</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$57.50</p>
                  <p className="text-sm text-green-600">+1.19%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">MSFT</p>
                  <p className="text-sm text-gray-600">Microsoft Corporation</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$30.80</p>
                  <p className="text-sm text-green-600">+0.93%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Allocation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">섹터별 포트폴리오 구성</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">기술</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">자동차</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAnalysisModal(false)}>
              닫기
            </Button>
            <Button>
              <i className="ri-share-line mr-2"></i>
              리포트 공유
            </Button>
            <Button>
              <i className="ri-download-line mr-2"></i>
              리포트 다운로드
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
