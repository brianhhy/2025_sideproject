package com.example.studyhelp.upload.controller;

import com.example.studyhelp.exception.exceptions.MemberNotFoundException;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.response.ApiResponseWrapper;
import com.example.studyhelp.sign.service.MemberService;
import com.example.studyhelp.upload.repository.FolderRepository;
import com.example.studyhelp.upload.request.CreateFolderRequest;
import com.example.studyhelp.upload.request.FindFolderRequest;
import com.example.studyhelp.upload.request.RenameFolderRequest;
import com.example.studyhelp.upload.response.FolderDataResponseDto;
import com.example.studyhelp.upload.response.FolderResponseDto;
import com.example.studyhelp.upload.service.FolderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/upload")
public class FolderController{
    private final FolderService folderService;
    private final MemberService memberService;

    @PostMapping("/findFolder")
    public ResponseEntity<ApiResponseWrapper<List<FolderResponseDto>>> findFolder(@RequestBody FindFolderRequest request, @AuthenticationPrincipal UserDetails userDetails){

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        List<FolderResponseDto> folderInfo = folderService.findFolder(request, member.getId());

        log.info("folderInfo = {}",folderInfo.toString());

        return ResponseEntity.ok(new ApiResponseWrapper<>(folderInfo, true, null));
    }

    @PostMapping("/findFolder2")
    public ResponseEntity<ApiResponseWrapper<List<FolderDataResponseDto>>> findFolder2(@RequestBody FindFolderRequest request, @AuthenticationPrincipal UserDetails userDetails){

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        List<FolderDataResponseDto> folderInfo = folderService.findFolder2(request, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(folderInfo, true, null));
    }




    @PostMapping("/createFolder")
    public ResponseEntity<ApiResponseWrapper<Boolean>> createFolder(@RequestBody CreateFolderRequest request, @AuthenticationPrincipal UserDetails userDetails){

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        log.info("request = {}",request);
        log.info("member = {}",member);

        boolean result = folderService.createFolder(request, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(result, result, "폴더 생성이 완료되었습니다."));
    }

    @PutMapping("/renameFolder")
    public ResponseEntity<ApiResponseWrapper<Boolean>> renameFolder(@RequestBody RenameFolderRequest request, @AuthenticationPrincipal UserDetails userDetails){

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        log.info("request = {}",request);
        log.info("member = {}",member);

        folderService.renameFolder(request, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(true, true, "폴더 이름변경 완료"));
    }

    @DeleteMapping("/deleteFolder")
    public ResponseEntity<ApiResponseWrapper<Boolean>> deleteFolder(
            @RequestParam("folderId") Long folderId, // ✅ `@RequestParam`으로 변경
            @AuthenticationPrincipal UserDetails userDetails) {

        Member member = memberService.findByUserName(userDetails.getUsername());
        if (member == null) {
            throw new MemberNotFoundException();
        }

        log.info("삭제 요청: folderId = {}", folderId);
        log.info("삭제 요청한 회원: {}", member);

        folderService.deleteFolder(folderId, member.getId());
        return ResponseEntity.ok(new ApiResponseWrapper<>(true, true, "폴더 삭제가 완료되었습니다."));
    }


}
