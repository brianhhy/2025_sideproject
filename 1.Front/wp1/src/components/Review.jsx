import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// // 객관식 문제 데이터 배열 (Questions.jsx와 동일)
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

const Review = () => {
  const navigate = useNavigate();
  // Questions.jsx에서 저장한 데이터(localStorage)를 불러옴
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizData,setQuizData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("quizAnswers");
    if (storedData) {
      const data = JSON.parse(storedData);
      setSelectedAnswers(data.selectedAnswers);
      setQuizData(data.quizData);
    }
  }, []);

  const totalQuestions = quizData.length;
  const correctCount = quizData.reduce((acc, question, index) => {
    return acc + (selectedAnswers[index] === question.answerIndex ? 1 : 0);
  }, 0);

  const currentQuiz = quizData.length > 0 ? quizData[currentQuestionIndex] : null;

  if (!currentQuiz) {
    return <p className="text-gray-500 text-center">퀴즈 데이터를 불러오는 중...</p>;
  }

  return (
    <div className="flex w-full h-screen bg-gray-200 relative">
      {/* 왼쪽 사이드바: 맞춘 문제 수 표시 */}
      <div className="fixed bottom-0 left-0 w-1/5 min-h-[80%] bg-white border-r border-gray-300 p-4 flex flex-col rounded-tr-lg">
        <h1 className="font-extrabold text-4xl text-center p-16">맞춘 문제</h1>
        <h1 className="font-extrabold text-4xl text-center p-16">
          {correctCount} / {totalQuestions}
        </h1>
      </div>

      {/* 메인 콘텐츠 영역: 문제와 선택지 표시 */}
      <div className="flex-grow flex justify-center items-start overflow-auto">
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white w-[370mm] h-[297mm] shadow-lg border border-gray-300 rounded-md relative mb-4 p-4 flex flex-col">
            {/* 문제 영역 */}
            <div className="h-[66%] p-4">
              <h2 className="text-lg font-bold">문제 {currentQuestionIndex + 1}</h2>
              <p className="text-md mt-2">{currentQuiz.question}</p>
            </div>
            <div className="border-b border-gray-300 my-1"></div>
            {/* 선택지 영역 */}
            <div className="h-[34%] p-2 flex flex-row justify-center space-x-64">
              {currentQuiz.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === currentQuiz.answerIndex;
                const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
                // 정답인 경우는 항상 border-green-500, 
                // 선택했지만 오답이면 border-red-500, 나머지는 border 없음
                const borderClass = isCorrect 
                  ? "border-2 border-green-500" 
                  : (isSelected ? "border-2 border-red-500" : "");
                return (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      className="w-4 h-4"
                      checked={isSelected}
                      readOnly
                    />
                    <span className={`${borderClass} p-1`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
            {/* 네비게이션 버튼 */}
            <div className="absolute bottom-4 left-4">
              <button
                type="button"
                onClick={() =>
                  currentQuestionIndex > 0 &&
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                disabled={currentQuestionIndex === 0}
                className={`text-black hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                  currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="rotate-180 w-3.5 h-3.5 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                이전
              </button>
            </div>
            <div className="absolute bottom-4 right-4">
              <button
                type="button"
                onClick={() =>
                  currentQuestionIndex < totalQuestions - 1 &&
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                disabled={currentQuestionIndex === totalQuestions - 1}
                className={`text-black hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                  currentQuestionIndex === totalQuestions - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                다음
                <svg
                  className="w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바: 문제 리스트 */}
      <div className="fixed bottom-0 right-4 w-[calc(20%-10px)] h-[80%] bg-white border-l p-4 flex flex-col rounded-tl-lg shadow-lg overflow-auto">
        <div className="max-w-5xl mx-auto mt-8">
            {quizData.map((quiz, index) => {
            const isAnswered = selectedAnswers[index] !== undefined;
            const isCorrect = isAnswered && selectedAnswers[index] === quiz.answerIndex;
            return (
                <div
                key={index}
                className="border-l-2 pl-8 hover:bg-gray-200 p-2 mb-2 cursor-pointer flex items-center"
                onClick={() => setCurrentQuestionIndex(index)}
                >
                {/* 작은 동그라미 */}
                <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                    isAnswered ? (isCorrect ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
                    }`}
                ></span>
                <div>
                    <h3 className="text-xl font-bold">문제 {index + 1}</h3>
                    <p className="text-gray-700">{quiz.question}</p>
                </div>
                </div>
            );
            })}
        </div>
        <div className="mt-auto"> {/* Sidebar 하단에 고정 */}
          <button
            onClick={() => navigate("/memo")} // 문제 생성 페이지로 이동
            className="w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            학습으로 돌아가기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
