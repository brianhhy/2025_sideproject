package com.example.studyhelp.upload.repository;

import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.response.FolderResponseDto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder,Long> {
    @EntityGraph(attributePaths = "files") // ✅ 폴더와 함께 파일도 가져오기
    Optional<List<Folder>> findAllByParentFolderIdAndMemberId(Long parentFolderId,Long MemberId);
    Optional<Folder> findFolderByIdAndMemberId(Long id,Long memberId);
}
