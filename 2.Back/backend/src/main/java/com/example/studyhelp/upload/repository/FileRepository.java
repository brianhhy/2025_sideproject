package com.example.studyhelp.upload.repository;

import com.example.studyhelp.upload.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File,Long> {
    Optional<List<File>> findAllByMemberId(Long memberId);
    Optional<List<File>> findAllByParentFolderIdAndMemberId(Long parentFolderId,Long memberId);
    Optional<File> findFileByIdAndAndMemberId(Long id,Long memberId);
}
