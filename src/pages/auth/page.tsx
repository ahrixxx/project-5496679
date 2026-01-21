import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';
import Input from '../../components/base/Input';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 임시로 홈으로 이동
    console.log('Form submitted:', formData);
    navigate('/');
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시도');
    // 카카오 로그인 로직은 나중에 구현
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="https://static.readdy.ai/image/3869d4e65a0e781b94686710cd182e7c/302945796ab5c2b1b0706ba129978fd5.png" 
              alt="CrossAlpha Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? '로그인' : '회원가입'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin ? '거래 일지를 기록하고 AI 인사이트를 받아보세요' : '새로운 계정을 만들어보세요'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.443 4.615 3.686 6.143-.203.748-.794 2.938-.916 3.407-.145.558.204.55.43.4.18-.12 2.91-1.93 3.377-2.242.78.14 1.588.217 2.423.217 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
              </svg>
              카카오로 {isLogin ? '로그인' : '시작하기'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="닉네임"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="사용할 닉네임을 골라주세요"
                required
              />
            )}

            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="8자 이상 입력하세요"
              required
            />

            {!isLogin && (
              <Input
                label="비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <span className="ml-2 text-gray-600">로그인 상태 유지</span>
                </label>
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap">
                  비밀번호 찾기
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', confirmPassword: '', username: '' });
              }}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </div>

          {/* Terms */}
          {!isLogin && (
            <p className="mt-6 text-xs text-gray-500 text-center">
              회원가입 시{' '}
              <button type="button" className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
                이용약관
              </button>
              {' '}및{' '}
              <button type="button" className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
                개인정보처리방침
              </button>
              에 동의하게 됩니다.
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-1"></i>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
