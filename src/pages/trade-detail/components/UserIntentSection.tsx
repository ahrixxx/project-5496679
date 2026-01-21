
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

interface UserIntentSectionProps {
  trade: Trade;
}

export default function UserIntentSection({ trade }: UserIntentSectionProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBehaviorTagColor = (action: string, tag: string) => {
    if (action === 'Buy') {
      if (tag.includes('Earnings')) return 'bg-purple-100 text-purple-800';
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceDescription = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Moderate';
    if (confidence >= 40) return 'Low';
    return 'Very Low';
  };

  // Mock emotional note based on trade characteristics
  const getEmotionalNote = (trade: Trade) => {
    if (trade.behaviorTag.includes('Panic')) return 'Felt anxious about market volatility';
    if (trade.behaviorTag.includes('Momentum')) return 'Excited about strong price action';
    if (trade.behaviorTag.includes('Dip')) return 'Confident in long-term value';
    if (trade.behaviorTag.includes('Target')) return 'Satisfied with profit achievement';
    if (trade.behaviorTag.includes('Earnings')) return 'Optimistic about upcoming results';
    return 'Calm and analytical decision';
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Decision Process</h3>
      
      <div className="space-y-4">
        {/* Trade Intent */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="ri-question-line mr-2 text-blue-600"></i>
            Why I Made This Trade
          </h4>
          <p className="text-gray-900 text-sm leading-relaxed">
            {trade.note}
          </p>
        </div>

        {/* Confidence Level */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <i className="ri-gauge-line mr-2 text-green-600"></i>
            Confidence Level
          </h4>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">{trade.confidence}%</span>
            <span className="text-sm text-gray-600">{getConfidenceDescription(trade.confidence)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getConfidenceColor(trade.confidence)}`}
              style={{ width: `${trade.confidence}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Behavior Tag */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <i className="ri-price-tag-3-line mr-2 text-purple-600"></i>
            Behavior Pattern
          </h4>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-full ${getBehaviorTagColor(trade.action, trade.behaviorTag)}`}>
              {trade.behaviorTag}
            </span>
            <div className="text-right">
              <div className="text-xs text-gray-500">Trade Type</div>
              <div className={`text-sm font-medium ${trade.action === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                {trade.action}
              </div>
            </div>
          </div>
        </div>

        {/* Emotional State */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="ri-heart-pulse-line mr-2 text-pink-600"></i>
            Emotional Context
          </h4>
          <p className="text-sm text-gray-700 italic">
            "{getEmotionalNote(trade)}"
          </p>
        </div>

        {/* Decision Quality Insight */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <i className="ri-brain-line text-blue-600 mr-2 mt-0.5"></i>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Decision Analysis</h4>
              <p className="text-xs text-blue-700">
                Your {trade.confidence}% confidence level was {trade.confidence > 70 ? 'well-calibrated' : 'conservative'} for this {trade.behaviorTag.toLowerCase()} trade. 
                {trade.pnl > 0 
                  ? ' The positive outcome validates your decision process.' 
                  : ' Consider reviewing the factors that led to this decision for future trades.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
