import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom"; // React Router의 useNavigate 가져오기
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {getFileToText} from "../utils/contents/getDataUtil";
import {saveFile} from "../utils/contents/uploadUtil";
import {getGptResponse} from "../utils/summaryandquiz/gptRequest";
const Document = ({ menuItems, setMenuItems, fetchMenuItems }) => {
  const [sections, setSections] = useState([""]); // 여러 섹션 상태
  const [menuVisible, setMenuVisible] = useState(false); // Speed Dial 메뉴 상태
  const [textColor, setTextColor] = useState("black"); // 글씨 색 상태
  const [chatVisible, setChatVisible] = useState(false); // 채팅창 상태
  const [modalVisible, setModalVisible] = useState(false); // 모달 창 상태
  const [progress, setProgress] = useState(0); // 로딩바 상태
  const [showConfirmation, setShowConfirmation] = useState(false); // 확인창 상태
  const { folderId,fileId } = useParams(); // ✅ URL에서 fileId 가져오기
  const [selectedFolder, setSelectedFolder] = useState(null); // 현재 선택된 폴더
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 폴더 내 파일 목록
  const hasRequested = useRef(false); // ✅ API 요청 여부를 추적하는 변수
  const navigate = useNavigate();

  // 섹션 내용 변경 핸들러
  const handleContentChange = (index, event) => {
    const newSections = [...sections];
    newSections[index] = event.target.value;
    setSections(newSections);

    // 마지막 섹션의 텍스트 영역이 가득 차면 새 섹션 추가
    if (
      index === sections.length - 1 && // 마지막 섹션인지 확인
      event.target.scrollHeight > event.target.offsetHeight
    ) {
      setSections([...sections, ""]);
    }
  };

  // Speed Dial 메뉴 토글
  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  // 글씨 색 변경 핸들러
  const changeTextColor = (color) => {
    setTextColor(color);
  };

  // 채팅창 토글 핸들러
  const toggleChat = () => {
    setChatVisible((prev) => !prev);
  };
  const openModal = () => {
    setShowConfirmation(true); // 먼저 확인 창을 띄움
  };

  //GPT_API 요청
  const startLoading = async () => {
    setShowConfirmation(false); // 확인 창 닫기
    setModalVisible(true); // 로딩 창 열기

    const response = await getGptResponse(JSON.stringify(sections),"summary"); // ✅ Promise 해결 후 response 받기
    console.log("🚀 요약된 결과:", response);

    if (response) {
      localStorage.setItem("SummaryResponse", response); // ✅ 해결된 값만 저장
    } else {
      console.error("❌ response가 비어 있음.");
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  };
  
  // 모달 닫기 핸들러
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSaveAndExit = async () => {
    // localStorage.setItem("savedSections", JSON.stringify(sections)); // 데이터 저장
    console.log("handleSaveAndExit: ", sections);
    const res = await saveFile(folderId, fileId, null, sections);
    if (res) {
      fetchMenuItems();
    }
    navigate("/memo"); // 페이지 이동
  };

  useEffect(() => {
    if (!fileId){
      setSections([""]);
      return;
    } // ✅ fileId가 없으면 빈섹션

    getFileToText(fileId).then((savedData) => {
      if (savedData) {
        setSections(savedData.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").split("---"));
      }
    }).catch((error) => console.error("❌ 데이터 가져오기 오류:", error));
  }, [fileId]); // ✅ fileId가 변경될 때만 실행



  useEffect(() => {
    if (modalVisible) {
      let startTime;
      let lastFrameTime = 0;
      const duration = 3000; // 총 3초 동안 진행
      const frameInterval = 1000 / 144; // 144FPS로 조정 (6.94ms)
  
      const animateProgress = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
  
        // 프레임 간격 조정 (144FPS에 맞춰 실행)
        if (timestamp - lastFrameTime >= frameInterval) {
          lastFrameTime = timestamp;
  
          // 3초 동안 선형적으로 증가
          const progressValue = Math.min((elapsed / duration) * 100, 2000);
          setProgress(progressValue);
        }
  
        if (elapsed < duration) {
          requestAnimationFrame(animateProgress);
        }
      };
  
      requestAnimationFrame(animateProgress);
  
      return () => setProgress(0); // 모달이 닫히면 progress 초기화
    }
  }, [modalVisible]);
  
  
  

  // 로딩이 완료되면 자동으로 /memo/docs 페이지로 이동
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        navigate("/memo/docs/summary"); // ✅ 페이지 이동
      }, 500);
    }
  }, [progress, navigate]);

  return (
      <div className="flex w-full h-screen bg-gray-200 relative">
        {/* Left Sidebar
          이 부분에 페이지, 책장, 책, 챕터 대신 db에서 받아온 책장 이름, 책 이름, 챕터 이름이 나와야함*/}
        <div
            className="fixed bottom-0 left-0 w-1/5 min-h-[80%] bg-white border-r border-gray-300 p-4 flex flex-col rounded-tr-lg">
          <h2 className="text-lg font-bold mb-4">페이지</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer p-2 hover:bg-gray-100 rounded-md">책장</li>
            <li className="cursor-pointer p-2 hover:bg-gray-200 rounded-md">책</li>
            <li className="cursor-pointer p-2 hover:bg-gray-200 rounded-md pl-4">챕터</li>
          </ul>

          {/* 버튼을 클릭했을 때 textarea에 있는 text들이 저장되어야 함 textarea는 166줄부터*/}
          <div className="relative flex-grow">
            <button
                type="button"
                onClick={handleSaveAndExit} // 저장 후 라우팅
                className="absolute bottom-4 right-4 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              저장하고 나가기
            </button>

          </div>
        </div>


        {/* Main Content Area */}
        <div className="flex-grow flex justify-center items-start overflow-auto">
          <div className="flex flex-col items-center mt-8">
            {sections.map((content, index) => (
              <div
                key={index}
                className="bg-white w-[210mm] h-[297mm] shadow-lg border border-gray-300 rounded-md relative mb-4"
              >
                <textarea
                  value={content}
                  onChange={(event) => handleContentChange(index, event)}
                  style={{ color: textColor }}
                  className="absolute inset-0 w-full h-full border-none focus:outline-none resize-none text-lg bg-white p-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div
            className="fixed bottom-0 right-4 w-[calc(20%-10px)] h-[80%] bg-white border-l border-gray-300 p-4 flex flex-col rounded-tl-lg shadow-lg"
        >
          {/* Setting Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
              <h3 className="text-sm font-bold">세팅</h3>
              <KeyboardArrowDownIcon className="text-gray-500 cursor-pointer"/>
            </div>
            <div className="mb-2">
              <input
                  type="text"
                  placeholder="챕터 이름"
                  className="border border-gray-300 w-full rounded-md p-1 text-sm"
              />
            </div>
          </div>


          {/* Text Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
              <h3 className="text-sm font-bold">텍스트</h3>
              <KeyboardArrowDownIcon className="text-gray-500 cursor-pointer"/>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <select className="border border-gray-300 p-1 rounded-md text-sm">
                <option>Regular</option>
                <option>Bold</option>
                <option>Italic</option>
              </select>
              <input
                  type="number"
                  defaultValue={12}
                  className="border border-gray-300 p-1 rounded-md text-sm w-12 text-center"
              />
              <button className="font-bold">B</button>
              <button className="underline">U</button>
              <button className="italic">I</button>
            </div>
          </div>

          {/* Page Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
              <h3 className="text-sm font-bold">페이지</h3>
              <KeyboardArrowDownIcon className="text-gray-500 cursor-pointer"/>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2">
                <NoteAddIcon style={{fontSize: "20px"}}/>
                <span className="font-bold">새 페이지</span>
              </button>
              <button className="flex items-center space-x-2">
                <PictureAsPdfIcon style={{fontSize: "20px"}}/>
                <span className="font-bold">PDF 추가</span>
              </button>
            </div>
          </div>

          {/* Record Section */}
          {/*녹음 버튼을 클릭하면*/}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
              <h3 className="text-sm font-bold">녹음</h3>
              <KeyboardArrowDownIcon className="text-gray-500 cursor-pointer"/>
            </div>
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <MicIcon style={{color: "white", fontSize: "24px"}}/>
              </button>
              <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <PlayArrowIcon style={{color: "white", fontSize: "24px"}}/>
              </button>
              <button className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <PauseIcon style={{color: "white", fontSize: "24px"}}/>
              </button>
              <button className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                <StopIcon style={{color: "white", fontSize: "24px"}}/>
              </button>
            </div>
          </div>


          {/* Chat Section */}
          {chatVisible && (
              <div className="fixed bottom-0 right-4 w-[calc(20%-10px)] h-[40%] p-4 rounded-t-lg shadow-lg">
                <div className="flex justify-between items-center bg-blue-500 rounded-t-lg h-12">
                  <h3 className="text-xl text-white ml-2 font-bold">질문하기</h3>
                  <button
                      onClick={toggleChat}
                      className="mr-4 text-xl font-extrabold text-white"
                  >
                    X
                  </button>
                </div>
                <div className="h-[70%] bg-gray-100 p-2 rounded-md overflow-auto">
                  <div
                      className="relative bg-white text-blue-800 text-sm px-4 py-2 rounded-lg shadow-lg inline-flex items-center"
                      style={{fontSize: 'inherit', padding: '0.5em 1em'}}
                  >
                    질문을 입력해주세요😎
                    <div
                        className="absolute bottom-[-10px] left-4 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent"
                    ></div>
                  </div>


                </div>
                <div className="flex items-center mt-2">
                  <input
                      type="text"
                      placeholder="입력하기"
                      className="flex-grow border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                    전송
                  </button>
                </div>
              </div>
          )}

          {/* Speed Dial */}
          <div className="fixed bottom-6 right-[26%] z-50 group">
            <div
                id="speed-dial-menu-dropdown-alternative"
                className={`flex flex-col justify-end ${
                    menuVisible ? "" : "hidden"
                } py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 z-50`}
            >
              <ul className="text-sm text-gray-500 dark:text-gray-300">
                <li className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <button
                      onClick={toggleChat}
                      className="flex items-center px-5 py-2 border-b border-gray-200 hover:text-gray-900 dark:hover:text-white dark:border-gray-600 w-full text-left"
                  >
                    질문하기
                  </button>
                </li>
                <li className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <button
                      onClick={openModal}
                      className="flex items-center px-5 py-2 border-b border-gray-200 hover:text-gray-900 dark:hover:text-white dark:border-gray-600 w-full text-left"
                  >
                    스캔 후 질문하기
                  </button>
                </li>
                <li className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <button
                      onClick={openModal}  // 모달 열기 함수 추가
                      className="flex items-center px-5 py-2 hover:text-gray-900 dark:hover:text-white w-full text-left"
                  >
                    요약하기
                  </button>
                </li>

              </ul>
            </div>
            <button
                type="button"
                onClick={toggleMenu}
                aria-expanded={menuVisible}
                className="flex items-center justify-center ml-auto text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
              >
                <path
                    d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z"/>
              </svg>
              <span className="sr-only">Open actions menu</span>
            </button>
          </div>
          {/* 4번(확인 모달) */}
          {showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg w-auto">
                  <h2 className="text-xl font-semibold mb-4 text-center">현재까지 필기된 내용으로 요약을 진행할까요?</h2>
                  <div className="flex justify-center space-x-4">
                    <button
                        onClick={startLoading} // "예"를 누르면 로딩 시작 (5번으로 전환)
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                      예
                    </button>
                    <button
                        onClick={() => setShowConfirmation(false)} // "아니오"를 누르면 확인 모달 닫기
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
                    >
                      아니오
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* 5번(로딩 모달) */}
          {modalVisible && !showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">요약중입니다!</h2>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative overflow-hidden">
                    <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-200 ease-in-out"
                        style={{width: `${progress}%`}}
                    ></div>
                  </div>
                  {progress >= 100 ? (
                      <p className="text-green-500 font-bold text-center">완료!</p>
                  ) : (
                      <p className="text-gray-500 text-sm">진행 중...</p>
                  )}
                </div>
              </div>
          )}

        </div>
      </div>
  );
};

export default Document;
