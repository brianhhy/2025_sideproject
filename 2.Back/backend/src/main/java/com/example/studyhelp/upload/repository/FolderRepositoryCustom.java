package com.example.studyhelp.upload.repository;

import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.entity.QFile;
import com.example.studyhelp.upload.entity.QFolder;
import com.example.studyhelp.upload.response.FileInfo;
import com.example.studyhelp.upload.response.FolderDataResponseDto;
import com.example.studyhelp.upload.response.FolderResponseDto;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FolderRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public List<FolderResponseDto> findSubFolders(Long parentFolderId, Long memberId) {
        QFolder folder = QFolder.folder;
        QFile file = QFile.file;

        BooleanExpression parentCondition = (parentFolderId == null)
                ? folder.parentFolder.isNull()
                : folder.parentFolder.id.eq(parentFolderId);

        // 📌 Query 실행
        List<Tuple> results = jpaQueryFactory
                .select(
                        folder.id,
                        folder.folderName,
                        file.originalFileName
                )
                .from(folder)
                .leftJoin(file).on(file.parentFolder.eq(folder))
                .where(parentCondition, folder.memberId.eq(memberId))
                .orderBy(folder.id.asc(), file.originalFileName.asc()) // ✅ 정렬
                .fetch();

        log.info("📌 Query Result: {}", results);

        // 📌 폴더별 그룹화 Map (folderId -> FolderResponseDto)
        Map<Long, FolderResponseDto> folderMap = new LinkedHashMap<>();

        for (Tuple row : results) {
            Long folderId = row.get(folder.id);
            String folderName = row.get(folder.folderName);
            String fileName = row.get(file.originalFileName);

            // 📌 해당 folderId가 없으면 새로운 FolderResponseDto 생성
            folderMap.putIfAbsent(folderId, new FolderResponseDto(folderId, folderName, new ArrayList<>()));

            // 📌 해당 폴더의 파일 리스트 가져오기
            List<String> fileNames = folderMap.get(folderId).getFileNames();

            // 📌 최대 3개의 파일만 추가
            if (fileName != null && fileNames.size() < 3) {
                fileNames.add(fileName);
            }
        }

        // 📌 Map을 List로 변환 후 반환
        return new ArrayList<>(folderMap.values());
    }

    public List<FolderDataResponseDto> findSubFoldersAll(Long parentFolderId, Long memberId) {
        QFolder folder = QFolder.folder;
        QFile file = QFile.file;

        BooleanExpression parentCondition = (parentFolderId == null)
                ? folder.parentFolder.isNull()
                : folder.parentFolder.id.eq(parentFolderId);

        // 📌 Query 실행 (모든 파일 정보 포함)
        List<Tuple> results = jpaQueryFactory
                .select(
                        folder.id,
                        folder.folderName,
                        file.id,
                        file.originalFileName,
                        file.updatedAt // ✅ 파일의 수정 시간 추가
                )
                .from(folder)
                .leftJoin(file).on(file.parentFolder.eq(folder))
                .where(parentCondition, folder.memberId.eq(memberId))
                .orderBy(folder.id.asc(), file.originalFileName.asc()) // ✅ 정렬
                .fetch();

        log.info("📌 Query Result: {}", results);

        // 📌 폴더별 그룹화 Map (folderId -> FolderDataResponseDto)
        Map<Long, FolderDataResponseDto> folderMap = new LinkedHashMap<>();

        for (Tuple row : results) {
            Long folderId = row.get(folder.id);
            String folderName = row.get(folder.folderName);
            Long fileId = row.get(file.id);
            String fileName = row.get(file.originalFileName);
            LocalDateTime createdTime = row.get(file.updatedAt); // ✅ 수정 시간

            // 📌 해당 folderId가 없으면 새로운 FolderDataResponseDto 생성
            folderMap.putIfAbsent(folderId, new FolderDataResponseDto(folderId, folderName, new ArrayList<>()));

            // 📌 해당 폴더의 파일 리스트 가져오기
            List<FileInfo> files = folderMap.get(folderId).getFiles();

            // 📌 전체 파일 추가 (최대 3개 제한 제거)
            if (fileId != null && fileName != null) {
                files.add(new FileInfo(fileId, fileName, createdTime));
            }
        }

        // 📌 Map을 List로 변환 후 반환
        return new ArrayList<>(folderMap.values());
    }



}
