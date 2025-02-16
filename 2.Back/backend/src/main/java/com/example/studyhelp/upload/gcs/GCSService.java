package com.example.studyhelp.upload.gcs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class GCSService {

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;
    private final Storage storage;

    public GCSService() throws Exception {
        // ✅ 올바른 방식으로 인증 파일 로드
        InputStream keyFileStream = new ClassPathResource("google_cloud_storage_key.json").getInputStream();

        storage = StorageOptions.newBuilder()
                .setCredentials(ServiceAccountCredentials.fromStream(keyFileStream))
                .build()
                .getService();
    }

    /**
     * 🔹 GCS에 파일 업로드
     */
    public void uploadObject(MultipartFile file, String storedName) throws Exception {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, storedName)
                .setContentType(file.getContentType())
                .build();

        // ✅ 기존 `storage` 필드 사용 (불필요한 `Storage` 생성 제거)
        storage.create(blobInfo, file.getInputStream());
    }

    /**
     * 🔹 Signed URL 생성 (유효 시간 동안 다운로드 가능)
     */
    public String generateSignedUrl(String storedFileName, int durationMinutes) {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, storedFileName).build();

        // 🔹 Signed URL 생성 (지정된 시간 동안 유효)
        URL signedUrl = storage.signUrl(
                blobInfo,
                durationMinutes, // URL 유효 기간 (분 단위)
                TimeUnit.MINUTES
        );

        return signedUrl.toString();
    }

    //파일을 String으로 변환
    public String readFileAsString(String storedFileName) {
        // GCS에서 파일 가져오기
        Blob blob = storage.get(bucketName, storedFileName);
        log.info("readFileAsString");
        if (blob == null) {
            throw new RuntimeException("파일을 찾을 수 없음: " + storedFileName);
        }

        // 파일을 String으로 변환 (UTF-8 인코딩)
        return new String(blob.getContent(), StandardCharsets.UTF_8);
    }
}
