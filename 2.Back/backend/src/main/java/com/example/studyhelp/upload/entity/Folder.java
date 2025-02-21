package com.example.studyhelp.upload.entity;

import com.example.studyhelp.sign.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString(exclude = {"folderName","parentFolder"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Folder extends BaseEntity {
    @Id
    @GeneratedValue
    private Long id;

    private Long memberId; // 클라이언트 ID
    private String folderName;

    // 부모 폴더 (Self-Referencing Many-to-One 관계)
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;

    // 하위 폴더들 (Self-Referencing One-to-Many 관계)
    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> subFolders = new ArrayList<>();

    // 이 폴더가 가진 파일들
    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> files = new ArrayList<>();


    @Builder
    public Folder(Long memberId, String folderName, Folder parentFolder) {
        this.memberId = memberId;
        this.folderName = folderName;
        this.parentFolder = parentFolder;
    }

    public void renameFolder(String newName){
        folderName = newName;
    }

    // 하위 폴더 추가 메서드
    public void addSubFolder(Folder subFolder) {
        subFolders.add(subFolder);
        subFolder.setParentFolder(this);
    }

    // 파일 추가 메서드
        public void addFile(File file) {
            files.add(file);
            file.setParentFolder(this);
    }

    // 파일 삭제 메서드
    public void removeFile(File file) {
        files.remove(file);
        file.setParentFolder(null);
    }
}

