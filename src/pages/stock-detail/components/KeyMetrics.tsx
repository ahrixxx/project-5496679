
import Card from '../../../components/base/Card';

interface StockData {
  ticker: string;
  marketCap: string;
  peRatio: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  avgVolume: number;
  dividend: number;
  beta: number;
  currentPrice: number;
}

interface KeyMetricsProps {
  stock: StockData;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

export default function KeyMetrics({ stock, formatCurrency, formatNumber }: KeyMetricsProps) {
  const calculateMetrics = () => {
    const priceToHigh = ((stock.currentPrice - stock.weekLow52) / (stock.weekHigh52 - stock.weekLow52)) * 100;
    const volumeRatio = (stock.volume / stock.avgVolume) * 100;
    
    return {
      priceToHigh: priceToHigh.toFixed(1),
      volumeRatio: volumeRatio.toFixed(0)
    };
  };

  const metrics = calculateMetrics();

  const getMetricColor = (value: number, type: 'pe' | 'beta' | 'volume') => {
    switch (type) {
      case 'pe':
        if (value < 15) return 'text-green-600';
        if (value < 25) return 'text-yellow-600';
        return 'text-red-600';
      case 'beta':
        if (value < 1) return 'text-green-600';
        if (value < 1.5) return 'text-yellow-600';
        return 'text-red-600';
      case 'volume':
        if (value > 120) return 'text-green-600';
        if (value > 80) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 지표</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">시가총액</span>
            <span className="font-medium text-gray-900">${stock.marketCap}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">PER</span>
            <span className={`font-medium ${getMetricColor(stock.peRatio, 'pe')}`}>
              {stock.peRatio.toFixed(1)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">52주 최고가</span>
            <span className="font-medium text-gray-900">{formatCurrency(stock.weekHigh52)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">52주 최저가</span>
            <span className="font-medium text-gray-900">{formatCurrency(stock.weekLow52)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">베타</span>
            <span className={`font-medium ${getMetricColor(stock.beta, 'beta')}`}>
              {stock.beta.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">배당수익률</span>
            <span className="font-medium text-gray-900">
              {stock.dividend > 0 ? `${stock.dividend.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
        </div>
      </Card>

      {/* Price Range Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 범위</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>52주 최저가</span>
              <span>52주 최고가</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full">
              <div 
                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded-full"
                style={{ width: `${metrics.priceToHigh}%` }}
              ></div>
              <div 
                className="absolute top-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-y-1/2 border-2 border-white"
                style={{ left: `${metrics.priceToHigh}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatCurrency(stock.weekLow52)}</span>
              <span className="font-medium text-blue-600">현재: {formatCurrency(stock.currentPrice)}</span>
              <span>{formatCurrency(stock.weekHigh52)}</span>
            </div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              52주 범위 내 <span className="font-bold">{metrics.priceToHigh}%</span> 위치
            </p>
          </div>
        </div>
      </Card>

      {/* Volume Analysis Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">거래량 분석</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">오늘 거래량</span>
            <span className="font-medium text-gray-900">{formatNumber(stock.volume)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">평균 거래량</span>
            <span className="font-medium text-gray-900">{formatNumber(stock.avgVolume)}</span>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              평균 대비 <span className={`font-bold ${getMetricColor(parseInt(metrics.volumeRatio), 'volume')}`}>
                {metrics.volumeRatio}%
              </span> 거래량
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  parseInt(metrics.volumeRatio) > 120 ? 'bg-green-500' :
                  parseInt(metrics.volumeRatio) > 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(parseInt(metrics.volumeRatio), 200)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Assessment Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">위험도 평가</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">변동성 (베타)</span>
              <span className={`text-sm font-medium ${getMetricColor(stock.beta, 'beta')}`}>
                {stock.beta < 1 ? '낮음' : stock.beta < 1.5 ? '보통' : '높음'}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  stock.beta < 1 ? 'bg-green-500' :
                  stock.beta < 1.5 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(stock.beta * 50, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>• 베타 1.0 미만: 시장 대비 낮은 변동성</p>
            <p>• 베타 1.0-1.5: 시장과 유사한 변동성</p>
            <p>• 베타 1.5 이상: 시장 대비 높은 변동성</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
