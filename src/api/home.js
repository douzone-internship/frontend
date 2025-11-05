import axios from 'axios';

// API Base URL 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

/**
 * 진료명 검색 API
 * @param {string} name - 검색어
 * @returns {Promise<Array<{clinicName: string, clinicCode: string}>>} 진료명 목록 (객체 배열)
 */
export const searchTreatments = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/clinics`, {
      params: {
        name: name
      }
    });
    // 응답 형식: [{ clinicName: "도수치료", clinicCode: "CZ100A" }, ...]
    return response.data;
  } catch (error) {
    console.error('진료명 검색 실패:', error);
    throw error;
  }
};

/**
 * 병원명 검색 API
 * @param {string} name - 검색어
 * @returns {Promise<string[]>} 병원명 목록
 */
export const searchHospitals = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/hospitals`, {
      params: {
        name: name
      }
    });
    // 응답 형식: { nameList: ["서울대병원", "분당서울대학교병원", ...] }
    return response.data.nameList || [];
  } catch (error) {
    console.error('병원명 검색 실패:', error);
    throw error;
  }
};

/**
 * 지역(시군구) 검색 API
 * @param {string} name - 검색어
 * @returns {Promise<Array<{locationName: string, locationCode: string}>>} 지역 목록 (객체 배열)
 */
export const searchLocations = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/locations`, {
      params: {
        name: name
      }
    });
    // 응답 형식: [{ locationName: "강원도 춘천시", locationCode: "1103011103" }, ...]
    return response.data;
  } catch (error) {
    console.error('지역 검색 실패:', error);
    throw error;
  }
};
