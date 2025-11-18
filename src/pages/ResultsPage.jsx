import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStethoscope, FaHospital, FaArrowLeft, FaChevronLeft, FaChevronRight, FaRobot } from 'react-icons/fa';
import Skeleton from '../components/common/Skeleton';
import Logo from '../components/common/Logo';
import { getSearchResults } from '../api/result';

/**
 * SearchInfo Component
 * 검색 조건 표시
 */
const SearchInfo = ({ clinicName, hospitalName, locationName }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <FaStethoscope className="text-primary" />
      검색 조건
    </h2>
    <div className="flex flex-wrap gap-3">
      {clinicName && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
          <FaStethoscope className="text-sm" />
          <span>{clinicName}</span>
        </div>
      )}
      {hospitalName && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
          <FaHospital className="text-sm" />
          <span>{hospitalName}</span>
        </div>
      )}
      {locationName && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
          <FaMapMarkerAlt className="text-sm" />
          <span>{locationName}</span>
        </div>
      )}
    </div>
  </div>
);

/**
 * AIComment Component
 * AI 추천 코멘트
 */
const AIComment = ({ comment }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
      <FaRobot className="text-blue-600" />
      AI 추천 분석
    </h2>
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{comment}</p>
  </div>
);

/**
 * ResultCard Component
 * 개별 검색 결과 카드
 */
const ResultCard = ({ result }) => {
  const priceRange = result.minPrice === result.maxPrice 
    ? `${result.minPrice.toLocaleString()}원`
    : `${result.minPrice.toLocaleString()}원 ~ ${result.maxPrice.toLocaleString()}원`;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{result.hospitalName}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
            <FaMapMarkerAlt className="text-gray-400" />
            {result.location}
          </p>
          <p className="text-sm text-gray-500">{result.clinicName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{priceRange}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * ResultsLoading Component
 * 로딩 스켈레톤
 */
const ResultsLoading = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-32 w-full" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  </div>
);

/**
 * Pagination Component
 * 페이지네이션 UI
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border ${
          currentPage === 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="이전 페이지"
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] px-3 py-2 rounded-lg border font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="다음 페이지"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

/**
 * ResultsContent Component
 * 실제 검색 결과 내용
 */
const ResultsContent = ({ clinicCode, clinicName, hospitalName, locationName, sidoCode, sigguCode }) => {
  const [results, setResults] = useState([]);
  const [aiComment, setAiComment] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출
        const data = await getSearchResults({
          clinicCode,
          hospitalName: hospitalName || null,
          sidoCode: sidoCode || null,
          sigguCode: sigguCode || null
        });
        
        setResults(data.list || []);
        setAiComment(data.aiComment || '');
        setResultCount(data.resultCount || 0);
    
      } catch (err) {
        setError('검색 결과를 불러오는데 실패했습니다.');
        console.error('검색 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [clinicCode, hospitalName, sidoCode, sigguCode]);

  // 정렬된 결과 계산
  const sortedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.minPrice - b.minPrice;
      } else if (sortBy === 'price-high') {
        return b.maxPrice - a.maxPrice;
      }
      return 0;
    });
    return sorted;
  }, [results, sortBy]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = sortedResults.slice(indexOfFirstResult, indexOfLastResult);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로
  };

  if (loading) {
    return <ResultsLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다.</p>
        <p className="text-gray-400 text-sm">다른 검색 조건으로 시도해보세요.</p>
      </div>
    );
  }

  return (
    <div>
      <SearchInfo clinicName={clinicName} hospitalName={hospitalName} locationName={locationName} />
      
      {aiComment && <AIComment comment={aiComment} />}
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          검색 결과 <span className="text-primary">{resultCount}</span>건
        </h2>
        <select 
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="price-low">가격 낮은순</option>
          <option value="price-high">가격 높은순</option>
        </select>
      </div>

      <div className="space-y-4">
        {currentResults.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

/**
 * ResultsPage Component
 * 검색 결과 페이지
 */
const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // state에서 검색 데이터 가져오기
  const searchData = location.state || {};
  const {
    clinicCode,
    clinicName,
    hospitalName,
    locationName,
    sidoCode,
    sigguCode
  } = searchData;

  // state가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!clinicCode) {
      navigate('/');
    }
  }, [clinicCode, navigate]);

  if (!clinicCode) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="뒤로가기"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <Logo />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsContent 
          clinicCode={clinicCode} 
          clinicName={clinicName}
          hospitalName={hospitalName} 
          locationName={locationName}
          sidoCode={sidoCode} 
          sigguCode={sigguCode} 
        />
      </div>
    </main>
  );
};

export default ResultsPage;
