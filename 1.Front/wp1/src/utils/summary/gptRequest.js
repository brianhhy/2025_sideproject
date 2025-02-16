import AUTH_API from "../api/AUTH_API";

export const getResponse = async (request) => {
    // console.log(`getResponse 실행 request = ${request}`);
    if(request != null){
        try{
            const response = await AUTH_API.post("/api/user/summary/getRequest",{
                prompt: request
            });

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

export const getResponseTest = async (request) => {
    console.log(`getResponse 실행 request = ${request}`);
}