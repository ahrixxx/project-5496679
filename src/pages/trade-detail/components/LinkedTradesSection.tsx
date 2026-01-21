
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

interface LinkedTradesSectionProps {
  linkedTrades: Trade[];
  currentTrade: Trade;
  formatCurrency: (value: number) => string;
}

export default function LinkedTradesSection({ linkedTrades, currentTrade, formatCurrency }: LinkedTradesSectionProps) {
  const calculateAveragePurchasePrice = () => {
    const totalValue = linkedTrades.reduce((sum, trade) => sum + (trade.price * trade.quantity), 0);
    const totalQuantity = linkedTrades.reduce((sum, trade) => sum + trade.quantity, 0);
    return totalValue / totalQuantity;
  };

  const calculateRemainingShares = () => {
    const totalBought = linkedTrades.reduce((sum, trade) => sum + trade.quantity, 0);
    return Math.max(0, totalBought - currentTrade.quantity);
  };

  const averagePrice = calculateAveragePurchasePrice();
  const remainingShares = calculateRemainingShares();
  const totalBoughtShares = linkedTrades.reduce((sum, trade) => sum + trade.quantity, 0);

  return (
    <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <i className="ri-links-line text-green-600"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">연결된 매수 거래</h3>
          <p className="text-sm text-green-700">이 매도는 이전 매수와 연결되어 있습니다</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">평균 매수가</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(averagePrice)}</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">총 매수</p>
          <p className="text-lg font-semibold text-gray-900">{totalBoughtShares}주</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">현재 매도</p>
          <p className="text-lg font-semibold text-gray-900">{currentTrade.quantity}주</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">잔여</p>
          <p className="text-lg font-semibold text-gray-900">{remainingShares}주</p>
        </div>
      </div>

      {/* Linked Trades List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">연결된 매수 거래:</h4>
        {linkedTrades.map((trade, index) => (
          <div key={trade.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{trade.date}</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    매수
                  </span>
                </div>
                <p className="text-xs text-gray-600">{trade.behaviorTag}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {trade.quantity}주 @ {formatCurrency(trade.price)}
              </p>
              <p className="text-xs text-gray-600">
                신뢰도: {trade.confidence}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Visualization */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">거래 흐름</h4>
        <div className="flex items-center justify-between">
          {linkedTrades.map((trade, index) => (
            <div key={trade.id} className="flex items-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <i className="ri-arrow-up-line text-blue-600"></i>
                </div>
                <p className="text-xs text-gray-600">매수 {index + 1}</p>
                <p className="text-xs font-medium">{trade.quantity}</p>
              </div>
              {index < linkedTrades.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              )}
            </div>
          ))}
          
          <div className="flex-1 h-px bg-gray-300 mx-2"></div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <i className="ri-arrow-down-line text-red-600"></i>
            </div>
            <p className="text-xs text-gray-600">매도</p>
            <p className="text-xs font-medium">{currentTrade.quantity}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
