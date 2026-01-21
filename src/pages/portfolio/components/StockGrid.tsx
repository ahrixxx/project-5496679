import Card from '../../../components/base/Card';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  isWatching: boolean;
}

interface StockGridProps {
  stocks: Stock[];
  selectedStock: Stock | null;
  onStockClick: (stock: Stock) => void;
  formatCurrency: (value: number) => string;
  activeTab: 'holdings' | 'watchlist';
}

export default function StockGrid({
  stocks,
  selectedStock,
  onStockClick,
  formatCurrency,
  activeTab
}: StockGridProps) {
  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = range > 0 ? ((max - value) / range) * 100 : 50;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] > data[0];

    return (
      <div className="w-full h-12 relative pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>
    );
  };

  const navigate = useNavigate();

  const handleStockClick = (stock: Stock) => {
    console.log('Navigating to stock detail:', `/stock/${stock.ticker}`);
    navigate(`/stock/${stock.ticker}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stocks.map((stock) => {
        const isPositive = stock.dailyChange >= 0;
        const isSelected = selectedStock?.id === stock.id;
        
        return (
          <div key={stock.id} onClick={() => handleStockClick(stock)}>
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Stock Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{stock.ticker}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {stock.sector}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{stock.companyName}</p>
                  </div>
                  {stock.isWatching && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      관심 종목
                    </span>
                  )}
                </div>

                {/* Mini Chart */}
                <MiniChart data={stock.chartData} />

                {/* Price Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {formatCurrency(stock.currentPrice)}
                    </span>
                    <div className={`flex items-center text-sm font-medium ${
                      stock.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <i className={`ri-arrow-${stock.dailyChangePercent >= 0 ? 'up' : 'down'}-line mr-1`}></i>
                      {stock.dailyChangePercent >= 0 ? '+' : ''}{stock.dailyChangePercent.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(stock.dailyChange)}
                  </div>

                  {/* Holdings Info */}
                  {activeTab === 'holdings' && stock.ownedQuantity && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>보유 수량</span>
                        <span>{stock.ownedQuantity}주</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>총 평가액</span>
                        <span>{formatCurrency(stock.totalValue || 0)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Detail Button (on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full py-2 text-blue-600 text-sm font-medium text-center bg-blue-50 rounded-md">
                    상세 보기 →
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
