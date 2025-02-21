package com.example.studyhelp.record;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/naver-cloud")
public class NaverCloudController {

    private final NaverCloudService naverCloudService;

    @PostMapping("/stt")
    public ResponseEntity<String> convertSpeechToText(@RequestParam("file")MultipartFile file) {
        if(file == null || file.isEmpty())
        {
            log.error("업로드된 파일이 없습니다.");
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }
        log.info("convertSpeechToText : 파일 이름 = {}",file.getOriginalFilename());
        log.info("convertsSpeechToText: 파일 크기 = {}",file.getSize());
        String result = naverCloudService.recognizeSpeech(file);
        return ResponseEntity.ok(result);
    }
}

