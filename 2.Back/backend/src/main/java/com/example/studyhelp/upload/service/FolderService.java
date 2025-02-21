package com.example.studyhelp.upload.service;

import com.example.studyhelp.exception.exceptions.FolderNotFoundException;
import com.example.studyhelp.exception.exceptions.MemberNotFoundException;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.service.MemberService;
import com.example.studyhelp.upload.entity.File;
import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.repository.FolderRepository;
import com.example.studyhelp.upload.repository.FolderRepositoryCustom;
import com.example.studyhelp.upload.request.CreateFolderRequest;
import com.example.studyhelp.upload.request.FindFolderRequest;
import com.example.studyhelp.upload.request.RenameFolderRequest;
import com.example.studyhelp.upload.response.FolderDataResponseDto;
import com.example.studyhelp.upload.response.FolderResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FolderService {

    private final FolderRepository folderRepository;
    private final FolderRepositoryCustom folderRepositoryCustom;
    private final MemberService memberService;

    //폴더생성
    @Transactional
    public boolean createFolder(CreateFolderRequest request,Long memberId){

        Folder parentFolder = null;

        if(request.getParentFolderId() != null){
            parentFolder = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> new IllegalStateException("Parent folder not found"));
        }

        Folder folder = Folder.builder()
                .folderName(request.getFolderName())
                .parentFolder(parentFolder)
                .memberId(memberId).build();

        // 부모 폴더와 연관 관계 설정
        if (parentFolder != null) {
            parentFolder.addSubFolder(folder);
        }

        folderRepository.save(folder);
        return true;
    }

    //폴더삭제
    @Transactional
    public void deleteFolder(Long folderId,Long memberId) {
        Folder folder = folderRepository.findFolderByIdAndMemberId(folderId,memberId)
                .orElseThrow(() -> new IllegalStateException("Folder not found with id: " + folderId));

        folderRepository.delete(folder); // CascadeType.ALL로 하위 폴더와 파일도 자동 삭제
    }

    //폴더삭제
    @Transactional
    public void renameFolder(RenameFolderRequest request, Long memberId) {
        Folder folder = folderRepository.findFolderByIdAndMemberId(request.getFolderId(), memberId)
                .orElseThrow(() -> new IllegalStateException("Folder not found with id: " + request.getFolderId()));

        folder.renameFolder(request.getNewName());
        folderRepository.save(folder);
    }

    @Transactional(readOnly = true)
    public List<FolderResponseDto> findFolder(FindFolderRequest request, Long memberId) {
        // 사용자가 존재하는지 확인

        log.info("FindFolderRequest = {}", request);

        List<FolderResponseDto> subFoldersInfo = null;

        subFoldersInfo = folderRepositoryCustom.findSubFolders(request.getParentFolderId(), memberId);

        if (subFoldersInfo == null) {
            throw new FolderNotFoundException();
        }

        return subFoldersInfo;
    }

    @Transactional(readOnly = true)
    public List<FolderDataResponseDto> findFolder2(FindFolderRequest request, Long memberId) {
        // 사용자가 존재하는지 확인

        log.info("FindFolderRequest = {}", request);

        List<FolderDataResponseDto> subFoldersInfo = null;
        subFoldersInfo = folderRepositoryCustom.findSubFoldersAll(request.getParentFolderId(), memberId);

        if (subFoldersInfo == null) {
            throw new FolderNotFoundException();
        }

        return subFoldersInfo;
    }
}
