package com.example.studyhelp.upload.repository;

import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.entity.QFile;
import com.example.studyhelp.upload.entity.QFolder;
import com.example.studyhelp.upload.response.FolderResponseDto;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

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

}
