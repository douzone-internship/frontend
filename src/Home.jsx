import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { 
  FaStethoscope, 
  FaSearch, 
  FaChartLine, 
  FaShieldAlt, 
  FaStar, 
  FaUser 
} from 'react-icons/fa';

/**
 * Logo Component
 * 재사용 가능한 로고 컴포넌트
 */
const Logo = () => (
  <div className="logo">
    <FaStethoscope size={24} className="logo-icon" />
    <span className="logo-text">얼마닥</span>
  </div>
);

/**
 * Header Component
 * 인증 상태에 따라 다른 버튼을 보여주는 헤더
 */
const Header = ({ user, loading }) => (
  <header className="app-header">
    <div className="header-container">
      <Logo />
      <nav className="auth-nav">
        {loading ? (
          <div className="loading-skeleton" />
        ) : user ? (
          <a href="/profile" className="profile-button">
            <FaUser className="icon" />
            내 정보
          </a>
        ) : (
          <>
            <a href="/auth/login" className="login-link">로그인</a>
            <a href="/auth/signup" className="signup-button">회원가입</a>
          </>
        )}
      </nav>
    </div>
  </header>
);

/**
 * Badge Component
 * AI 기능을 강조하는 배지
 */
const Badge = ({ children }) => (
  <span className="badge">
    <FaStar className="badge-icon" />
    {children}
  </span>
);

/**
 * SearchForm Component
 * 검색 폼 with 상태 관리
 */
const SearchForm = () => {
  const [formData, setFormData] = useState({
    treatment: '',
    hospitalName: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('검색 데이터:', formData);
  };

  return (
    <div className="search-container">
      <Badge>AI 기반 가격 분석</Badge>
      
      <h1 className="main-title">
        비급여 진료,
        <br />
        <span className="gradient-text">투명하게 비교하세요</span>
      </h1>
      
      <p className="main-description">
        병원별 비급여 진료 항목의 가격을 한눈에 비교하고
        <br />
        AI가 분석한 합리적인 추천을 받아보세요
      </p>

      <div className="search-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="treatment">진료명</label>
            <input
              type="text"
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="진료, 질환명 입력하세요 (예: MRI, CT, 도수치료)"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="hospitalName">병원명</label>
              <input
                type="text"
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="병원 이름 (선택)"
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="location">지역 (시)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="지역 (선택)"
              />
            </div>
          </div>

          <button type="submit" className="search-button">
            <FaSearch className="icon" />
            가격 비교하기
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * FeatureCard Component
 * 개별 기능 카드
 */
const FeatureCard = ({ icon: Icon, title, description, colorClass }) => (
  <div className="feature-card">
    <div className={`feature-icon ${colorClass}`}>
      <Icon size={24} />
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

/**
 * Features Component
 * 주요 기능 소개 섹션
 */
const Features = () => {
  const features = [
    {
      icon: FaChartLine,
      title: '가격 비교',
      description: '여러 병원의 가격을 한눈에 비교',
      colorClass: 'primary'
    },
    {
      icon: FaStar,
      title: 'AI 분석',
      description: 'AI가 분석한 합리적인 추천',
      colorClass: 'secondary'
    },
    {
      icon: FaShieldAlt,
      title: '투명한 정보',
      description: '신뢰할 수 있는 가격 정보',
      colorClass: 'accent'
    }
  ];

  return (
    <section className="features-section">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </section>
  );
};

/**
 * HomePage Component
 * 메인 홈페이지 - 인증 상태 관리 포함
 */
const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="homepage-wrapper">
      <div className="background-gradient" />
      <div className="background-radial" />
      
      <Header user={user} loading={loading} />
      
      <main className="main-content">
        <div className="content-container">
          <SearchForm />
          <Features />
        </div>
      </main>
    </div>
  );
};

export default HomePage;