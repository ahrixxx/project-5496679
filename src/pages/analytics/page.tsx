import { useState } from 'react';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';

export default function Analytics() {
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  
  const exchangeRate = 1320; // USD to KRW rate
  
  const formatCurrency = (amount: number) => {
    if (currency === 'KRW') {
      const krwAmount = Math.round(amount * exchangeRate);
      return `₩${krwAmount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const sectorData = [
    { sector: '기술', trades: 5, pnl: 12.3, allocation: 83 },
    { sector: '소비재', trades: 1, pnl: -2.1, allocation: 17 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">분석 대시보드</h1>
            <p className="text-gray-600 mt-1">거래 성과와 패턴에 대한 종합적인 분석</p>
          </div>
          
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(prev => prev === 'USD' ? 'KRW' : 'USD')}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-exchange-line mr-2"></i>
            {currency === 'USD' ? '원화로 보기' : '달러로 보기'}
          </button>
        </div>

        {/* Compact KPI Row - Only 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-trending-up-line text-xl text-green-600"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">총 수익률</h3>
                  <p className="text-3xl font-bold text-green-600 mt-0.5">+8.2%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">2024년 1월부터</p>
                <p className="text-sm text-gray-700 font-medium mt-1">6건 거래</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-target-line text-xl text-emerald-600"></i>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">승률</h3>
                  <p className="text-3xl font-bold text-emerald-600 mt-0.5">67%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">6건 중 4건 수익</p>
                <p className="text-sm text-gray-700 font-medium mt-1">평균 +11.4%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Core Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Performance */}
          <Card className="lg:col-span-2 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 성과</h2>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="ri-line-chart-line text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-sm">월별 손익 차트</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              분석 기간: 2024.01–2024.04 · 총 거래 수: 6건
            </div>
          </Card>

          {/* Sector Allocation */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">섹터 배분</h2>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <i className="ri-pie-chart-line text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-sm">섹터 분포</p>
              </div>
            </div>
            <div className="space-y-3">
              {sectorData.map((sector, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${
                      index === 0 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{sector.allocation}%</p>
                    <p className={`text-xs font-medium ${sector.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sector.pnl > 0 ? '+' : ''}{sector.pnl}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trade Statistics - Single Compact Card */}
        <Card className="mb-6 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">거래 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 수익</span>
              <span className="font-semibold text-green-600">+11.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 손실</span>
              <span className="font-semibold text-red-600">-2.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">수익 팩터</span>
              <span className="font-semibold text-green-600">2.85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 보유 기간</span>
              <span className="font-semibold text-gray-900">8.5일</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">최대 손실폭</span>
              <span className="font-semibold text-red-600">-3.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">변동성</span>
              <span className="font-semibold text-gray-900">18.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">샤프 비율</span>
              <span className="font-semibold text-green-600">1.24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">베타</span>
              <span className="font-semibold text-gray-900">1.15</span>
            </div>
          </div>
        </Card>

        {/* Behavior Tag Performance Table */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">행동 태그별 성과</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 font-semibold text-sm text-gray-700">행동 패턴</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-sm text-gray-700">거래 수</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-sm text-gray-700">승률</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-sm text-gray-700">평균 수익률</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-sm text-gray-700">총 손익</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                      모멘텀 추종자
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-gray-900">2</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">100%</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">+12.0%</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">{formatCurrency(445)}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                      펀더멘털 신봉자
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-gray-900">2</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">100%</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">+13.9%</td>
                  <td className="py-2.5 px-3 text-sm text-green-600 font-semibold">{formatCurrency(612)}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      공황 매도자
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-gray-900">1</td>
                  <td className="py-2.5 px-3 text-sm text-red-600 font-semibold">0%</td>
                  <td className="py-2.5 px-3 text-sm text-red-600 font-semibold">-3.5%</td>
                  <td className="py-2.5 px-3 text-sm text-red-600 font-semibold">{formatCurrency(-86)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
