import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import mammoth from "mammoth";

/**
 * ✅ 파일을 텍스트로 변환하는 함수
 * @param {File} file - 변환할 파일
 * @returns {Promise<string>} 변환된 텍스트
 */
export const convertFileToText = async (file) => {
    if (!file) return "";

    const fileType = file.name.split(".").pop().toLowerCase();

    if (fileType === "pdf") {
        return convertPdfToText(file); // ✅ PDF 변환
    } else if (fileType === "docx") {
        return convertDocxToText(file); // ✅ DOCX 변환
    } else {
        return "❌ 지원되지 않는 파일 형식입니다.";
    }
};

/**
 * ✅ PDF → TXT 변환
 * @param {File} file
 * @returns {Promise<string>} 변환된 텍스트
 */
const convertPdfToText = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map((item) => item.str).join(" ") + "\n\n";
        }

        return extractedText;
    } catch (error) {
        console.error("❌ PDF 변환 오류:", error);
        return "PDF 변환 실패";
    }
};

/**
 * ✅ DOCX → TXT 변환
 * @param {File} file
 * @returns {Promise<string>} 변환된 텍스트
 */
const convertDocxToText = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        console.error("❌ DOCX 변환 오류:", error);
        return "DOCX 변환 실패";
    }
};
