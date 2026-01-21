import { useState } from 'react';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import PortfolioHeader from './components/PortfolioHeader';
import StockGrid from './components/StockGrid';
import StockDetailCard from './components/StockDetailCard';
import AddStockModal from './components/AddStockModal';

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

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<'holdings' | 'watchlist'>('holdings');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

  // Mock portfolio data
  const mockHoldings: Stock[] = [
    {
      id: '1',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      currentPrice: 195.50,
      dailyChange: 2.30,
      dailyChangePercent: 1.19,
      ownedQuantity: 25,
      totalValue: 4887.50,
      sector: '기술',
      chartData: [190, 192, 188, 195, 193, 197, 195.50],
      marketCap: '$3.01T',
      peRatio: 29.8,
      weekRange52: { low: 164.08, high: 199.62 },
      isWatching: false
    },
    {
      id: '2',
      ticker: 'TSLA',
      companyName: 'Tesla Inc.',
      currentPrice: 248.42,
      dailyChange: -5.18,
      dailyChangePercent: -2.04,
      ownedQuantity: 10,
      totalValue: 2484.20,
      sector: '자동차',
      chartData: [260, 255, 250, 245, 252, 250, 248.42],
      marketCap: '$792.3B',
      peRatio: 66.2,
      weekRange52: { low: 138.80, high: 271.00 },
      isWatching: false
    },
    {
      id: '3',
      ticker: 'MSFT',
      companyName: 'Microsoft Corporation',
      currentPrice: 420.15,
      dailyChange: 3.85,
      dailyChangePercent: 0.93,
      ownedQuantity: 8,
      totalValue: 3361.20,
      sector: '기술',
      chartData: [415, 418, 412, 420, 416, 422, 420.15],
      marketCap: '$3.12T',
      peRatio: 34.5,
      weekRange52: { low: 309.45, high: 468.35 },
      isWatching: false
    }
  ];

  const mockWatchlist: Stock[] = [
    {
      id: '4',
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      currentPrice: 875.30,
      dailyChange: 12.45,
      dailyChangePercent: 1.44,
      sector: '반도체',
      chartData: [850, 860, 845, 870, 865, 880, 875.30],
      marketCap: '$2.15T',
      peRatio: 65.8,
      weekRange52: { low: 394.00, high: 974.00 },
      isWatching: true
    },
    {
      id: '5',
      ticker: 'GOOGL',
      companyName: 'Alphabet Inc.',
      currentPrice: 168.25,
      dailyChange: -1.85,
      dailyChangePercent: -1.09,
      sector: '기술',
      chartData: [172, 170, 168, 169, 167, 170, 168.25],
      marketCap: '$2.08T',
      peRatio: 25.4,
      weekRange52: { low: 129.40, high: 193.31 },
      isWatching: true
    }
  ];

  const currentStocks = activeTab === 'holdings' ? mockHoldings : mockWatchlist;
  
  // Calculate portfolio totals
  const totalPortfolioValue = mockHoldings.reduce((sum, stock) => sum + (stock.totalValue || 0), 0);
  const totalDailyChange = mockHoldings.reduce((sum, stock) => {
    const dailyChange = (stock.ownedQuantity || 0) * stock.dailyChange;
    return sum + dailyChange;
  }, 0);
  const totalDailyChangePercent = totalPortfolioValue > 0 ? (totalDailyChange / (totalPortfolioValue - totalDailyChange)) * 100 : 0;

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

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(selectedStock?.id === stock.id ? null : stock);
  };

  const handleAddStock = () => {
    setIsAddStockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Header */}
        <PortfolioHeader
          totalValue={totalPortfolioValue}
          dailyChange={totalDailyChange}
          dailyChangePercent={totalDailyChangePercent}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currency={currency}
          onCurrencyChange={setCurrency}
          formatCurrency={formatCurrency}
          holdingsCount={mockHoldings.length}
          watchlistCount={mockWatchlist.length}
        />

        {/* Add Stock Button */}
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={handleAddStock}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <i className="ri-add-line mr-2"></i>
            {activeTab === 'holdings' ? '종목 추가' : '관심 종목 추가'}
          </Button>
        </div>

        {/* Stock Grid */}
        <StockGrid
          stocks={currentStocks}
          selectedStock={selectedStock}
          onStockClick={handleStockClick}
          formatCurrency={formatCurrency}
          activeTab={activeTab}
        />

        {/* Expanded Stock Detail Card */}
        {selectedStock && (
          <StockDetailCard
            stock={selectedStock}
            formatCurrency={formatCurrency}
            onClose={() => setSelectedStock(null)}
          />
        )}

        {/* Empty State */}
        {currentStocks.length === 0 && (
          <Card className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-stock-line text-blue-600 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'holdings' ? '보유 종목이 없습니다' : '관심 종목이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'holdings' 
                ? '첫 번째 주식을 추가하여 포트폴리오를 시작하세요' 
                : '관심 있는 종목을 추가하여 시장을 모니터링하세요'
              }
            </p>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddStock}>
              <i className="ri-add-line mr-2"></i>
              {activeTab === 'holdings' ? '첫 종목 추가하기' : '관심 종목 추가하기'}
            </Button>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>데이터 업데이트: 5분 전 · 출처: Alpha Vantage, FinanceDataReader</p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              거래 일지로 이동 → 학습 로그 보기
            </a>
          </p>
        </div>
      </main>

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        type={activeTab}
      />
    </div>
  );
}