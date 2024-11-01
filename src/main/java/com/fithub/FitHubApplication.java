package com.fithub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FitHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(FitHubApplication.class, args);
    }
}