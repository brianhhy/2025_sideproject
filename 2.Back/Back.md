# 2025_sideproject
2025 생성형 ai를 활용한 스터디 도우미

# 1. Cloud SQL 적용
# 2. Cloud Storage 적용
OAuth, 일반 로그인 적용
파일 디렉토리 로직 완료

클라우드 DB MYSQL 접속방법(CMD)
- cd C:\Program Files\MySQL\MySQL Server 8.0\bin (나의 mysql 위치)
  mysql -h 34.64.73.187 -P 3306 -u min828237yfsafhuq2@@ -p (원격서버 접속(mysql위치에서))
- 비번은 압축안에 있음
- use mainDB;
- show tables;

서버 내부파일 적용(이걸 뭐라하지.. gpt가 알아서 이름지어)
- 백엔드 resources안에 google_cloud_storage_key.json 넣기
- 2025_sideproject(최상단 루트)에 .env 넣기
- 