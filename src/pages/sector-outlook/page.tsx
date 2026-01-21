import { useState } from 'react';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';

interface Sector {
  id: string;
  name: string;
  emoji: string;
  return: number;
  color: string;
}

interface SectorSummary {
  id: string;
  sectorId: string;
  sectorName: string;
  title: string;
  summary: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyPoints: string[];
  sources: Array<{
    name: string;
    date: string;
    url: string;
  }>;
}

const availableSectors: Sector[] = [
  { 
    id: 'tech', 
    name: '기술', 
    emoji: '💻',
    return: 6.7,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'finance', 
    name: '금융', 
    emoji: '🏦',
    return: 3.2,
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    id: 'retail', 
    name: '소비재', 
    emoji: '🛍️',
    return: -1.8,
    color: 'from-amber-500 to-amber-600'
  }
];

export default function SectorOutlook() {
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['tech', 'finance']);
  const [selectedNewsTab, setSelectedNewsTab] = useState('tech');
  const [selectedSummary, setSelectedSummary] = useState<SectorSummary | null>(null);

  const sectorSummaries: SectorSummary[] = [
    {
      id: '1',
      sectorId: 'tech',
      sectorName: '기술',
      title: 'AI 기술 발전으로 기술 섹터 강세 지속',
      summary: 'AI 반도체와 클라우드 서비스 수요 급증으로 기술 섹터가 시장을 주도하고 있습니다. 특히 삼성전자와 SK하이닉스의 HBM 메모리 공급 부족으로 주가가 크게 상승했습니다.',
      date: '2024-01-15',
      sentiment: 'positive',
      keyPoints: ['AI 반도체 수요 300% 증가', 'HBM 메모리 공급 부족', '클라우드 서비스 확장', '메타버스 기술 발전'],
      sources: [
        { name: '로이터', date: '2024-01-15', url: '#' },
        { name: '블룸버그', date: '2024-01-15', url: '#' },
        { name: 'CNBC', date: '2024-01-14', url: '#' }
      ]
    },
    {
      id: '2',
      sectorId: 'tech',
      sectorName: '기술',
      title: 'HBM 메모리 공급 부족으로 반도체 섹터 급등',
      summary: 'AI 서버용 HBM 메모리 수요가 폭발적으로 증가하면서 SK하이닉스와 삼성전자의 실적 개선이 예상됩니다. 3나노 공정 기술 발전도 긍정적입니다.',
      date: '2024-01-15',
      sentiment: 'positive',
      keyPoints: ['HBM3E 메모리 공급 부족', 'AI 서버 수요 급증', '3나노 공정 기술 발전', '실적 개선 전망'],
      sources: [
        { name: '한국경제', date: '2024-01-15', url: '#' },
        { name: '로이터', date: '2024-01-14', url: '#' }
      ]
    },
    {
      id: '3',
      sectorId: 'finance',
      sectorName: '금융',
      title: '금리 인하 기대감으로 금융 섹터 상승세',
      summary: '중앙은행의 금리 인하 가능성이 높아지면서 은행주가 상승하고 있습니다. 디지털 뱅킹과 핀테크 서비스 확산도 긍정적 요인입니다.',
      date: '2024-01-15',
      sentiment: 'positive',
      keyPoints: ['금리 인하 기대감', '디지털 뱅킹 확산', '핀테크 업체 성장', '대출 수요 증가'],
      sources: [
        { name: '블룸버그', date: '2024-01-15', url: '#' },
        { name: '매일경제', date: '2024-01-15', url: '#' },
        { name: '연합뉴스', date: '2024-01-14', url: '#' }
      ]
    },
    {
      id: '4',
      sectorId: 'finance',
      sectorName: '금융',
      title: '디지털 뱅킹 혁신으로 금융 섹터 변화',
      summary: '모바일 뱅킹과 AI 기반 금융 서비스가 빠르게 확산되면서 전통 금융기관들의 디지털 전환이 가속화되고 있습니다.',
      date: '2024-01-14',
      sentiment: 'positive',
      keyPoints: ['모바일 뱅킹 사용자 증가', 'AI 금융 서비스 도입', '디지털 전환 가속화', '핀테크 협업 확대'],
      sources: [
        { name: 'CNBC', date: '2024-01-14', url: '#' },
        { name: '한국경제', date: '2024-01-14', url: '#' }
      ]
    },
    {
      id: '5',
      sectorId: 'retail',
      sectorName: '소비재',
      title: '소비 심리 회복으로 소비재 섹터 개선',
      summary: '경기 회복 기대감으로 소비 심리가 개선되면서 유통업체와 이커머스 플랫폼의 실적이 좋아지고 있습니다.',
      date: '2024-01-14',
      sentiment: 'positive',
      keyPoints: ['소비 심리 회복', '유통업체 실적 개선', '온라인 쇼핑 증가', '명품 소비 증가'],
      sources: [
        { name: '매일경제', date: '2024-01-14', url: '#' },
        { name: '연합뉴스', date: '2024-01-14', url: '#' },
        { name: '로이터', date: '2024-01-13', url: '#' }
      ]
    },
    {
      id: '6',
      sectorId: 'retail',
      sectorName: '소비재',
      title: '이커머스 플랫폼 성장세 지속',
      summary: '온라인 쇼핑 시장이 지속적으로 성장하면서 이커머스 플랫폼들의 매출이 증가하고 있습니다. 라이브 커머스와 소셜 커머스도 빠르게 확대되고 있습니다.',
      date: '2024-01-13',
      sentiment: 'positive',
      keyPoints: ['온라인 쇼핑 시장 확대', '라이브 커머스 성장', '소셜 커머스 확산', '물류 인프라 개선'],
      sources: [
        { name: '블룸버그', date: '2024-01-13', url: '#' },
        { name: 'CNBC', date: '2024-01-13', url: '#' }
      ]
    }
  ];

  const toggleSector = (sectorId: string) => {
    if (selectedSectors.includes(sectorId)) {
      const newSelectedSectors = selectedSectors.filter(id => id !== sectorId);
      setSelectedSectors(newSelectedSectors);
      if (selectedNewsTab === sectorId && newSelectedSectors.length > 0) {
        setSelectedNewsTab(newSelectedSectors[0]);
      }
    } else {
      setSelectedSectors([...selectedSectors, sectorId]);
      setSelectedNewsTab(sectorId);
    }
  };

  const getSummariesForSector = (sectorId: string) => {
    return sectorSummaries.filter(summary => summary.sectorId === sectorId);
  };

  const handleSummaryClick = (summary: SectorSummary) => {
    setSelectedSummary(summary);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">섹터 전망</h1>
          <p className="text-gray-600 mt-1">주요 업종의 시장 동향과 성과를 추적하세요</p>
        </div>

        {/* Sector Heatmap */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">업종 히트맵</h2>
            <p className="text-sm text-gray-600">
              {selectedSectors.length}개 업종 추적 중
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableSectors.map((sector) => {
              const isSelected = selectedSectors.includes(sector.id);
              
              return (
                <div
                  key={sector.id}
                  className="relative cursor-default"
                >
                  <div
                    onClick={() => !isSelected && toggleSector(sector.id)}
                    className={`bg-gradient-to-br ${sector.color} rounded-lg p-5 text-white transition-all ${
                      !isSelected ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
                    }`}
                  >
                    {/* Remove Button */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSector(sector.id);
                        }}
                        className="absolute top-3 right-3 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <i className="ri-close-line text-white text-sm"></i>
                      </button>
                    )}
                    
                    <div className="text-4xl mb-2">{sector.emoji}</div>
                    <h3 className="text-xl font-bold mb-1">{sector.name}</h3>
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className={`text-2xl font-bold ${sector.return >= 0 ? 'text-white' : 'text-white/90'}`}>
                        {sector.return >= 0 ? '+' : ''}{sector.return}%
                      </span>
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-xs bg-white/20 px-2.5 py-1 rounded-full inline-block">
                        ✓ 추가됨
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Summaries Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">업종별 요약</h2>
          </div>
          
          {selectedSectors.length > 0 && (
            <>
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {selectedSectors.map((sectorId) => {
                  const sector = availableSectors.find(s => s.id === sectorId);
                  return (
                    <button
                      key={sectorId}
                      onClick={() => setSelectedNewsTab(sectorId)}
                      className={`px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                        selectedNewsTab === sectorId
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-2">{sector?.emoji}</span>
                      {sector?.name}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-4">
                {getSummariesForSector(selectedNewsTab).map((summary) => (
                  <div
                    key={summary.id}
                    onClick={() => handleSummaryClick(summary)}
                    className="p-5 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer transition-all bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            summary.sentiment === 'positive' ? 'bg-green-500' :
                            summary.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                          }`}></span>
                          <h3 className="font-semibold text-gray-900">{summary.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{summary.summary}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="ri-calendar-line mr-1"></i>
                            {summary.date}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <i className="ri-arrow-right-line text-gray-400 text-xl"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {selectedSectors.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-newspaper-line text-gray-400 text-3xl"></i>
              </div>
              <p className="text-gray-500">업종을 선택하면 관련 요약을 확인할 수 있습니다</p>
            </div>
          )}
        </Card>

        {/* Summary Detail Modal */}
        {selectedSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        selectedSummary.sentiment === 'positive' ? 'bg-green-500' :
                        selectedSummary.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-sm font-medium text-gray-600">{selectedSummary.sectorName} 섹터</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 pr-4">{selectedSummary.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedSummary(null)}
                    className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="flex items-center space-x-3 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <i className="ri-calendar-line mr-1"></i>
                    {selectedSummary.date}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-file-text-line text-blue-600 mr-2"></i>
                    요약
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedSummary.summary}</p>
                </div>
                
                <div className="bg-white border border-gray-200 p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="ri-list-check text-blue-600 mr-2"></i>
                    주요 포인트
                  </h3>
                  <div className="space-y-3">
                    {selectedSummary.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 flex-1">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 출처 정보 섹션 */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="ri-newspaper-line text-gray-600 mr-2"></i>
                    출처
                  </h3>
                  <div className="flex items-center space-x-4">
                    {selectedSummary.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-24 h-12 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                        title={`${source.name} - ${source.date}`}
                      >
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                          {source.name}
                        </span>
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    본 분석은 복수의 신뢰할 수 있는 언론사 및 금융 데이터 제공업체의 정보를 종합하여 작성되었습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
