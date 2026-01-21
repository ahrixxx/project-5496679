import { useState } from 'react';
import Modal from '../../../components/base/Modal';
import Input from '../../../components/base/Input';
import Button from '../../../components/base/Button';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'holdings' | 'watchlist';
}

export default function AddStockModal({ isOpen, onClose, type }: AddStockModalProps) {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock popular stocks
  const popularStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: '기술' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: '자동차' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: '기술' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: '반도체' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: '기술' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: '전자상거래' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: '기술' },
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: '반도체' }
  ];

  const handleSearch = (value: string) => {
    setTicker(value);
    if (value.length >= 1) {
      setIsSearching(true);
      // Mock search - filter popular stocks
      const results = popularStocks.filter(stock => 
        stock.ticker.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStock = (stock: any) => {
    setTicker(stock.ticker);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker) {
      alert('티커를 입력해주세요');
      return;
    }

    if (type === 'holdings') {
      if (!quantity || parseFloat(quantity) <= 0) {
        alert('올바른 수량을 입력해주세요');
        return;
      }
      if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
        alert('올바른 매수가를 입력해주세요');
        return;
      }
    }

    // TODO: Implement actual add stock logic
    console.log('Adding stock:', { ticker, quantity, purchasePrice, type });
    
    // Show success message
    alert(`${ticker} 종목이 ${type === 'holdings' ? '포트폴리오에' : '관심 목록에'} 추가되었습니다!`);
    
    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setTicker('');
    setQuantity('');
    setPurchasePrice('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={type === 'holdings' ? '종목 추가' : '관심 종목 추가'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticker Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            티커 심볼 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              value={ticker}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="예: AAPL, TSLA, MSFT"
              className="w-full uppercase"
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <i className="ri-loader-4-line animate-spin text-gray-400"></i>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((stock) => (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{stock.ticker}</div>
                      <div className="text-sm text-gray-600">{stock.name}</div>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {stock.sector}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Stocks */}
        {!ticker && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인기 종목
            </label>
            <div className="flex flex-wrap gap-2">
              {popularStocks.slice(0, 6).map((stock) => (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() => handleSelectStock(stock)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
                >
                  {stock.ticker}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Holdings-specific fields */}
        {type === 'holdings' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 수량 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="보유 주식 수량"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평균 매수가 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="주당 평균 매수가"
                min="0"
                step="0.01"
              />
              {quantity && purchasePrice && (
                <p className="mt-2 text-sm text-gray-600">
                  총 투자금액: ${(parseFloat(quantity) * parseFloat(purchasePrice)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-information-line text-blue-600"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                {type === 'holdings' 
                  ? '실시간 시세는 자동으로 업데이트되며, 수익률이 계산됩니다.'
                  : '관심 종목으로 추가하면 실시간 시세를 모니터링할 수 있습니다.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <i className="ri-add-line mr-2"></i>
            추가하기
          </Button>
        </div>
      </form>
    </Modal>
  );
}
