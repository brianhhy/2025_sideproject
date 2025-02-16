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

📂 서버 내부 필수 파일: https://drive.google.com/file/d/1sUTliDHTrA8XIuhxxxdXNAo3e-nRvj2Q/view?usp=sharing  
백엔드: backend/resources/google_cloud_storage_key.json  
프로젝트 최상단 루트: 2025_sideproject/.env  
  
⚠️ 중요:
.env와 google_cloud_storage_key.json 파일은 Git에 푸시하지 마세요!
.gitignore에 추가하여 보안을 유지하세요.

---

##### ✅인텔리제이 Backend 부팅 설정(필요시)

build.gradle 우클릭후 Link Gradle Project 클릭

##### ✅02/16 Contents -> Document -> Summary 데이터 이동 추가
pdf같은 파일 그냥 txt로 강제변환해서 저장되게 해놈
Document에서 요약해서 Summary 가는건 일단 Chatgpt Response 받아서 내용만
가게 설정해놨습니다. 주제 이런거 형식 일단 안해놈

.env파일 변경되었습니다.



