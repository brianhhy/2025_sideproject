export const NO_AUTH_API = async (url, method = "GET", body = null) => {
    try {
        const options = {
            method,
            credentials: "include", // 쿠키 포함
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // body가 있을 경우에만 추가
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // 응답 확인
        const data = await response.json();

        alert(data.message)
        if (!response.ok) {
            return { success: false, message: data.message || '요청 실패' };
        }
        return { success: true, data };
    } catch (error) {
        console.error('API 요청 중 오류:', error);
        return { success: false, message: '요청 중 오류가 발생했습니다.' };
    }
};
