import AUTH_API from "../api/AUTH_API";

//prompt: 내용, type: gpt 답 형식(summary,quiz)
export const getGptResponse = async (prompt, type) => {
    // console.log(`getResponse 실행 request = ${request}`);
    if(prompt != null ){
        try{
            const response = await AUTH_API.post("/api/user/gpt/gptRequest",{
                prompt: prompt,
                type: type
            });

            //data = string
            const {data,success,message} = response.data;

            if(success){
                // console.log(`getResponse response = ${data}`);
                return data;
            }else{
                console.log(`getResponse Fail = ${message}`);
            }

        }catch (error){
            console.log(`getResponse 에러발생 : ${error}`);
        }
    }
}

export const settingJsonData = (gptResponse) =>{

    const cleanedResponse = gptResponse.trim(); // 앞뒤 공백 제거
    const jsonStartIndex = cleanedResponse.indexOf("["); // JSON 배열의 시작 위치 찾기
    const jsonEndIndex = cleanedResponse.lastIndexOf("]") + 1; // JSON 배열 끝 위치 찾기
    const validJsonString = cleanedResponse.substring(jsonStartIndex, jsonEndIndex); // JSON 부분만 추출

    return JSON.parse(validJsonString);
}
