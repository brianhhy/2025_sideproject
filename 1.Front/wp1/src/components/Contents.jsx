import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Sidebar 컴포넌트 불러오기
import { useNavigate } from "react-router-dom";

const Contents = ({ menuItems = [], handleMenuClick }) => {
  const [activeContent, setActiveContent] = useState(null); // Sidebar에서 전달된 JSX를 저장
  const navigate = useNavigate(); // React Router의 navigate 함수 사용

  const handleContentClick = (index) => {
    const selectedMenuItem = menuItems[index];
    setActiveContent(
      <div className="flex flex-wrap items-center justify-center w-full h-full gap-4 p-4">
        {selectedMenuItem.subItems.map((subItem, subIndex) => (
          <div
            key={subIndex}
            className="w-[200px] h-[300px] border border-gray-300 rounded-lg shadow-md flex flex-col items-center relative"
          >
            <div className="absolute top-0 left-0 w-8 h-full bg-red-500 rounded-l-lg"></div>
            <div className="flex flex-col justify-center items-center w-full h-full">
              <span
                className="text-lg font-bold text-gray-800 mt-2"
                style={{
                  writingMode: "vertical-rl", // 세로로 배치
                  textOrientation: "upright", // 글자 방향
                }}
              >
                {subItem}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleContentLoad = (content) => {
    setActiveContent(content); // Sidebar에서 전달된 내용을 저장
  };

  return (
    <div className="flex flex-row w-full h-screen bg-gray-50">
      <div className="w-1/4 bg-white h-full">
        <Sidebar
          menuItems={menuItems} // 메뉴 아이템 전달
          onContentLoad={handleContentLoad} // Content Load 핸들러 전달
          handleMenuClick={handleMenuClick} // Handle Menu Click 전달
        />
      </div>
      <div className="flex flex-col w-3/4 h-full relative">
        <h1 className="text-xl font-bold mb-4 absolute top-4">책장</h1>
        {/*<button
          className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/login")} //로그인 버튼
        >
          Login
        </button>*/}   
        <div className="flex flex-col items-center justify-center h-full">
          {activeContent ? (
            activeContent
          ) : menuItems && menuItems.length > 0 ? (
            <div className="flex flex-col items-start p-4">
              <div className="grid grid-cols-4 mt-5 mr-80 gap-x-24 gap-y-12">
                {menuItems.map((menuItem, index) => (
                  <div
                    key={index}
                    className="relative flex items-center p-4 bg-white cursor-pointer border border-transparent"
                    onClick={() => handleContentClick(index)}
                  >
                    <h2 className="absolute top-2 left-2 text-lg font-semibold text-gray-800">{menuItem.name}</h2>
                    <div
                      className="flex flex-row gap-2 mt-8 border-l-8 border-gray-500 pl-4 rounded-l-lg"
                      style={{ flexShrink: 0 }}
                    >
                      {menuItem.subItems && menuItem.subItems.length > 0 ? (
                        menuItem.subItems.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className="shrink-0 flex items-center justify-center w-12 h-40 bg-blue-500 text-white text-sm font-medium rounded cursor-pointer"
                            style={{
                              writingMode: "vertical-rl", // 세로로 배치
                              textOrientation: "upright", // 글자 방향
                            }}
                          >
                            {subItem}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">책이 없습니다</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">책장이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contents;
