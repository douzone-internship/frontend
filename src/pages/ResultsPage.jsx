import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStethoscope, FaHospital, FaArrowLeft } from 'react-icons/fa';
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
 * ResultsContent Component
 * 실제 검색 결과 내용
 */
const ResultsContent = ({ treatment, hospital, region }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 호출
        // const response = await axios.get(`${API_BASE_URL}/search`, {
        //   params: { treatment, hospital, region }
        // });
        // setResults(response.data);
        
        // 임시 더미 데이터
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
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="price-low">가격 낮은순</option>
          <option value="price-high">가격 높은순</option>
          <option value="rating">평점순</option>
          <option value="review">리뷰많은순</option>
        </select>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
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
