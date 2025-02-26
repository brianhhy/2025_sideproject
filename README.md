# 📌 2025 Side Project - AI 기반 스터디 도우미

> **2025 생성형 AI를 활용한 스터디 도우미 프로젝트**  
> AI를 활용하여 학습을 보조하는 시스템으로, 클라우드 기반의 데이터 관리 및 파일 저장 기능을 제공합니다.

---

## 🚀 프로젝트 주요 기능

- 🔹 **OAuth & 일반 로그인 적용**
- 🔹 **파일 디렉토리 시스템 구축**
- 🔹 **Cloud SQL & Cloud Storage 연동**

---

## ☁️ 클라우드 서비스 적용
### 🔹 1️⃣ Cloud SQL (MySQL) 적용

#### ✅ **원격 접속 방법 (CMD에서 실행)**
```sh
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"  # MySQL 위치 이동
mysql -h 34.64.73.187 -P 3306 -u min828237yfsafhuq2@@ -p  # 원격 서버 접속
🔐 비밀번호는 압축 파일에 포함되어 있습니다
use mainDB;     -- 데이터베이스 선택
show tables;    -- 테이블 목록 확인
```

🔹 2️⃣ Cloud Storage 적용
Google Cloud Storage를 사용하여 파일 업로드 및 관리합니다.

📂 서버 내부 필수 파일: 안에있는 압축파일에 있습니다. 
  
⚠️ 중요:
.env와 google_cloud_storage_key.json 파일은 Git에 푸시하지 마세요!
.gitignore에 추가하여 보안을 유지하세요.

---

##### ✅인텔리제이 Backend 부팅 설정(필요시)

build.gradle 우클릭후 Link Gradle Project 클릭

##### ✅02/16 Contents -> Document -> Summary 데이터 이동 추가
요약하기,저장하고나가기,새노트추가(저장하고나가기),노트 불러오기 구현
pdf같은 파일 그냥 txt로 강제변환해서 저장되게 해놈
Document에서 요약해서 Summary 가는건 일단 Chatgpt Response 받아서 내용만
가게 설정해놨습니다. 주제 이런거 형식 일단 안해놈

##### ✅02/26 Question,review 기능 추가
요약된 내용을 바탕으로 문제 생성 및 답확인(review) 기능 구현
간단하게 문제 5개만 만들어주게 해놈
gpt => 내용요약(summary),퀴즈생성(question) 에서 두번 사용됨
question 페이지 리다이렉트 못하게 해놈 (퀴즈생성 계속해서)
question쓰려면 파일 들어가서 요약후 문제생성 





