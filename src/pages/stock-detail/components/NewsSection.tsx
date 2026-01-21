
import { Card } from '../../../components/base/Card';

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "테슬라, 3분기 실적 발표 예정 - 전기차 판매량 증가 전망",
      summary: "테슬라가 다음 주 3분기 실적을 발표할 예정이며, 분석가들은 전기차 판매량 증가를 예상하고 있습니다.",
      time: "2시간 전",
      source: "로이터"
    },
    {
      id: 2,
      title: "일론 머스크, 새로운 기가팩토리 건설 계획 발표",
      summary: "테슬라 CEO 일론 머스크가 아시아 지역에 새로운 기가팩토리 건설을 검토 중이라고 발표했습니다.",
      time: "4시간 전",
      source: "블룸버그"
    },
    {
      id: 3,
      title: "테슬라 자율주행 기술, 새로운 업데이트 출시",
      summary: "테슬라가 완전자율주행(FSD) 베타 버전의 새로운 업데이트를 출시하여 안전성과 성능이 크게 개선되었습니다.",
      time: "6시간 전",
      source: "테크크런치"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">최신 뉴스</h3>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
              {item.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{item.source}</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NewsSection;
