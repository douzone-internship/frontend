import axios from 'axios';
import { buildApiUrl } from '../utils/apiUrl';

/**
 * 인증 헤더 생성 (토큰이 있을 때만)
 */
const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 댓글 작성
 * @param {Object} data - { hospitalName, clinicCode, comment, score }
 */
export const addComment = async (data) => {
    try {
        const response = await axios.post(buildApiUrl('/comments'), data, {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        console.error('댓글 작성 실패:', error);
        throw error;
    }
};

/**
 * 댓글 목록 조회 (병원명 + 진료코드 기준)
 * @param {string} hospitalName
 * @param {string} clinicCode
 */
export const getComments = async (hospitalName, clinicCode) => {
    try {
        const response = await axios.get(buildApiUrl('/comments'), {
            params: { hospitalName, clinicCode },
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        console.error('댓글 목록 조회 실패:', error);
        return [];
    }
};

/**
 * 댓글 수정
 * @param {string} id - 댓글 ID
 * @param {string} comment - 수정할 내용
 * @param {number} score - 수정할 평점
 */
export const updateComment = async (id, comment, score) => {
    try {
        const response = await axios.put(buildApiUrl(`/comments/${id}`), { comment, score }, {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        throw error;
    }
};

/**
 * 댓글 삭제
 * @param {string} id - 댓글 ID
 */
export const deleteComment = async (id) => {
    try {
        await axios.delete(buildApiUrl(`/comments/${id}`), {
            headers: authHeader()
        });
    } catch (error) {
        console.error('댓글 삭제 실패:', error);
        throw error;
    }
};

/**
 * 내가 쓴 댓글 목록 조회
 */
export const getMyComments = async () => {
    try {
        const response = await axios.get(buildApiUrl('/comments/my'), {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        console.error('내 댓글 조회 실패:', error);
        return [];
    }
};
