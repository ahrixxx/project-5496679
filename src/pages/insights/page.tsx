
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';

export default function Insights() {
  const insights = [
    {
      title: "모멘텀 거래 패턴",
      description: "거래의 73%에서 강한 상승 모멘텀(RSI > 70) 이후에 매수하는 경향이 있습니다.",
      type: "behavior",
      impact: "high"
    },
    {
      title: "신뢰도 vs 성과",
      description: "최고 성과를 보이는 거래는 최대 신뢰도가 아닌 60-70% 신뢰도에서 발생합니다.",
      type: "performance",
      impact: "medium"
    },
    {
      title: "변동성 민감도",
      description: "펀더멘털이 강할 때도 높은 변동성 기간(>35%)에 매도할 가능성이 높습니다.",
      type: "behavior",
      impact: "high"
    }
  ];

  const behaviorData = [
    { tag: '모멘텀 추종자', count: 3, winRate: 67 },
    { tag: '펀더멘털 신봉자', count: 2, winRate: 100 },
    { tag: '실적 플레이', count: 1, winRate: 100 },
    { tag: '목표 달성자', count: 1, winRate: 100 },
    { tag: '공황 매도자', count: 1, winRate: 0 },
    { tag: '하락 매수자', count: 1, winRate: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI 인사이트</h1>
          <p className="text-gray-600 mt-2">거래 행동과 패턴에 대한 개인화된 분석</p>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">주요 행동 인사이트</h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact === 'high' ? '높은' : insight.impact === 'medium' ? '중간' : '낮은'} 영향
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">신뢰도 vs 결과</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">산점도 시각화</p>
                <p className="text-sm text-gray-400">신뢰도 수준 vs 거래 결과를 보여줍니다</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Behavior Heatmap */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">행동 패턴 분석</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">행동 태그</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">빈도</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">승률</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">성과</th>
                </tr>
              </thead>
              <tbody>
                {behaviorData.map((behavior, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{behavior.tag}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(behavior.count / 3) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{behavior.count}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        behavior.winRate >= 70 ? 'text-green-600' :
                        behavior.winRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {behavior.winRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`w-3 h-3 rounded-full ${
                        behavior.winRate >= 70 ? 'bg-green-500' :
                        behavior.winRate >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Commentary */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI 해설 및 추천</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <i className="ri-robot-line text-blue-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">주간 인사이트 요약</h3>
                <div className="space-y-3 text-blue-800">
                  <p>
                    <strong>패턴 인식:</strong> 거래에서 강한 모멘텀 추종 패턴을 보입니다. 
                    NVDA와 MSFT 같은 성장주에서는 잘 작동했지만, 시장 반전 시 위험을 고려해야 합니다.
                  </p>
                  <p>
                    <strong>신뢰도 보정:</strong> 흥미롭게도 가장 수익성 높은 거래는 높은 신뢰도(90%+)보다 
                    적당한 신뢰도(60-70%)에서 발생합니다. 이는 과신이 잘못된 타이밍이나 포지션 크기로 이어질 수 있음을 시사합니다.
                  </p>
                  <p>
                    <strong>추천사항:</strong> 신뢰도 수준에 따른 체계적인 포지션 크기 조절을 시도하고, 
                    모멘텀 플레이에 대해 급격한 반전으로부터 보호하기 위한 손절매 설정을 고려해보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
