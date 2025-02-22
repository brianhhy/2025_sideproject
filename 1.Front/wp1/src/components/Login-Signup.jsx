import React, { useState } from "react";
import googleImage from "../assets/google.png";
import kakaoImage from "../assets/kakao.png";
import naverImage from "../assets/naver.png";
import {NO_AUTH_API} from "../utils/api/NO_AUTH_API";
import { Cookies } from 'react-cookie';
import {API_CLIENT_URL, API_SERVER_URL} from "../config"; // 쿠키 사용

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const cookies = new Cookies(); // 쿠키 객체 생성

  const handleSocialLogin = (platform) => {
    // 쿠키에 리다이렉트 URI와 모드 저장
    cookies.set('redirect_uri', `${API_CLIENT_URL}`, { path: '/', maxAge: 600 }); // 10분 유효
    cookies.set('mode', 'login', { path: '/', maxAge: 600 }); // 로그인 모드 설정

    // 소셜 로그인 URL 생성
    const socialLoginUrl = `${API_SERVER_URL}/oauth2/authorization/${platform}?redirect_uri=${API_CLIENT_URL}&mode=login`;
    // 소셜 로그인 URL로 이동
    window.location.href = socialLoginUrl;
  };

  // 일반 로그인처리
  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 동작 방지

    const { success, data, message } =
        await NO_AUTH_API(`${API_SERVER_URL}/api/public/default/login`, 'POST', { email, password });

    if (success) {
      console.log('로그인 성공:', data);
      window.location.href = `${API_CLIENT_URL}`; // 원하는 경로로 이동
      return;
    }

  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirm-password") {
      setConfirmPassword(value);
    }
    setIsPasswordValid(value === password);
  };

  //회원가입
  const handleSignSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    const response = await NO_AUTH_API(`${API_SERVER_URL}/api/public/default/signup`, "POST", userData);

    if (response.success) {
      window.location.href = `${API_CLIENT_URL}/login`; // 회원가입 성공 후 리다이렉션
    }
  };


  return (
    <div className="font-[sans-serif] flex ml-40 items-center justify-center min-h-screen bg-gray-50">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full py-6 px-4">
        {/* Left Section */}
        <div>
          <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
            팀명이나 로고
          </h2>
          <p className="text-sm mt-6 text-gray-800">
            Immerse yourself in a hassle-free login journey with our intuitively designed login form. Effortlessly access your account. (서비스 소개)
          </p>
          {isLogin ? (
            <p className="text-sm mt-12 text-gray-800">
              Don't have an account
              <a
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          ) : (
            <p className="text-sm mt-12 text-gray-800">
              Already have an account?
              <a
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Sign in here
              </a>
            </p>
          )}
        </div>

        {/* Right Section */}
        {isLogin ? (
            //로그인폼
          <form className="max-w-md md:ml-auto w-full" onSubmit={handleLoginSubmit}>
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">Sign in</h3>
            <div className="space-y-4">
              <div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // onChange로 상태 변경
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  // onChange로 상태 변경
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-blue-600 text-white text-sm font-semibold py-3.5 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
            <div className="!mt-8 flex justify-center gap-4">
              {/* Google Button */}
              <button
                type="button"
                className="w-14 h-14 rounded-full overflow-hidden shadow-lg"
                onClick={() => handleSocialLogin('google')}
              >
                <img
                  src={googleImage}
                  alt="Google Login"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Kakao Button */}
              <button
                type="button"
                className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-[#FEE500] flex items-center justify-center"
                onClick={() => handleSocialLogin('kakao')}
              >
                <img
                  src={kakaoImage}
                  alt="Kakao Login"
                  className="w-[120%] h-auto object-contain"
                />
              </button>

              {/* Naver Button */}
              <button
                type="button"
                className="w-14 h-14 rounded-full overflow-hidden shadow-lg"
                onClick={() => handleSocialLogin('naver')}
              >
                <img
                  src={naverImage}
                  alt="Naver Login"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </form>
        ) : (
            //회원가입 폼
            <form className="max-w-md md:ml-auto w-full" onSubmit={handleSignSubmit}>
              <h3 className="text-gray-800 text-3xl font-extrabold mb-8">Register</h3>
              <div className="space-y-4">
                <div>
                  <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <input
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                  />
                </div>
              </div>

              {!isPasswordValid && (
                  <p className="text-red-500 text-sm mt-2">비밀번호가 일치하지 않습니다.</p>
              )}

              <button
                  type="submit"
                  disabled={!isPasswordValid} // 비밀번호 일치 여부에 따라 버튼 활성화/비활성화
                  className="mt-8 w-full bg-blue-600 text-white text-sm font-semibold py-3.5 rounded-md hover:bg-blue-700"
              >
                Register
              </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default Login;
