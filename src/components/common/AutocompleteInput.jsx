import React, { useState, useEffect } from 'react';

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

export default AutocompleteInput;
