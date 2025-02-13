package com.example.studyhelp.upload.controller;

import com.example.studyhelp.exception.exceptions.MemberNotFoundException;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.response.ApiResponseWrapper;
import com.example.studyhelp.sign.service.MemberService;
import com.example.studyhelp.upload.request.FindFilesRequest;
import com.example.studyhelp.upload.request.UploadFileRequest;
import com.example.studyhelp.upload.response.FileResponseDto;
import com.example.studyhelp.upload.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/upload")
public class FileController {
    private final FileService fileService;
    private final MemberService memberService;

    @PostMapping("/findFiles")
    public ResponseEntity<ApiResponseWrapper<List<FileResponseDto>>> findFiles(@RequestBody FindFilesRequest request, @AuthenticationPrincipal UserDetails userDetails){

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        List<FileResponseDto> filesInDir = fileService.findFilesInDir(request, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(filesInDir, true, "파일 로딩 성공"));
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<ApiResponseWrapper<Boolean>> uploadFile(
            @ModelAttribute UploadFileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        // 파일 처리 로직
        fileService.uploadFile(request.getFile(), request.getFolderId(), member.getId());

        return ResponseEntity.ok(new ApiResponseWrapper<>(true, true, "파일 업로드 성공"));
    }

    @GetMapping("/getFileUrl")
    public ResponseEntity<ApiResponseWrapper<String>> getFileUrl(
            @Param("fileId")Long fileId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        // 파일 처리 로직
        String fileUrl = fileService.getFileUrl(fileId, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(fileUrl, true, "파일 링크 생성 성공"));
    }

}
