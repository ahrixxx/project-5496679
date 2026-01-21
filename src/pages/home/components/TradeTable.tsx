import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import type { Trade } from '../../../mocks/trades';

interface TradeTableProps {
  onAddTrade: () => void;
  trades?: Trade[];      // 👈 물음표(?) 추가: 없을 수도 있다는 뜻
  isLoading: boolean;
}

// 👇 trades = [] 라고 써서, 데이터 없으면 빈 배열로 자동 설정! (여기가 핵심)
export default function TradeTable({ onAddTrade, trades = [], isLoading }: TradeTableProps) {
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const navigate = useNavigate();

  const handleTradeClick = (id: string) => {
    navigate(`/trade/${id}`);
  };

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

  // trades가 진짜로 배열인지 한 번 더 확인 (이중 안전장치)
  const safeTrades = Array.isArray(trades) ? trades : [];

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">거래 일지</h2>
          {!isLoading && (
            <p className="text-sm text-gray-600 mt-1">{safeTrades.length}개의 거래가 기록됨</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'KRW' : 'USD')}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-exchange-line mr-2"></i>
            {currency === 'USD' ? '원화로 보기' : '달러로 보기'}
          </button>
          <Button onClick={onAddTrade} className="flex items-center">
            <i className="ri-add-line mr-2"></i>
            새 거래 추가
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-500">
          데이터를 불러오는 중입니다... ⏳
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">날짜</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">티커</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">거래</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">가격</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">수량</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">손익 (%)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">신뢰도</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">행동</th>
              </tr>
            </thead>
            <tbody>
              {safeTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    아직 거래 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                safeTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{trade.date}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleTradeClick(trade.id)} className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {trade.ticker}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${trade.action === 'Buy' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {trade.action === 'Buy' ? '매수' : '매도'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(trade.price)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{trade.quantity}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(trade.pnl)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${trade.confidence}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600">{trade.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${trade.action === 'Buy' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                        {trade.behaviorTag}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}