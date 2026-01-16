import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import SearchForm from '../components/home/SearchForm';
import Features from '../components/home/Features';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store' // 캐시 방지
        });
        
        if (!response.ok) {
          setUser(null);
          return;
        }
        
        const data = await response.json();
        if (data.authenticated && data.name) {
          setUser({ name: data.name, email: data.email });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Header user={user} loading={loading} />

      <main className="relative z-10 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm />
          <Features />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
