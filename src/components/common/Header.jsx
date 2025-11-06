import React from 'react';
import { FaUser } from 'react-icons/fa';
import Logo from './Logo';

/**
 * Header Component
 * 인증 상태에 따라 다른 버튼을 보여주는 헤더
 */
const Header = ({ user, loading }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <Logo />
      <nav className="flex items-center gap-4">
        {loading ? (
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ) : user ? (
          <a href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium">
            <FaUser className="text-sm" />
            내 정보
          </a>
        ) : (
          <>
            <a href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium">로그인</a>
            <a href="/auth/signup" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-sm hover:shadow-md">회원가입</a>
          </>
        )}
      </nav>
    </div>
  </header>
);

export default Header;
