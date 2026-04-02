import axios from 'axios';
import { buildApiUrl } from '../utils/apiUrl';

/**
 * 검색 결과 조회 API
 * @param {Object} requestBody - 검색 파라미터
 * @param {string} requestBody.clinicCode - 진료 코드
 * @param {string} requestBody.hospitalName - 병원명 
 * @param {string} requestBody.sidoCode - 시도 코드 
 * @param {string} requestBody.sigguCode - 시군구 코드
 * @returns {Promise<{resultCount: number, aiComment: string, list: Array}>} 검색 결과
 */
export const getSearchResults = async (requestBody) => {
  try {
    const response = await axios.post(buildApiUrl('/result/reports'), requestBody);
    return response.data;
  } catch (error) {
    console.error('검색 결과 조회 실패:', error);
    throw error;
  }
};