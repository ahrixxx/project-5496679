import { useState, useEffect, useMemo } from 'react';
import Header from '../../components/feature/Header';
import TradeTable from './components/TradeTable';
import AddTradeModal from './components/AddTradeModal';
import Card from '../../components/base/Card';
import { fetchTrades, createTrade } from '../../api/tradeApi';
import type { Trade } from '../../mocks/trades';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userNickname] = useState('트레이더');

  // 1. 데이터 관리 (초기값은 빈 배열 [])
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTrades();
        setTrades(data || []); // 데이터 없으면 빈 배열이라도 넣어라!
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setTrades([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. 통계 계산기 (안전장치 포함)
  const stats = useMemo(() => {
    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return { count: 0, winRate: 0, avgConfidence: 0, bestPnl: 0 };
    }

    const count = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const winRate = Math.round((wins / count) * 100);
    const totalConfidence = trades.reduce((sum, t) => sum + t.confidence, 0);
    const avgConfidence = Math.round(totalConfidence / count);
    const bestPnl = Math.max(...trades.map(t => t.pnl));

    return { count, winRate, avgConfidence, bestPnl };
  }, [trades]);

  const handleAddTrade = () => {
    setIsAddModalOpen(true);
  };

  const handleTradeSubmit = async (trade: any) => {
    try {
      await createTrade(trade);
      alert('거래가 저장되었습니다! 📈');
      setIsAddModalOpen(false);
      
      const newData = await fetchTrades(); 
      setTrades(newData || []);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 실패 ㅠㅠ');
    }
  };

  // 진행률 계산
  const progressPercentage = Math.min((stats.count / 5) * 100, 100);
  const isInsightsUnlocked = stats.count >= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              안녕하세요, {userNickname}님! 👋
            </h2>
            <p className="text-blue-100 text-base">
              오늘도 성투하세요! 기록만이 살 길입니다.
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
                  개인화된 AI 피드백을 받으려면 {5 - stats.count}개의 거래를 더 기록하세요
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
                  {stats.count}/5
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* 통