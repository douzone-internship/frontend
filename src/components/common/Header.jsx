import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
/**
 * Header Component
 * 인증 상태에 따라 다른 버튼을 보여주는 헤더
 */
const Header = ({ user, loading }) => {
  const location = useLocation();

  return (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <Logo />
      <nav className="flex items-center gap-4">
        {loading ? (
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-4">
            {/* Info placeholder */}
            <span className="text-gray-700 font-medium">{user.name}님 환영합니다!</span>
            <button
              onClick={async () => {
                // 1. 로컬 스토리지 전체 삭제
                localStorage.clear();
                sessionStorage.clear();
                
                // 2. 모든 쿠키 삭제 (여러 경로 시도)
                const deleteCookie = (name) => {
                  const paths = ['/', '/api', '/api/auth'];
                  const domains = [window.location.hostname, '.' + window.location.hostname, ''];
                  
                  paths.forEach(path => {
                    domains.forEach(domain => {
                      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' + path + (domain ? ';domain=' + domain : '');
                    });
                  });
                };
                
                // JSESSIONID 및 기타 쿠키 삭제
                document.cookie.split(";").forEach(function(c) {
                  const cookieName = c.trim().split("=")[0];
                  deleteCookie(cookieName);
                });
                
                try {
                  // 3. 백엔드 로그아웃 호출
                  await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                } catch (error) {
                  console.error('로그아웃 요청 실패:', error);
                }
                
                // 4. 강제로 홈페이지로 이동 및 새로고침
                setTimeout(() => {
                  window.location.replace('/');
                }, 100);
              }}
              className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              state={{ from: location.pathname }}
              className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
            >
              로그인
            </Link>
          </div>
        )}
      </nav>
    </div>
  </header>
  );
};

export default Header;
