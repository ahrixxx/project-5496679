import { useState } from 'react';
import Header from './components/feature/Header';
import TradeTable from './pages/home/components/TradeTable';
import AddTradeModal from './pages/home/components/AddTradeModal';
import Card from './components/base/Card';
import { createTrade } from './api/tradeApi'; // 1. 저장 기능 가져오기

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // (나중에는 이것도 서버에서 가져오게 바꿀 예정)
  const [tradeCount] = useState(6); 
  const [userNickname] = useState('트레이더');

  const handleAddTrade = () => {
    setIsAddModalOpen(true);
  };

  // 2. [핵심] 거래 저장 함수 업그레이드!
  const handleTradeSubmit = async (trade: any) => {
    try {
      // 서버에 "이거 저장해줘!" 하고 요청
      await createTrade(trade);
      
      alert('거래가 성공적으로 저장되었습니다! 🎉');
      setIsAddModalOpen(false); // 모달 닫기
      
      // 3. 화면을 새로고침해서 방금 추가한 데이터 보여주기
      // (나중에는 새로고침 없이 부드럽게 추가되도록 고칠 거예요)
      window.location.reload(); 
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했어요 ㅠㅠ');
    }
  };

  const progressPercentage = Math.min((tradeCount / 5) * 100, 100);
  const isInsightsUnlocked = tradeCount >= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 배너 */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              안녕하세요, {userNickname}님! 👋
            </h2>
            <p className="text-blue-100 text-base">
              오늘도 매매일지를 기록해보세요. AI가 당신의 거래 패턴을 분석해드립니다.
            </p>
          </div>
        </Card>

        {/* 진행률 카드 */}
        {!isInsightsUnlocked && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  AI 인사이트 진행률
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  개인화된 AI 피드백을 받으려면 {5 - tradeCount}개의 거래를 더 기록하세요
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-blue-900 font-medium text-sm">
                  {tradeCount}/5
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* 통계 카드들 (일단 모양만 유지) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-file-list-3-line text-blue-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">총 거래</p>
                <p className="text-2xl font-bold text-gray-900">{tradeCount}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-arrow-up-line text-green-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">승률</p>
                <p className="text-2xl font-bold text-green-600">67%</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-brain-line text-purple-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">평균 신뢰도</p>
                <p className="text-2xl font-bold text-gray-900">77%</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-trophy-line text-yellow-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">최고 거래</p>
                <p className="text-2xl font-bold text-green-600">+15.8%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 거래 목록 테이블 */}
        <TradeTable onAddTrade={handleAddTrade} />

        {/* 거래 추가 모달 */}
        <AddTradeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleTradeSubmit}
        />
      </main>
    </div>
  );
}