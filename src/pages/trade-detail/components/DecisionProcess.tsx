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

interface DecisionProcessProps {
  trade: Trade;
}

export default function DecisionProcess({ trade }: DecisionProcessProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBehaviorTagColor = (action: string, tag: string) => {
    if (action === 'Buy') {
      if (tag.includes('실적')) return 'bg-purple-100 text-purple-800 border-purple-200';
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceDescription = (confidence: number) => {
    if (confidence >= 90) return '매우 높음';
    if (confidence >= 80) return '높음';
    if (confidence >= 60) return '보통';
    if (confidence >= 40) return '낮음';
    return '매우 낮음';
  };

  // Mock emotional note based on trade characteristics
  const getEmotionalNote = (trade: Trade) => {
    if (trade.behaviorTag.includes('공황')) return '시장 변동성에 대해 불안감을 느꼈음';
    if (trade.behaviorTag.includes('모멘텀')) return '강한 가격 움직임에 흥미를 느꼈음';
    if (trade.behaviorTag.includes('하락')) return '장기적 가치에 대한 확신이 있었음';
    if (trade.behaviorTag.includes('목표')) return '수익 달성에 만족감을 느꼈음';
    if (trade.behaviorTag.includes('실적')) return '향후 결과에 대해 낙관적이었음';
    return '차분하고 분석적인 결정이었음';
  };

  const getDecisionAnalysis = (trade: Trade) => {
    const confidenceLevel = trade.confidence > 70 ? '잘 보정된' : '보수적인';
    const outcome = trade.pnl > 0 ? '긍정적' : '부정적';
    
    if (outcome === '긍정적') {
      return `이 ${trade.behaviorTag} 거래에서 ${trade.confidence}%의 신뢰도는 ${confidenceLevel} 수준이었습니다. 긍정적인 결과는 귀하의 의사결정 과정을 검증하고 좋은 시장 타이밍을 보여줍니다.`;
    } else {
      return `이 ${trade.behaviorTag} 거래에서 ${trade.confidence}%의 신뢰도는 ${confidenceLevel} 수준이었습니다. 향후 거래를 위해 이 결정으로 이어진 요인들을 검토해보는 것을 고려해보세요.`;
    }
  };

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <i className="ri-brain-line text-blue-600 text-lg"></i>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">의사결정 과정</h3>
        <div className="ml-auto">
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            핵심 학습 섹션
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Trade Intent */}
          <div className="p-6 bg-white rounded-lg border border-blue-200 shadow-sm h-[180px] flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-start">
              <i className="ri-question-line mr-3 text-blue-600 text-xl mt-0.5"></i>
              <span>왜 이 거래를 했는가</span>
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 flex-1 flex items-center">
              <p className="text-gray-900 leading-relaxed font-medium">
                "{trade.note}"
              </p>
            </div>
          </div>

          {/* Behavior Pattern */}
          <div className="p-6 bg-white rounded-lg border border-blue-200 shadow-sm h-[280px] flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-start">
              <i className="ri-price-tag-3-line mr-3 text-purple-600 text-xl mt-0.5"></i>
              <span>행동 패턴</span>
            </h4>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex px-4 py-3 text-lg font-semibold rounded-full border-2 ${getBehaviorTagColor(trade.action, trade.behaviorTag)}`}>
                {trade.behaviorTag}
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-500">거래 유형</div>
                <div className={`text-lg font-bold ${trade.action === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.action === 'Buy' ? '🟢' : '🔴'} {trade.action === 'Buy' ? '매수' : '매도'}
                </div>
              </div>
            </div>

            {/* Emotional Context */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 flex-1 flex flex-col justify-center">
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <i className="ri-heart-pulse-line mr-2 text-pink-600"></i>
                감정적 맥락
              </h5>
              <p className="text-sm text-gray-700 italic">
                "{getEmotionalNote(trade)}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Confidence Level */}
          <div className="p-6 bg-white rounded-lg border border-blue-200 shadow-sm h-[180px] flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-start">
              <i className="ri-gauge-line mr-3 text-green-600 text-xl mt-0.5"></i>
              <span>신뢰도 수준</span>
            </h4>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-gray-900 mb-1">{trade.confidence}%</div>
                <div className="text-sm text-gray-600">{getConfidenceDescription(trade.confidence)}</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getConfidenceColor(trade.confidence)}`}
                  style={{ width: `${trade.confidence}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Decision Quality Insight */}
          <div className="p-6 bg-white rounded-lg border border-blue-200 shadow-sm h-[280px] flex flex-col">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                <i className="ri-lightbulb-line text-green-600 text-lg"></i>
              </div>
              <div className="flex-1 flex flex-col h-full">
                <h4 className="text-lg font-semibold text-green-900 mb-3">의사결정 분석</h4>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex-1 flex items-center">
                  <p className="text-sm text-green-800 leading-relaxed">
                    {getDecisionAnalysis(trade)}
                  </p>
                </div>
                
                {/* Performance Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">결과 성과:</span>
                  <div className="flex items-center">
                    <span className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.pnl >= 0 ? '✓' : '✗'} {trade.pnl >= 0 ? '성공' : '학습 기회'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
