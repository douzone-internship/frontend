import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Badge from '../common/Badge';
import AutocompleteInput from '../common/AutocompleteInput';
import { searchTreatments, searchHospitals, searchLocations } from '../../api/home';

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
              <p className="text-xs text-gray-500 text-left pl-1 flex items-center gap-1">
                <span className="text-primary">💡</span>
                정확한 진료명을 입력하시면 더 나은 결과를 제공합니다
              </p>
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

export default SearchForm;
