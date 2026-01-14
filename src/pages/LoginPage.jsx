import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">로그인</h2>
                    <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-3 w-full py-4 px-6 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 group"
                    >
                        <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 font-medium text-lg">Google 계정으로 로그인</span>
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
