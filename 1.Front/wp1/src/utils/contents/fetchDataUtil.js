import AUTH_API from "../api/AUTH_API";

/**
 * 🔹 폴더 이름 변경 API 요청
 * @param {Number} folderId - 변경할 폴더의 ID
 * @param {String} newName - 새로운 폴더 이름
 * @returns {Boolean} 성공 여부
 */
export const renameFolder = async (folderId, newName) => {
    try {
        const response = await AUTH_API.put(`/api/user/upload/renameFolder`, {
            folderId,
            newName
        });
        const { success, message } = response.data;

        if (success) {
            console.log("✅ 폴더 이름 변경 성공!");
            return true; // 성공 시 true 반환
        } else {
            console.error("❌ 폴더 이름 변경 실패:", message);
            return false; // 실패 시 false 반환
        }
    } catch (error) {
        console.error("❌ API 요청 오류 (renameFolder):", error.message);
        return false; // 오류 발생 시 false 반환
    }
};

/**
 * 🔹 폴더 삭제 API 요청
 * @param {Number} folderId - 삭제할 폴더의 ID
 * @returns {Boolean} 성공 여부
 */
export const deleteFolder = async (folderId) => {
    try {
        const response = await AUTH_API.delete(`/api/user/upload/deleteFolder?folderId=${folderId}`);

        const { success, message } = response.data;

        if (success) {
            console.log("✅ 폴더 삭제 성공!");
            return true; // 성공 시 true 반환
        } else {
            console.error("❌ 폴더 삭제 실패:", message);
            return false; // 실패 시 false 반환
        }
    } catch (error) {
        console.error("❌ API 요청 오류 (deleteFolder):", error.message);
        return false; // 오류 발생 시 false 반환
    }
};
/**
 * 🔹 새로운 폴더(책장) 생성 API 요청
 * @param {String} folderName - 생성할 폴더 이름
 * @param {Number | null} parentFolderId - 부모 폴더 ID (최상위 폴더인 경우 null)
 * @returns {Boolean} 성공 여부
 */
export const createFolder = async (folderName, parentFolderId = null) => {
    try {
        const response = await AUTH_API.post("/api/user/upload/createFolder", {
            folderName,
            parentFolderId
        });

        const { success, message } = response.data;

        if (success) {
            console.log("✅ 폴더 생성 성공:", message);
            return true; // 성공 시 true 반환
        } else {
            console.error("❌ 폴더 생성 실패:", message);
            return false; // 실패 시 false 반환
        }
    } catch (error) {
        console.error("❌ API 요청 오류 (createFolder):", error.message);
        return false; // 오류 발생 시 false 반환
    }
};

