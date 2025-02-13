package com.example.studyhelp;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Oauth2Application {

    public static void main(String[] args) {
        // .env 파일 로드
        Dotenv dotenv = Dotenv.load();

        // 환경 변수 읽기
        String h2Driver = dotenv.get("H2_DB_DRIVER");
        System.out.println("H2 Driver: " + h2Driver);
        SpringApplication.run(Oauth2Application.class, args);
    }

}
