import AUTH_API from "../api/AUTH_API";
import {convertFileToText} from "./convertToText";
import {getMenuItems} from "./getDataUtil";

/**
 * 🔹 파일을 업로드하는 유틸 함수
 * @param {File} file - 업로드할 파일
 * @param {Number} folderId - 업로드할 폴더의 ID
 * @returns {Promise<Boolean>} 성공 여부
 */

export const uploadFile = async (file, fileName, folderId) => {
    if (!file) {
        console.error("❌ 선택된 파일이 없습니다.");
        return false;
    }

    let fileContent = "";
    let newFileName = fileName || file.name; // 기존 파일 이름 유지
    let fileType = file.name ? file.name.split(".").pop().toLowerCase() : null;

    try {
        if (fileType === "pdf" || fileType === "docx") {
            console.log(`📌 ${fileType.toUpperCase()} 파일 감지! TXT로 변환 중...`);
            fileContent = await convertFileToText(file);
            newFileName = newFileName.replace(/\.(pdf|docx)$/, ".txt"); // ✅ 확장자 변경
        } else {
            fileContent = await file.text();
        }
    } catch (error) {
        console.error(`❌ ${fileType.toUpperCase()} 변환 실패:`, error);
        return false;
    }

    const textFile = new Blob([fileContent], { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", textFile, newFileName);
    formData.append("fileName", newFileName);
    formData.append("folderId", folderId);

    try {
        console.log("🚀 파일 업로드 요청 전송...");
        const response = await AUTH_API.post("/api/user/upload/uploadFile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ 파일 업로드 성공:", response.data);
        return true;
    } catch (error) {
        console.error("❌ 파일 업로드 실패:", error);
        return false;
    }
};

export const updateFile = async (fileId, file) => {
    if (!fileId || !file) {
        console.error("❌ 업데이트할 파일이 없습니다.");
        return false;
    }

    const formData = new FormData();
    formData.append("file", file, `${fileId}.txt`);
    formData.append("fileId", fileId);

    try {
        console.log("🚀 TXT 파일 업데이트 요청 전송...");
        const response = await AUTH_API.post("/api/user/upload/updateFile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ 파일 업데이트 성공:", response.data);
        return true;
    } catch (error) {
        console.error("❌ 파일 업데이트 실패:", error);
        return false;
    }
};

export const saveFile = async (folderId, fileId, fileName, sections) => {
    const textFile = convertSectionsToTextFile(folderId, fileName, sections); // ✅ TXT 파일 변환

    if (!fileId) {
        console.log("🆕 새 파일 업로드 실행");
        return await uploadFile(textFile, fileName || "new_file.txt", folderId);
    } else {
        console.log("🔄 기존 파일 업데이트 실행");
        return await updateFile(fileId, textFile);
    }
};

export const convertSectionsToTextFile = (folderId, fileName, sections) => {
    // ✅ sections 배열을 하나의 TXT 문자열로 변환
    const fileContent = sections.join("\n\n---\n\n"); // ✅ 페이지 구분 유지

    // ✅ Blob을 사용해 TXT 파일 생성
    const textFile = new Blob([fileContent], { type: "text/plain" });

    console.log(`📄 TXT 파일 생성 완료 (${fileName})`);

    return textFile; // ✅ Blob 파일 반환
};
