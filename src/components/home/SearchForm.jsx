import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Badge from '../common/Badge';
import AutocompleteInput from '../common/AutocompleteInput';
import { searchTreatments, searchHospitals, searchLocations } from '../../api/home';

/**
 * SearchForm Component
 * 검색 폼 with 자동완성 기능
 */
const SearchForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef(null);
  
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
    
    // 필수 항목 검증
    if (!selectedValues.treatment) {
      alert('진료명을 선택해주세요.');
      return;
    }
    
    if (!selectedValues.location) {
      alert('지역을 선택해주세요.');
      return;
    }
    
    // 로딩 시작
    setIsLoading(true);
    
    // 검색 데이터 구성
    const searchData = {
      // API 요청용 코드
      clinicCode: selectedValues.treatment?.clinicCode,
      hospitalName: selectedValues.hospitalName || null,
      sidoCode: selectedValues.location?.sidoCode || null,
      sigguCode: selectedValues.location?.sgguCode || null,
      
      // 화면 표시용 이름
      clinicName: selectedValues.treatment?.clinicName,
      locationName: selectedValues.location?.locationName || null
    };
    
    // 결과 페이지로 이동 (state로 데이터 전달)
    navigate('/results', { state: searchData });
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      setTimeout(() => {
        infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
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
              <p className="text-xs text-gray-500 text-left pl-1 flex items-center gap-1">
                <span className="text-primary">💡</span>
                정확한 진료명을 입력하시면 더 나은 결과를 제공합니다
              </p>
            </div>

            {/* 지역 & 병원명 - 2열 그리드 (순서 변경) */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <AutocompleteInput
                  id="location"
                  name="location"
                  label="지역 (시군구)"
                  value={formData.location}
                  onChange={handleInputChange}
                  onSelect={handleSelect}
                  placeholder="지역을 선택하세요"
                  required={true}
                  apiFetch={searchLocations}
                  displayKey="locationName"
                />
                <p className="text-xs text-gray-500 text-left pl-1 flex items-center gap-1">
                  <span className="text-primary">*</span>
                  내 주변 병원 가격을 비교하세요
                </p>
              </div>
              
              <div className="space-y-2">
                <AutocompleteInput
                  id="hospitalName"
                  name="hospitalName"
                  label="병원명"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  onSelect={handleSelect}
                  placeholder={selectedValues.location ? "병원 이름 (선택사항)" : "지역을 먼저 선택하세요"}
                  required={false}
                  apiFetch={(name) => {
                    // 시군구 코드가 있으면 시군구 코드 사용, 없으면 시도 코드 사용
                    const locationCode = selectedValues.location?.sgguCode || selectedValues.location?.sidoCode;
                    return searchHospitals(name, locationCode);
                  }}
                  disabled={!selectedValues.location}
                />
                <p className="text-xs text-gray-400 text-left pl-1">
                  특정 병원의 가격을 확인하세요
                </p>
              </div>
            </div>

            {/* Submit Button with Gradient */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary via-blue-500 to-secondary text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  검색 중...
                </>
              ) : (
                <>
                  <FaSearch className="text-lg" />
                  가격 비교하기
                </>
              )}
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

      {/* 비급여 진료 정보 섹션 (하단 확장형) */}
      <div ref={infoRef} className="max-w-4xl mx-auto">
        <button
          onClick={toggleInfo}
          className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-blue-500 p-3 rounded-full">
                <FaInfoCircle className="text-white text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">비급여 진료란 무엇인가요?</h3>
                <p className="text-sm text-gray-600 mt-1">건강보험이 적용되지 않는 진료에 대해 알아보세요</p>
              </div>
            </div>
            <div className="text-primary text-2xl">
              {showInfo ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
        </button>

        {/* 확장 가능한 정보 컨텐츠 */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showInfo ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
            {/* 정의 */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                정의
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                비급여 진료는 <strong className="text-primary">건강보험이 적용되지 않는 의료 서비스</strong>로, 
                환자가 치료 비용을 <strong>전액 본인이 부담</strong>해야 하는 진료 항목입니다.
              </p>
            </div>

            {/* 주요 특징 */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                주요 특징
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <span className="text-primary font-bold mt-1">•</span>
                  <div>
                    <strong className="text-gray-900">병원마다 가격이 다릅니다</strong>
                    <p className="text-gray-600 text-sm mt-1">각 의료기관이 자율적으로 가격을 책정하므로 병원별 비용 차이가 큽니다.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <span className="text-secondary font-bold mt-1">•</span>
                  <div>
                    <strong className="text-gray-900">본인 부담 100%</strong>
                    <p className="text-gray-600 text-sm mt-1">건강보험 혜택을 받을 수 없어 전액을 환자가 부담합니다.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <span className="text-blue-500 font-bold mt-1">•</span>
                  <div>
                    <strong className="text-gray-900">가격 비교 필수</strong>
                    <p className="text-gray-600 text-sm mt-1">동일한 진료라도 병원에 따라 비용이 크게 차이날 수 있습니다.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 대표적인 비급여 진료 항목 */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                대표적인 비급여 진료 항목
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">MRI, CT 등</p>
                  <p className="text-sm text-gray-600 mt-1">고가 검사</p>
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">도수치료</p>
                  <p className="text-sm text-gray-600 mt-1">물리치료</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">임플란트</p>
                  <p className="text-sm text-gray-600 mt-1">치과 진료</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">미용/성형</p>
                  <p className="text-sm text-gray-600 mt-1">선택 진료</p>
                </div>
              </div>
            </div>

            {/* 왜 비교가 중요한가? */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                왜 가격 비교가 중요한가요?
              </h3>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-lg border-2 border-yellow-200">
                <p className="text-gray-800 leading-relaxed">
                  같은 MRI 검사도 병원마다 <strong className="text-red-600">10만원~50만원</strong>까지 차이가 날 수 있습니다. 
                  현명한 비교를 통해 <strong className="text-primary">합리적인 의료비</strong>를 지출하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
