import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaExclamationTriangle, FaUserCircle, FaComment, FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import Logo from '../components/common/Logo';
import { getMyComments, updateComment, deleteComment } from '../api/comment';
import { buildApiUrl } from '../utils/apiUrl';

// 소셜 로그인 뱃지 컴포넌트
const ProviderBadge = ({ provider }) => {
    if (provider === 'GOOGLE') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                <FcGoogle className="text-lg" />
                Google
            </span>
        );
    }
    if (provider === 'KAKAO') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEE500] text-sm font-medium text-[#3C1E1E] shadow-sm">
                <RiKakaoTalkFill className="text-lg" />
                Kakao
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
            일반 로그인
        </span>
    );
};

// 회원탈퇴 확인 모달
const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <FaExclamationTriangle className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">정말 탈퇴하시겠습니까?</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        회원 탈퇴 시 모든 데이터(찜한 병원, 검색 기록 등)가
                        <br />영구적으로 삭제되며 복구할 수 없습니다.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? '처리 중...' : '탈퇴하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [myComments, setMyComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [editScore, setEditScore] = useState(5);

    // 사용자 정보 조회
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(buildApiUrl('/auth/me'), {
                    credentials: 'include',
                    cache: 'no-store'
                });

                if (!response.ok) {
                    navigate('/login', { state: { from: '/mypage' }, replace: true });
                    return;
                }

                const data = await response.json();
                if (data.authenticated) {
                    setUser(data);
                } else {
                    navigate('/login', { state: { from: '/mypage' }, replace: true });
                }
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                navigate('/login', { state: { from: '/mypage' }, replace: true });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    // 내 댓글 조회
    useEffect(() => {
        const fetchMyComments = async () => {
            try {
                const data = await getMyComments();
                setMyComments(data);
            } catch (err) {
                console.error('내 댓글 조회 실패:', err);
            } finally {
                setCommentsLoading(false);
            }
        };
        if (user) fetchMyComments();
    }, [user]);

    // 댓글 수정
    const handleUpdateComment = async (id) => {
        if (!editComment.trim()) return;
        try {
            const updated = await updateComment(id, editComment.trim(), editScore);
            setMyComments(prev => prev.map(c => c.id === id ? updated : c));
            setEditingId(null);
        } catch (err) {
            alert('댓글 수정에 실패했습니다.');
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (id) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
        try {
            await deleteComment(id);
            setMyComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    // 회원탈퇴 처리
    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            // TODO: 백엔드 회원탈퇴 API 연동 (DELETE /api/auth/me)
            const response = await fetch(buildApiUrl('/auth/me'), {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace('/');
            } else {
                alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
                    <p className="text-gray-500">불러오는 중...</p>
                </div>
            </div>
        );
    }

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

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {/* 페이지 타이틀 */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">내 정보</h1>
                    <p className="text-gray-500">계정 정보를 관리하세요.</p>
                </div>

                {/* 프로필 카드 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                            <FaUserCircle className="text-white text-4xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || '사용자'}</h2>
                            <div className="flex items-center gap-2 text-gray-500 mb-3">
                                <FaEnvelope className="text-sm" />
                                <span className="text-sm truncate">{user?.email}</span>
                            </div>
                            <ProviderBadge provider={user?.provider} />
                        </div>
                    </div>
                </div>

                {/* 내가 쓴 댓글 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FaComment className="text-primary" />
                        <h2 className="text-lg font-bold text-gray-900">내가 쓴 댓글</h2>
                        <span className="text-sm text-gray-400">({myComments.length}개)</span>
                    </div>

                    {commentsLoading ? (
                        <p className="text-sm text-gray-400 text-center py-4">불러오는 중...</p>
                    ) : myComments.length === 0 ? (
                        <div className="text-center py-8">
                            <FaComment className="text-gray-200 text-4xl mx-auto mb-3" />
                            <p className="text-gray-400">작성한 댓글이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {myComments.map((c) => (
                                <div key={c.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">{c.hospitalName}</span>
                                            <span className="text-xs text-gray-400 ml-2">{c.clinicCode}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className={`text-sm ${s <= c.score ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                    </div>

                                    {editingId === c.id ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">평점</span>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <button key={s} type="button" onClick={() => setEditScore(s)}
                                                            className="text-lg cursor-pointer">
                                                            <span className={s <= editScore ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" value={editComment}
                                                    onChange={(e) => setEditComment(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                                    autoFocus />
                                                <button onClick={() => handleUpdateComment(c.id)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <FaCheck className="text-sm" />
                                                </button>
                                                <button onClick={() => setEditingId(null)}
                                                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <FaTimes className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">{c.comment}</p>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingId(c.id); setEditComment(c.comment); setEditScore(c.score); }}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <FaEdit className="text-xs" />
                                                </button>
                                                <button onClick={() => handleDeleteComment(c.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <FaTrashAlt className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 회원탈퇴 영역 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">계정 삭제</h2>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        회원 탈퇴 시 모든 찜 목록, 검색 기록 등 개인 데이터가 영구적으로 삭제됩니다.
                        이 작업은 되돌릴 수 없습니다.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-5 py-2.5 border border-red-300 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        회원탈퇴
                    </button>
                </div>
            </div>

            {/* 회원탈퇴 확인 모달 */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                loading={deleteLoading}
            />
        </div>
    );
};

export default MyPage;
