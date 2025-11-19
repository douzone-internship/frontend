import axios from 'axios';

// API Base URL 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? '';

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
    return response.data.clinicResponseDTOList || [];
  } catch (error) {
    console.error('진료명 검색 실패:', error);
    throw error;
  }
};

/**
 * 병원명 검색 API
 * @param {string} name - 검색어
 * @param {string} locationCode - 지역 코드 (sgguCode 또는 sidoCode)
 * @returns {Promise<string[]>} 병원명 목록
 */
export const searchHospitals = async (name, locationCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/hospitals`, {
      params: {
        location: locationCode,
        name: name
      }
    });
    return response.data.nameList || [];
  } catch (error) {
    console.error('병원명 검색 실패:', error);
    throw error;
  }
};

/**
 * 지역(시군구) 검색 API
 * @param {string} name - 검색어
 * @returns {Promise<Array<{locationName: string, sidoCode: string, sgguCode: string}>>} 지역 목록 (객체 배열)
 */
export const searchLocations = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/locations`, {
      params: {
        name: name
      }
    });
    return response.data.locations || [];
  } catch (error) {
    console.error('지역 검색 실패:', error);
    throw error;
  }
};
