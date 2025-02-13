import AUTH_API from "../api/AUTH_API";
import {getRandomColor} from "./colorUtils";

/**
 * 📌 백엔드에서 폴더 및 파일 목록을 가져오는 함수
 * @returns {Promise<Array>} menuItems 형태로 변환된 데이터 반환
 */
export const getMenuItems = async () => {
    try {
        // 백엔드 API 요청
        const response = await AUTH_API.post("/api/user/upload/findFolder", {
            parentFolderId: null
        });

        // console.log("📌 API Response:", response.data);

        // API 응답에서 데이터 추출
        const folderList = response.data.data || [];

        // `FolderResponseDto`를 `menuItems` 형태로 변환
        const transformedData = folderList.map((folder) => ({
            id: folder.folderId,
            name: folder.folderName,
            subItems: folder.fileNames ? folder.fileNames.slice(0, 3) : [],
            date: folder.updatedAt ? [folder.updatedAt] : [],
        }));

        console.log("📌 Transformed Data:", transformedData);
        return transformedData; // ✅ 변환된 데이터 반환
    } catch (err) {
        console.error("❌ 메모 데이터를 불러오는 중 오류 발생:", err);

        // 백엔드에서 보낸 오류 메시지 추출
        const errorMessage = err.response?.data?.message || "로그인이 필요한 서비스입니다.";
        throw new Error(errorMessage); // ✅ 예외를 발생시켜 호출한 곳에서 처리하도록 함
    }
};

/**
 * 🔹 특정 폴더(menuId)에 속한 파일을 가져오는 함수
 * @param {Number} menuId - 선택한 폴더의 ID
 * @param {Object} colorMap - 파일별 색상 매핑 객체
 * @returns {Array} 변환된 파일 데이터 배열
 */
export const getFilesForMenu = async (menuId) => {
    try {
        // console.log(`📌 API 요청: /api/user/upload/findFiles -> menuId: ${menuId}`);

        const response = await AUTH_API.post("/api/user/upload/findFiles", {
            parentFolderId: menuId,
        });

        const { data, success, message } = response.data;

        if (success && data) {
            return data.map((file) => ({
                fileId: file.fileId,
                name: file.originalName,
                createdTime: file.createdTime || "날짜 정보 없음",
                getRandomColor, // ✅ 색상 지정 (없으면 랜덤)
            }));
        } else {
            console.error("❌ 파일 로딩 실패:", message);
            return []; // 오류 발생 시 빈 배열 반환
        }
    } catch (error) {
        console.error("❌ API 요청 오류:", error.message);
        return []; // 오류 발생 시 빈 배열 반환
    }
};

export const fetchUserInfo = async (setUserInfo) => {
    try {
        const response = await AUTH_API.get("/api/user/me");
        setUserInfo(response.data); // 사용자 정보 업데이트
    } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);  // 로그인 실패 시 userInfo를 null로 설정
    }
};

/**
 * 📂 파일 ID를 통해 Signed URL을 가져오는 함수
 * @param {number} fileId - 요청할 파일의 ID
 * @returns {string | null} - 성공 시 파일 URL, 실패 시 null
 */
export const getFileUrl = async (fileId) => {
    try {
        const response = await AUTH_API.get("/api/user/upload/getFileUrl", {
            params: { fileId }
        });

        const { data, success, message } = response.data;

        if (success) {
            console.log("📂 파일 URL 받음:", data);
            return data; // ✅ 성공 시 URL 반환
        } else {
            console.error("❌ 파일 URL 요청 실패:", message);
            return null;
        }
    } catch (error) {
        console.error("❌ 파일 URL 요청 오류:", error.message);
        return null;
    }
};
