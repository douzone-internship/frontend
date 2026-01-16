import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 세션 스토리지에서 저장된 리다이렉트 경로 가져오기
        const redirectPath = sessionStorage.getItem('oauth_redirect_path') || '/';
        
        // 세션 스토리지 정리
        sessionStorage.removeItem('oauth_redirect_path');
        
        // 저장된 경로로 이동
        navigate(redirectPath, { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-700 text-lg font-medium">로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
