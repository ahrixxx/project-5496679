
import { useState } from 'react';
import Modal from '../../../components/base/Modal';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import { behaviorTags } from '../../../mocks/trades';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trade: any) => void;
}

export default function AddTradeModal({ isOpen, onClose, onSubmit }: AddTradeModalProps) {
  const [formData, setFormData] = useState({
    ticker: '',
    action: 'Buy' as 'Buy' | 'Sell',
    price: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    intention: '',
    confidence: 50,
    behaviorTag: '',
    note: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate auto-captured market data
    const mockContext = {
      currentPrice: parseFloat(formData.price),
      rsi: Math.random() * 100,
      sma20: parseFloat(formData.price) * (0.95 + Math.random() * 0.1),
      sma50: parseFloat(formData.price) * (0.90 + Math.random() * 0.2),
      volatility: Math.random() * 0.5,
      sentiment: ['긍정적', '부정적', '중립적'][Math.floor(Math.random() * 3)]
    };

    const trade = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      pnl: (Math.random() - 0.5) * 20, // Random P/L for demo
      context: mockContext
    };

    onSubmit(trade);
    onClose();
    
    // Reset form
    setFormData({
      ticker: '',
      action: 'Buy',
      price: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      intention: '',
      confidence: 50,
      behaviorTag: '',
      note: ''
    });
    setShowPreview(false);
  };

  const handleAutoCapture = () => {
    if (formData.ticker && formData.price) {
      setShowPreview(true);
    }
  };

  const availableTags = formData.action === 'Buy' ? behaviorTags.buy : behaviorTags.sell;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 거래 추가" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">거래 유형</label>
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, action: 'Buy', behaviorTag: '' })}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                formData.action === 'Buy'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              매수
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, action: 'Sell', behaviorTag: '' })}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                formData.action === 'Sell'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              매도
            </button>
          </div>
        </div>

        {/* Basic Trade Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="티커 심볼"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
            placeholder="예: AAPL"
            required
          />
          <Input
            label="날짜"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="주당 가격"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
          <Input
            label="수량"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="0"
            required
          />
        </div>

        {/* Auto Capture Preview */}
        {formData.ticker && formData.price && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900">시장 상황 미리보기</h4>
              <Button
                type="button"
                onClick={handleAutoCapture}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <i className="ri-refresh-line mr-1"></i>
                데이터 캡처
              </Button>
            </div>
            {showPreview && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-blue-700">
                  <span className="font-medium">RSI:</span> {(Math.random() * 100).toFixed(1)}
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">변동성:</span> {(Math.random() * 0.5).toFixed(2)}
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">감정:</span> 긍정적
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">SMA 20:</span> ${(parseFloat(formData.price) * 0.98).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trade Intention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            왜 이 거래를 했나요?
          </label>
          <textarea
            value={formData.intention}
            onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={3}
            placeholder="이 거래에 대한 이유를 설명해주세요..."
            required
          />
        </div>

        {/* Confidence Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            신뢰도: {formData.confidence}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.confidence}
            onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>낮음 (0%)</span>
            <span>높음 (100%)</span>
          </div>
        </div>

        {/* Behavior Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            행동 유형
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFormData({ ...formData, behaviorTag: tag })}
                className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
                  formData.behaviorTag === tag
                    ? formData.action === 'Buy'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            추가 메모 (선택사항)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={2}
            placeholder="추가 관찰사항이나 상황..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" onClick={onClose}>
            취소
          </Button>
          <Button 
            type="submit"
            disabled={!formData.ticker || !formData.price || !formData.quantity || !formData.intention || !formData.behaviorTag}
          >
            추가
          </Button>
        </div>
      </form>
    </Modal>
  );
}
