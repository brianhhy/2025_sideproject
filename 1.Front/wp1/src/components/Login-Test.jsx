import React, { useState } from "react";
import AUTH_API from "../utils/api/AUTH_API";
import { useNavigate } from "react-router-dom";

const LoginTest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 네비게이션 함수 생성

  // 사용자 정보 가져오기(로그인 적용 확인용)
  const fetchUserInfo = async () => {
    try {
      const response = await AUTH_API.get("/api/user/me");
      setUserInfo(response.data); // 사용자 정보 업데이트
      setError(null);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("로그인되지 않았습니다.");
      setUserInfo(null);  // 로그인 실패 시 userInfo를 null로 설정
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await AUTH_API.post("/api/auth/logout");
      setUserInfo(null);
      setError(null);
      alert("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed");
    }
  };

  return (
      <div>
        {/* 사용자 정보 가져오기 버튼 */}
        <button
            className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            onClick={fetchUserInfo}
        >
          Get User Info
        </button>

        {/* 페이지로 이동 버튼 */}
        <button
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate("/")}
        >
          Go to Home
        </button>

        {/* 사용자 정보 표시 */}
        {userInfo ? (
            <div>
              <h3>User Info</h3>
              <p>Name: {userInfo.name}</p>
              <p>Email: {userInfo.email}</p>
              <p>Provider: {userInfo.provider}</p>
              <button
                  className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                  onClick={handleLogout}
              >
                Logout
              </button>
            </div>
        ) : (
            <div>
              <p>{error || "로그인하셨으면 'Get User Info' 버튼을 눌러 정보를 불러오세요."}</p>
            </div>
        )}
      </div>
  );
};

export default LoginTest;
