import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStethoscope, FaHospital, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Skeleton from '../components/common/Skeleton';
import Logo from '../components/common/Logo';

/**
 * SearchInfo Component
 * 검색 조건 표시
 */
const SearchInfo = ({ treatment, hospital, region }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <FaStethoscope className="text-primary" />
      검색 조건
    </h2>
    <div className="flex flex-wrap gap-3">
      {treatment && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
          <FaStethoscope className="text-sm" />
          <span>{treatment}</span>
        </div>
      )}
      {hospital && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
          <FaHospital className="text-sm" />
          <span>{hospital}</span>
        </div>
      )}
      {region && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
          <FaMapMarkerAlt className="text-sm" />
          <span>{region}</span>
        </div>
      )}
    </div>
  </div>
);

/**
 * ResultCard Component
 * 개별 검색 결과 카드
 */
const ResultCard = ({ result }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{result.hospitalName}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
          <FaMapMarkerAlt className="text-gray-400" />
          {result.location}
        </p>
        {result.url && (
          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            🔗 {result.url}
          </a>
        )}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{result.price.toLocaleString()}원</div>
        <div className="text-sm text-gray-500">{result.treatmentName}</div>
      </div>
    </div>
  </div>
);

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
const ResultsContent = ({ treatment, hospital, region }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 호출
        // const response = await axios.get(`${API_BASE_URL}/search`, {
        //   params: { treatment, hospital, region }
        // });
        // setResults(response.data);
        
        // 임시 더미 데이터 (테스트를 위해 25개 생성)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyResults = [
          {
            id: 1,
            hospitalName: '서울대학교병원',
            location: '서울특별시 종로구',
            treatmentName: treatment || '도수치료',
            price: 150000,
            url: 'https://www.snuh.org'
          },
          {
            id: 2,
            hospitalName: '연세세브란스병원',
            location: '서울특별시 서대문구',
            treatmentName: treatment || '도수치료',
            price: 165000,
            url: 'https://sev.severance.healthcare'
          },
          {
            id: 3,
            hospitalName: '삼성서울병원',
            location: '서울특별시 강남구',
            treatmentName: treatment || '도수치료',
            price: 180000,
            url: 'https://www.samsunghospital.com'
          },
          {
            id: 4,
            hospitalName: '아산병원',
            location: '서울특별시 송파구',
            treatmentName: treatment || '도수치료',
            price: 175000,
            url: 'https://www.amc.seoul.kr'
          },
          {
            id: 5,
            hospitalName: '강남세브란스병원',
            location: '서울특별시 강남구',
            treatmentName: treatment || '도수치료',
            price: 170000,
            url: 'https://gs.iseverance.com'
          },
          {
            id: 6,
            hospitalName: '고려대학교안암병원',
            location: '서울특별시 성북구',
            treatmentName: treatment || '도수치료',
            price: 160000,
            url: 'https://www.kumc.or.kr'
          },
          {
            id: 7,
            hospitalName: '한양대학교병원',
            location: '서울특별시 성동구',
            treatmentName: treatment || '도수치료',
            price: 155000,
            url: 'https://www.hyumc.com'
          },
          {
            id: 8,
            hospitalName: '분당서울대병원',
            location: '경기도 성남시 분당구',
            treatmentName: treatment || '도수치료',
            price: 158000,
            url: 'https://www.snubh.org'
          },
          {
            id: 9,
            hospitalName: '일산백병원',
            location: '경기도 고양시 일산서구',
            treatmentName: treatment || '도수치료',
            price: 145000,
            url: 'https://www.paik.ac.kr/ilsan'
          },
          {
            id: 10,
            hospitalName: '인천성모병원',
            location: '인천광역시 부평구',
            treatmentName: treatment || '도수치료',
            price: 148000,
            url: 'https://www.cmcich.or.kr'
          },
          {
            id: 11,
            hospitalName: '가톨릭대학교 서울성모병원',
            location: '서울특별시 서초구',
            treatmentName: treatment || '도수치료',
            price: 172000,
            url: 'https://www.cmcseoul.or.kr'
          },
          {
            id: 12,
            hospitalName: '순천향대학교 서울병원',
            location: '서울특별시 용산구',
            treatmentName: treatment || '도수치료',
            price: 152000,
            url: 'https://www.schmc.ac.kr/seoul'
          },
          {
            id: 13,
            hospitalName: '경희대학교병원',
            location: '서울특별시 동대문구',
            treatmentName: treatment || '도수치료',
            price: 157000,
            url: 'https://www.khmc.or.kr'
          },
          {
            id: 14,
            hospitalName: '이화여자대학교 목동병원',
            location: '서울특별시 양천구',
            treatmentName: treatment || '도수치료',
            price: 162000,
            url: 'https://www.eumc.ac.kr/mokdong'
          },
          {
            id: 15,
            hospitalName: '중앙대학교병원',
            location: '서울특별시 동작구',
            treatmentName: treatment || '도수치료',
            price: 153000,
            url: 'https://www.caumc.or.kr'
          },
          {
            id: 16,
            hospitalName: '건국대학교병원',
            location: '서울특별시 광진구',
            treatmentName: treatment || '도수치료',
            price: 151000,
            url: 'https://www.kuh.ac.kr'
          },
          {
            id: 17,
            hospitalName: '국민건강보험 일산병원',
            location: '경기도 고양시 일산동구',
            treatmentName: treatment || '도수치료',
            price: 142000,
            url: 'https://www.nhimc.or.kr'
          },
          {
            id: 18,
            hospitalName: '명지병원',
            location: '경기도 고양시 덕양구',
            treatmentName: treatment || '도수치료',
            price: 147000,
            url: 'https://www.mjh.or.kr'
          },
          {
            id: 19,
            hospitalName: '차병원',
            location: '경기도 성남시 분당구',
            treatmentName: treatment || '도수치료',
            price: 168000,
            url: 'https://www.chamc.co.kr'
          },
          {
            id: 20,
            hospitalName: '보훈병원',
            location: '서울특별시 강동구',
            treatmentName: treatment || '도수치료',
            price: 140000,
            url: 'https://www.bohun.or.kr'
          },
          {
            id: 21,
            hospitalName: '서울아산병원',
            location: '서울특별시 송파구',
            treatmentName: treatment || '도수치료',
            price: 185000,
            url: 'https://www.amc.seoul.kr'
          },
          {
            id: 22,
            hospitalName: '강북삼성병원',
            location: '서울특별시 종로구',
            treatmentName: treatment || '도수치료',
            price: 163000,
            url: 'https://www.kbsmc.co.kr'
          },
          {
            id: 23,
            hospitalName: '을지대학교병원',
            location: '대전광역시 중구',
            treatmentName: treatment || '도수치료',
            price: 138000,
            url: 'https://www.eujimed.or.kr'
          },
          {
            id: 24,
            hospitalName: '원광대학교병원',
            location: '전라북도 익산시',
            treatmentName: treatment || '도수치료',
            price: 135000,
            url: 'https://www.wkuh.org'
          },
          {
            id: 25,
            hospitalName: '동아대학교병원',
            location: '부산광역시 서구',
            treatmentName: treatment || '도수치료',
            price: 141000,
            url: 'https://www.daumc.or.kr'
          }
        ];
        setResults(dummyResults);
      } catch (err) {
        setError('검색 결과를 불러오는데 실패했습니다.');
        console.error('검색 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [treatment, hospital, region]);

  // 정렬된 결과 계산
  const sortedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
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
      <SearchInfo treatment={treatment} hospital={hospital} region={region} />
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          검색 결과 <span className="text-primary">{results.length}</span>건
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const treatment = searchParams.get('treatment') || undefined;
  const hospital = searchParams.get('hospital') || undefined;
  const region = searchParams.get('region') || undefined;

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
        <ResultsContent treatment={treatment} hospital={hospital} region={region} />
      </div>
    </main>
  );
};

export default ResultsPage;
