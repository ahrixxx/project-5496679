
import { useState } from 'react';
import { Card } from '../../../components/base/Card';

const AIAnalysis = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot' as const,
      content: '안녕하세요! 차트 분석에 대해 궁금한 점이 있으시면 언제든 물어보세요. 기술적 지표, 패턴 분석, 지지/저항선 등에 대해 도움드릴 수 있습니다.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    '현재 추세는?',
    'RSI 지표 분석',
    'MACD 신호',
    '볼린저 밴드',
    '지지/저항선',
    '거래량 패턴',
    '차트 패턴',
    '단기 전망'
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // 차트 관련 키워드 체크
    const chartKeywords = ['차트', '기술적', 'RSI', 'MACD', '볼린저', '지지', '저항', '추세', '패턴', '거래량', '이평선', '스토캐스틱'];
    const isChartRelated = chartKeywords.some(keyword => message.includes(keyword));

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      let botResponse = '';
      
      if (!isChartRelated) {
        botResponse = '죄송합니다. 저는 차트 분석 전문 AI입니다. 기술적 지표, 차트 패턴, 지지/저항선 등 차트 분석 관련 질문만 답변드릴 수 있습니다.';
      } else {
        // 차트 관련 응답
        if (message.includes('추세')) {
          botResponse = '현재 TSLA는 상승 추세를 보이고 있습니다. 20일 이동평균선 위에서 거래되고 있으며, RSI는 65 수준으로 강세를 나타내고 있습니다. 다만 과매수 구간에 근접하고 있어 단기 조정 가능성도 있습니다.';
        } else if (message.includes('RSI')) {
          botResponse = 'RSI(14일) 현재 65.2로 강세 구간에 있습니다. 70 이상 과매수 구간에는 아직 도달하지 않았지만, 상승 모멘텀이 강한 상태입니다. 80 이상 시 단기 조정 가능성을 고려해야 합니다.';
        } else if (message.includes('MACD')) {
          botResponse = 'MACD 신호선이 기준선을 상향 돌파하며 골든크로스를 형성했습니다. 히스토그램도 양수로 전환되어 상승 모멘텀이 강화되고 있습니다. 단기적으로 긍정적인 신호입니다.';
        } else if (message.includes('볼린저')) {
          botResponse = '볼린저 밴드 상단에 근접해 있어 변동성이 확대되고 있습니다. 현재가가 상단 밴드를 돌파할 경우 추가 상승 가능성이 있으나, 밴드 수축 시 조정 가능성도 있습니다.';
        } else if (message.includes('지지') || message.includes('저항')) {
          botResponse = '주요 지지선은 $240 수준이며, 저항선은 $260 구간입니다. 현재 $250 근처에서 거래되고 있어 저항선 돌파 여부가 중요한 변곡점이 될 것으로 보입니다.';
        } else if (message.includes('거래량')) {
          botResponse = '최근 거래량이 평균 대비 30% 증가했습니다. 상승과 함께 거래량이 늘어나는 것은 긍정적인 신호로, 매수 세력의 유입을 의미합니다.';
        } else if (message.includes('패턴')) {
          botResponse = '차트상 상승 삼각형 패턴을 형성하고 있습니다. 저항선 돌파 시 목표가는 $275 수준으로 예상됩니다. 패턴 완성까지 거래량 확인이 중요합니다.';
        } else {
          botResponse = '차트 분석 결과, 전반적으로 강세 구간에 있습니다. 기술적 지표들이 긍정적인 신호를 보이고 있으나, 과매수 구간 진입 시 단기 조정 가능성을 염두에 두시기 바랍니다.';
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI 차트 분석 챗봇</h3>
      
      {/* 채팅 영역 */}
      <div className="h-80 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        
        {isTyping && (
          <div className="text-left mb-4">
            <div className="inline-block bg-white text-gray-800 border px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 빠른 질문 버튼들 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">빠른 질문:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
          placeholder="차트 분석에 대해 질문해보세요..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          전송
        </button>
      </div>
    </Card>
  );
};

export default AIAnalysis;
