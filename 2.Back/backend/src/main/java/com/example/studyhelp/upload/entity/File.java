package com.example.studyhelp.upload.entity;

import com.example.studyhelp.sign.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@ToString(exclude = {"storedName"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class File extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;
    private String originalFileName;
    private String storedName;

    // ✅ 파일이 속한 폴더 (오타 수정 및 컬럼명 수정)
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false) // ✅ 외래 키 컬럼명 수정
    private Folder parentFolder;

    @Builder
    public File(Long memberId, String originalFileName, Folder parentFolder) {
        this.memberId = memberId;
        this.originalFileName = originalFileName;
        this.storedName = UUID.randomUUID().toString();
        this.parentFolder = parentFolder; // ✅ 올바르게 매핑
    }

    // ✅ 파일 이름 변경 메서드
    public void rename(String newName) {
        this.originalFileName = newName;
    }
}


