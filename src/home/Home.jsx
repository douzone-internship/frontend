import React, { useState, useEffect } from 'react';
import { 
  FaStethoscope, 
  FaSearch, 
  FaChartLine, 
  FaShieldAlt, 
  FaStar, 
  FaUser 
} from 'react-icons/fa';
import { searchTreatments, searchHospitals, searchLocations } from '../api/home';

/**
 * Logo Component
 * 재사용 가능한 로고 컴포넌트
 */
const Logo = () => (
  <div className="flex items-center gap-2">
    <FaStethoscope size={24} className="text-primary" />
    <span className="text-xl font-bold text-gray-900">얼마닥</span>
  </div>
);

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

/**
 * Badge Component
 * AI 기능을 강조하는 배지
 */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
    <FaStar className="text-xs" />
    {children}
  </span>
);

/**
 * AutocompleteInput Component
 * 자동완성 기능이 있는 입력 컴포넌트
 */
const AutocompleteInput = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  onSelect, 
  placeholder, 
  required, 
  apiFetch,
  displayKey = null 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 디바운싱을 위한 타이머
  useEffect(() => {
    // API 호출
    const fetchSuggestions = async (searchTerm) => {
      setLoading(true);
      try {
        const data = await apiFetch(searchTerm);
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error('자동완성 조회 실패:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 1000); // 1초 대기

    return () => clearTimeout(timer);
  }, [inputValue, apiFetch]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(e); // 부모 컴포넌트에 알림
  };

  const handleSelectSuggestion = (suggestion) => {
    // 객체인 경우 displayKey로 표시, 문자열이면 그대로 사용
    const displayValue = displayKey ? suggestion[displayKey] : suggestion;
    setInputValue(displayValue);
    onSelect(name, suggestion);  // 전체 객체 또는 문자열 전달
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleBlur = () => {
    // 드롭다운 클릭 시간을 주기 위해 지연
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && suggestions.length > 0 && setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
        />
        {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">검색 중...</div>}
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              // 객체인 경우 displayKey로 표시, 문자열이면 그대로 사용
              const displayText = displayKey ? suggestion[displayKey] : suggestion;
              return (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {displayText}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/**
 * SearchForm Component
 * 검색 폼 with 자동완성 기능
 */
const SearchForm = () => {
  const [formData, setFormData] = useState({
    treatment: '',
    hospitalName: '',
    location: ''
  });

  const [selectedValues, setSelectedValues] = useState({
    treatment: '',
    hospitalName: '',
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelect = (name, value) => {
    // 진료명, 지역은 객체로 오므로 전체 객체 저장
    setSelectedValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // formData는 display용이므로 객체인 경우 display 속성만 저장
    let displayValue = value;
    if (name === 'treatment' && value?.clinicName) {
      displayValue = value.clinicName;
    } else if (name === 'location' && value?.locationName) {
      displayValue = value.locationName;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: displayValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 서버에서 선택된 값만 전송
    if (!selectedValues.treatment) {
      alert('진료명을 선택해주세요.');
      return;
    }
    
    console.log('검색 데이터:', selectedValues);
    // TODO: 실제 검색 API 호출
  };

  return (
    <div className="text-center space-y-10 mb-20">
      {/* Badge */}
      <div className="flex justify-center animate-fade-in">
        <Badge>AI 기반 가격 분석</Badge>
      </div>
      
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          비급여 진료,
          <br />
          <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
            투명하게 비교하세요
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          병원별 비급여 진료 항목의 가격을 한눈에 비교하고
          <br className="hidden md:block" />
          AI가 분석한 합리적인 추천을 받아보세요
        </p>
      </div>

      {/* Search Card with Glow Effect */}
      <div className="relative max-w-4xl mx-auto">
        {/* Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
        
        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 진료명 - 전체 너비 강조 */}
            <div className="space-y-2">
              <div className="relative">
                <AutocompleteInput
                  id="treatment"
                  name="treatment"
                  label="진료명"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  onSelect={handleSelect}
                  placeholder="진료, 질환명을 입력하세요 (예: MRI, CT, 도수치료)"
                  required={true}
                  apiFetch={searchTreatments}
                  displayKey="clinicName"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">선택 옵션</span>
              </div>
            </div>

            {/* 병원명 & 지역 - 2열 그리드 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <AutocompleteInput
                  id="hospitalName"
                  name="hospitalName"
                  label="병원명"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  onSelect={handleSelect}
                  placeholder="병원 이름 (선택사항)"
                  required={false}
                  apiFetch={searchHospitals}
                />
                <p className="text-xs text-gray-400 text-left pl-1">
                  특정 병원의 가격을 확인하세요
                </p>
              </div>
              
              <div className="space-y-2">
                <AutocompleteInput
                  id="location"
                  name="location"
                  label="지역 (시군구)"
                  value={formData.location}
                  onChange={handleInputChange}
                  onSelect={handleSelect}
                  placeholder="지역 선택 (선택사항)"
                  required={false}
                  apiFetch={searchLocations}
                  displayKey="locationName"
                />
                <p className="text-xs text-gray-400 text-left pl-1">
                  내 주변 병원 가격을 비교하세요
                </p>
              </div>
            </div>

            {/* Submit Button with Gradient */}
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary via-blue-500 to-secondary text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
            >
              <FaSearch className="text-lg" />
              가격 비교하기
            </button>
          </form>
        </div>
      </div>

      {/* Quick Info Tags */}
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-primary font-bold">✓</span>
          <span className="text-gray-700 font-medium">실시간 가격 정보</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-secondary font-bold">✓</span>
          <span className="text-gray-700 font-medium">AI 추천 시스템</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-blue-500 font-bold">✓</span>
          <span className="text-gray-700 font-medium">신뢰할 수 있는 데이터</span>
        </div>
      </div>
    </div>
  );
};

/**
 * FeatureCard Component
 * 개별 기능 카드
 */
const FeatureCard = ({ icon: Icon, title, description, colorClass }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-red-50 text-red-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[colorClass]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

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
    <section className="grid md:grid-cols-3 gap-6">
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
  const [user] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Background decorations */}
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