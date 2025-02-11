/* 인증된 사용자전용 API*/

import axios from 'axios';
import {API_SERVER_URL} from "../../config";

// Axios 인스턴스 생성
const AUTH_API = axios.create({
    baseURL: `${API_SERVER_URL}`,
    withCredentials: true, // 쿠키 포함
});

// 응답 인터셉터
// AccessToken 시간 만료시 서버로 요청하여 AccessToken 재갱신 ( 클라이언트 쿠키의 RefreshToken 기반으로 확인하여 )
AUTH_API.interceptors.response.use(
    (response) => response, // 성공 응답 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 401 응답 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 방지 플래그

            try {
                // /refresh API 호출
                await axios.post(
                    `${API_SERVER_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // 원래 요청 재시도
                return AUTH_API(originalRequest);
            } catch (err) {
                console.error('AccessToken 갱신 실패:', err);
                // 로그아웃 처리 또는 에러 반환
                return Promise.reject(err);
            }
        }

        // 기타 에러는 그대로 반환
        return Promise.reject(error);
    }
);


export default AUTH_API;
