import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from '../components/common/Logo';
import { getFavorites, removeFavoriteById } from '../api/favorite';
import Skeleton from '../components/common/Skeleton';

const FavoriteCard = ({ favorite, onRemove }) => {
    const priceRange = favorite.minPrice === favorite.maxPrice
        ? `${favorite.minPrice?.toLocaleString()}원`
        : `${favorite.minPrice?.toLocaleString()}원 ~ ${favorite.maxPrice?.toLocaleString()}원`;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-12">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{favorite.hospitalName}</h3>
                        <button
                            onClick={() => onRemove(favorite.id)}
                            className="p-1 rounded-full hover:bg-red-50 transition-colors"
                            aria-label="찜하기 취소"
                        >
                            <FaHeart className="text-red-500 text-lg" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {favorite.location}
                    </p>
                    <p className="text-sm text-gray-500">{favorite.clinicName}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{priceRange}</div>
                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(favorite.createdAt).toLocaleDateString()} 찜함
                    </p>
                </div>
            </div>
        </div>
    );
};

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error("찜한 목록 불러오기 실패", err);
                setError("찜한 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        if (!window.confirm("정말 찜하기를 취소하시겠습니까?")) return;
        try {
            await removeFavoriteById(id);
            setFavorites(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert("삭제에 실패했습니다.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p>로딩 중...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="text-gray-600" />
                        </button>
                        <Logo />
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">찜한 병원</h1>
                <p className="text-gray-500 mb-8">관심있는 병원과 진료 정보를 모아보세요.</p>

                {error && <p className="text-red-500">{error}</p>}

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <FaHeart className="text-gray-300 text-5xl mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">아직 찜한 병원이 없습니다.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            병원 찾아보기
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {favorites.map(favorite => (
                            <FavoriteCard
                                key={favorite.id}
                                favorite={favorite}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
