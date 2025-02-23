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
import Questions from "./components/Questions";
import Review from "./components/Review";
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
// ✅ Memo 컴포넌트
const Memo = ({ menuItems, setMenuItems, fetchMenuItems }) => {
    useEffect(() => {
        fetchMenuItems(); // ✅ 첫 마운트 시 메뉴 불러오기
    }, []);

    return (
        <div className="flex w-full h-screen">
            <Contents
                menuItems={menuItems}
                fetchMenuItems={fetchMenuItems}
                setMenuItems={setMenuItems}
                className="flex-grow"
            />
        </div>
    );
};

// ✅ App 컴포넌트 (전역 상태 관리)
const App = () => {
    const [menuItems, setMenuItems] = useState([]); // ✅ 메뉴 데이터 상태

    // ✅ 서버에서 menuItems 가져오기
    const fetchMenuItems = async () => {
        try {
            console.log("fetchMenuItems API 호출");
            console.trace("📌 호출 위치 추적");
            const items = await getMenuItems();
            setMenuItems(items);
        } catch (error) {
            console.error("❌ MenuItems 데이터 불러오기 실패:", error.message);
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/memo"
                    element={<Memo
                        menuItems={menuItems}
                        setMenuItems={setMenuItems}
                        fetchMenuItems={fetchMenuItems}
                    />}
                />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/loginTest" element={<LoginTest />} />
                <Route
                    path="/memo/docs/:folderId/:fileId"
                    element={<Document
                        menuItems={menuItems}
                        setMenuItems={setMenuItems}
                        fetchMenuItems={fetchMenuItems}
                    />}
                />
                <Route
                    path="/memo/docs/:folderId"
                    element={<Document
                        menuItems={menuItems}
                        setMenuItems={setMenuItems}
                        fetchMenuItems={fetchMenuItems}
                    />}
                />
                <Route path="/memo/docs/summary" element={<Summary />} />
                <Route path="/memo/docs/summary/questions" element={<Questions />}/>
                <Route path="/memo/docs/summary/questions/review" element={<Review />}/>
            </Routes>
        </Router>
    );
};

export default App;
