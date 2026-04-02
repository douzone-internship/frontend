import axios from 'axios';
import { buildApiUrl } from '../utils/apiUrl';

/**
 * 찜하기 추가
 * @param {Object} data - 찜하기 정보 (hospitalName, clinicName, clinicCode, etc.)
 */
export const addFavorite = async (data) => {
    try {
        const response = await axios.post(buildApiUrl('/favorites'), data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰 헤더 추가
            }
        });
        return response.data;
    } catch (error) {
        console.error('찜하기 추가 실패:', error);
        throw error;
    }
};

/**
 * 찜하기 삭제 (ID 기준)
 * @param {string} id - 찜하기 ID
 */
export const removeFavoriteById = async (id) => {
    try {
        await axios.delete(buildApiUrl(`/favorites/${id}`), {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('찜하기 삭제 실패:', error);
        throw error;
    }
};

/**
 * 찜하기 삭제 (병원명 + 진료코드 기준)
 * @param {string} hospitalName 
 * @param {string} clinicCode 
 */
export const removeFavoriteByDetails = async (hospitalName, clinicCode) => {
    try {
        await axios.delete(buildApiUrl('/favorites'), {
            params: { hospitalName, clinicCode },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('찜하기 삭제 실패:', error);
        throw error;
    }
};

/**
 * 찜한 목록 조회
 */
export const getFavorites = async () => {
    try {
        const response = await axios.get(buildApiUrl('/favorites'), {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('찜한 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 찜하기 여부 확인
 */
export const checkFavorite = async (hospitalName, clinicCode) => {
    try {
        const response = await axios.get(buildApiUrl('/favorites/check'), {
            params: { hospitalName, clinicCode },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data; // true or false
    } catch (error) {
        console.error('찜하기 여부 확인 실패:', error);
        // 에러 시 false로 처리하거나 throw
        return false;
    }
};
