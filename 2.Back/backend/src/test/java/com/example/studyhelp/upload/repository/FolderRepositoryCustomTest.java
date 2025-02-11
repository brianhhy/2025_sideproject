package com.example.studyhelp.upload.repository;

import com.example.studyhelp.config.QueryDslConfig;
import com.example.studyhelp.upload.entity.File;
import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.response.FolderResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest // ✅ JPA 관련 설정만 로드
@Slf4j
@Import({FolderRepositoryCustom.class, QueryDslConfig.class}) // ✅ FolderRepositoryCustom을 직접 로드
class FolderRepositoryCustomTest {

    @Autowired
    private FolderRepositoryCustom folderRepositoryCustom;

    @Autowired
    private FolderRepository folderRepository;
    @Autowired
    private FileRepository fileRepository;

    @BeforeEach
    void before() {

        for (int i = 0; i < 5; i++) {
            Folder folder = Folder.builder()
                    .memberId(1L)
                    .parentFolder(null)
                    .folderName("폴더 이름 " + i * i * i)
                    .build();

            folderRepository.save(folder);
            for(int j =0;j<5;j++){
                File file = File.builder()
                        .memberId(1L)
                        .originalFileName("[" + i + "]" + "파일이름" + j + j)
                        .storedName(UUID.randomUUID().toString())
                        .parentFolder(folder).build();
                fileRepository.save(file);
            }

        }
    }

    @Test
    public void findFolders() {
        long memberId = 1L;
        List<FolderResponseDto> subFolders = folderRepositoryCustom.findSubFolders(null, memberId);
        for (FolderResponseDto folder : subFolders) {
            System.out.println("📂 Folder ID: " + folder.getFolderId() + " (" + folder.getFolderName() + ")");
            for (String fileName : folder.getFileNames()) {
                System.out.println("   ├── " + fileName);
            }
            System.out.println();
        }
    }

    @Test
    public void findFileAndFolderInDir() {
        Optional<List<File>> allByMemberId = fileRepository.findAllByMemberId(1L);
        List<File> files = allByMemberId.orElseThrow(() -> new RuntimeException());
        log.info("files = {}",files);

    }

    @Test
    public void findFileAndFolderInDir2() {
        List<Folder> folders = folderRepository.findAllByParentFolderIdAndMemberId(null, 1L)
                .orElseThrow(() -> new RuntimeException());

        for (Folder folder : folders) {
            Optional<List<File>> allByMemberId = fileRepository.findAllByParentFolderIdAndMemberId(folder.getId(),1L);
            List<File> files = allByMemberId.orElseThrow(() -> new RuntimeException());
            log.info("files = {}",files);
        }

    }

    @Test
    public void findFolderInDir() {
        List<Folder> folders = folderRepository.findAllByParentFolderIdAndMemberId(null,1L).orElseThrow(() -> new RuntimeException());
        log.info("folders = {}",folders);
        for (Folder folder : folders) {
            List<File> files = folder.getFiles();
            log.info("files = {}",files);
        }
    }
}

