import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Contents from "./components/Contents";
import LoginSignup from "./components/Login-Signup";
import Document from "./components/Document"; // Document 컴포넌트 추가
import { pdfjs } from "react-pdf";
import PdfViewerTest from "./components/PdfViewerTest";
import {getMenuItems} from "./utils/contents/getDataUtil";
import LoginTest from "./components/Login-Test";
import Summary from "./components/Summary";

// PDF.js Worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `public/pdf.worker.min.js`;

// Home 컴포넌트
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={() => navigate("/memo")}
            >
                Memo
            </button>
            <button
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                onClick={() => navigate("/login")}
            >
                Login
            </button>
            <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                onClick={() => navigate("/loginTest")}
            >
                LoginTest
            </button>
        </div>
    );
};

// Memo 컴포넌트
const Memo = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]); // 동적 데이터 저장

    useEffect(() => {
        fetchMenuItems();
    }, []);

    //menuItem 서버에서 가져오기
    const fetchMenuItems = async () => {
        try {
            const items = await getMenuItems();
            setMenuItems(items); // ✅ 데이터 업데이트
        } catch (error) {
            console.error("❌ MenuItems 데이터 불러오기 실패:", error.message);
        }
    };

    const handleMenuClick = (index) => {
        console.log(`Menu item ${index} clicked`);
    };

    return (
        <div className="flex w-full h-screen">
            <Contents
                menuItems={menuItems} // Contents에 메뉴 전달
                fetchMenuItems={fetchMenuItems}
                handleMenuClick={handleMenuClick} // Sidebar의 handleMenuClick 전달
                className="flex-grow" // 남은 공간을 채우도록 설정
            />
            <button
                className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={() => navigate("/memo/docs")}
            >
                Open Document
            </button>
        </div>
    );
};

// App 컴포넌트
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/memo" element={<Memo />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/loginTest" element={<LoginTest />} />
                <Route path="/memo/docs" element={<Document />} /> {/* Document 라우트 추가 */}
                <Route path="memo/docs/summary" element={<Summary />}/>
            </Routes>
        </Router>
    );
};

export default App;
