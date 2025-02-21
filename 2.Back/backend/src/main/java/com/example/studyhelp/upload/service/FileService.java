package com.example.studyhelp.upload.service;

import com.example.studyhelp.exception.exceptions.FileNotFoundException;
import com.example.studyhelp.exception.exceptions.FileNotUploadException;
import com.example.studyhelp.upload.entity.File;
import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.gcs.GCSService;
import com.example.studyhelp.upload.repository.FileRepository;
import com.example.studyhelp.upload.repository.FolderRepository;
import com.example.studyhelp.upload.request.FindFilesRequest;
import com.example.studyhelp.upload.request.UploadFileRequest;
import com.example.studyhelp.upload.response.FileResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final GCSService gcsService;


    @Transactional(readOnly = true)
    public List<FileResponseDto> findFilesInDir(FindFilesRequest request,Long memberId){

        List<File> files = fileRepository.findAllByParentFolderIdAndMemberId(request.getParentFolderId(), memberId)
                .orElseThrow(() -> new IllegalStateException("error in find files In Dir"));

        List<FileResponseDto> responseDtos = files.stream()
                .map(file -> new FileResponseDto(file.getId(), file.getOriginalFileName(), file.getCreatedAt()))
                .collect(Collectors.toList());

        return responseDtos;
    }

    //파일생성
    @Transactional
    public void uploadFile(UploadFileRequest request, Long folderId, Long memberId){

        log.info("call uploadFile Function");

        try{
            Folder folder = null;

            if(folderId != null){
                folder = folderRepository.findFolderByIdAndMemberId(folderId,memberId).orElseThrow(
                        () -> new IllegalStateException("Folder not found with id: " + folderId));
            }

            File createdFile = File.builder()
                    .originalFileName(request.getFileName())
                    .memberId(memberId)
                    .parentFolder(folder).build();

            folder.addFile(createdFile);
            folderRepository.save(folder);
            gcsService.uploadObject(request.getFile(), createdFile.getStoredName());

        }catch (Exception e){
            log.info("error: ",e);
            throw new FileNotUploadException();
        }
    }

    @Transactional
    public void updateFile(MultipartFile file,Long fileId, Long memberId){

        log.info("call updateFile Function");

        try{
            File findFile = fileRepository.findFileByIdAndAndMemberId(fileId, memberId).orElseThrow(() -> new FileNotFoundException());
            gcsService.uploadObject(file, findFile.getStoredName());

        }catch (Exception e){
            log.info("error: ",e);
            throw new FileNotUploadException();
        }
    }

    @Transactional(readOnly = true)
    public String getFileUrl(Long fileId,Long memberId){
        File findFile = fileRepository.findFileByIdAndAndMemberId(fileId, memberId).orElseThrow(() -> new FileNotFoundException());
        String storedName = findFile.getStoredName();
        String url = gcsService.generateSignedUrl(storedName, 20);
        log.info("getFileUrl = {}",url);
        return url;
    }

    @Transactional(readOnly = true)
    public String getFileToText(Long fileId,Long memberId){
        File findFile = fileRepository.findFileByIdAndAndMemberId(fileId, memberId).orElseThrow(() -> new FileNotFoundException());
        String storedName = findFile.getStoredName();
        String text = gcsService.readFileAsString(storedName);
//        log.info("getFileToText = {}",text);
        return text;
    }

    //파일 삭제
    @Transactional
    public void deleteFile(Long fileId){
        File file = fileRepository.findById(fileId).orElseThrow(() -> new IllegalStateException("not find fileId: " + fileId));
        fileRepository.delete(file);
    }
}
