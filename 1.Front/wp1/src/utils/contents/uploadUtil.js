import AUTH_API from "../api/AUTH_API";

/**
 * 🔹 파일을 업로드하는 유틸 함수
 * @param {File} file - 업로드할 파일
 * @param {Number} folderId - 업로드할 폴더의 ID
 * @returns {Promise<Boolean>} 성공 여부
 */
export const uploadFile = async (file, folderId) => {
    if (!file) {
        console.error("❌ 선택된 파일이 없습니다.");
        return false;
    }

    // console.log("📂 업로드할 파일:", file);
    // console.log("📂 업로드할 folderId:", folderId);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

    try {
        console.log("🚀 파일 업로드 요청 전송...");
        const response = await AUTH_API.post("/api/user/upload/uploadFile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("✅ 파일 업로드 성공:", response.data);
        return true; // 성공 시 true 반환
    } catch (error) {
        console.error("❌ 파일 업로드 실패:", error);
        return false; // 실패 시 false 반환
    }
};
