import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFileToText } from "../utils/contents/getDataUtil";
import { saveFile } from "../utils/contents/uploadUtil";
import {getGptResponse, settingJsonData} from "../utils/summaryandquiz/gptRequest";

// 객관식 문제 데이터 배열
// const quizData = [
//   {
//     question: "한국의 수도는 어디인가요?",
//     options: ["부산", "서울", "인천", "대구"],
//     answerIndex: 1 // 서울
//   },
//   {
//     question: "2 + 2는 얼마인가요?",
//     options: ["2", "3", "4", "5"],
//     answerIndex: 2 // 4
//   },
//   {
//     question: "태양계에서 가장 큰 행성은 무엇인가요?",
//     options: ["지구", "토성", "목성", "수성"],
//     answerIndex: 2 // 목성
//   }
// ];

const Questions = ({ menuItems, setMenuItems, fetchMenuItems }) => {
  const [textColor, setTextColor] = useState("black");
  const [chatVisible, setChatVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizData,setQuizData] = useState([]);
  // const [quizData, setQuizData] = useState(null);
  const { folderId, fileId } = useParams();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const hasRequested = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const requestQuizData = async () => {
      const summaryContent = localStorage.getItem("QuizContent");
      console.log(`summaryContent = ${summaryContent}`);
      if (summaryContent) {
        const gptResponse = await getGptResponse(JSON.stringify(summaryContent), "quiz");
        localStorage.removeItem("QuizContent")
        if (gptResponse) {
          console.log(`quiz gptResponse = ${gptResponse}`);
          setQuizData(settingJsonData(gptResponse));
        }
      }else{
        alert("summaryContent가 존재하지 않습니다.");
        navigate("/memo/docs/summary");
      }
    }

    requestQuizData();
  },[])

  // countdown 초기값 20분 = 1200초
  const [countdown, setCountdown] = useState(1200);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // 현재 표시할 문제 인덱스 (한 번에 한 문제씩 보임)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 문제별로 선택한 답안을 저장 (key: 문제 인덱스, value: 선택한 옵션 인덱스)
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // "다음" 버튼 클릭 시 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // "이전" 버튼 클릭 시 이전 문제로 이동
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 제출하기 버튼 핸들러: 선택한 답안 데이터를 저장한 후 review 페이지로 라우팅
  const handleSubmit = () => {
    // 예시: selectedAnswers와 quizData를 묶어서 localStorage에 저장
    const answersData = {
      selectedAnswers,
      quizData
    };
    localStorage.setItem("quizAnswers", JSON.stringify(answersData));
    navigate("/memo/docs/summary/questions/review");
  };

  // 글씨 색 변경 핸들러
  const changeTextColor = (color) => {
    setTextColor(color);
  };

  // 현재 문제 데이터
  const currentQuiz = quizData[currentQuestionIndex];

  // 분, 초로 변환
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  // 현재 문제 데이터 (quizData가 비어있지 않다면 설정)
  const isQuizDataValid = quizData.length > 0 ? quizData[currentQuestionIndex] : null;
  if (!isQuizDataValid) {
    return <p className="text-gray-500 text-center">퀴즈를 생성하는중...</p>;
  }

  return (
      <div className="flex w-full h-screen bg-gray-200 relative">
        {/* Left Sidebar */}
        <div className="fixed bottom-0 left-0 w-1/5 min-h-[80%] bg-white border-r border-gray-300 p-4 flex flex-col rounded-tr-lg">
          <h1 className="font-extrabold text-4xl text-center p-16">남은 시간</h1>
          <h1 className="font-extrabold text-4xl text-center p-16">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex justify-center items-start overflow-auto">
          <div className="flex flex-col items-center mt-8">
            <div className="bg-white w-[370mm] h-[297mm] shadow-lg border border-gray-300 rounded-md relative mb-4 p-4 flex flex-col">
              {/* 문제 영역 */}
              <div className="h-[66%] p-4">
                <h2 className="text-lg font-bold">문제 {currentQuestionIndex + 1}</h2>
                <p className="text-md mt-2">
                  {currentQuiz.question}
                </p>
              </div>

              <div className="border-b border-gray-300 my-1"></div>

              {/* 선택지 영역 */}
              <div className="h-[34%] p-2 flex flex-row justify-center space-x-64">
                {currentQuiz.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2">
                      <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          className="w-4 h-4"
                          checked={selectedAnswers[currentQuestionIndex] === optionIndex}
                          onChange={() =>
                              setSelectedAnswers({
                                ...selectedAnswers,
                                [currentQuestionIndex]: optionIndex,
                              })
                          }
                      />
                      <span>{option}</span>
                    </label>
                ))}
              </div>

              {/* 페이지 이동 버튼 */}
              <div className="absolute bottom-4 left-4">
                <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`text-black hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <svg className="rotate-180 w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                  이전
                </button>
              </div>

              <div className="absolute bottom-4 right-4">
                <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === quizData.length - 1}
                    className={`text-black hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${currentQuestionIndex === quizData.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  다음
                  <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </button>
              </div>

              {/* 마지막 문제일 때 제출하기 버튼 (이전/다음 버튼 사이 중앙) */}
              {currentQuestionIndex === quizData.length - 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    >
                      제출하기
                    </button>
                  </div>
              )}

            </div>
          </div>
        </div>

        {/* 문제 리스트 (우측 사이드바) */}
        <div className="fixed bottom-0 right-4 w-[calc(20%-10px)] h-[80%] bg-white border-l border-gray-300 p-4 flex flex-col rounded-tl-lg shadow-lg overflow-auto">
          <div className="max-w-5xl mx-auto mt-8">
            {quizData.map((quiz, index) => (
                <div
                    key={index}
                    className={`border-l-2 ${selectedAnswers[index] !== undefined ? "border-blue-700" : "border-gray-500"} pl-8 hover:bg-gray-200 p-2 mb-2 cursor-pointer`}
                    onClick={() => setCurrentQuestionIndex(index)}
                >
                  <h3 className="text-xl font-bold">문제 {index + 1}</h3>
                  <p className="text-gray-700">{quiz.question}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Questions;
