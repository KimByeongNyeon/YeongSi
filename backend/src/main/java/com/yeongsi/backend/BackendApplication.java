package com.yeongsi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.yeongsi.backend.controller",
        "com.yeongsi.backend.service",
        "com.yeongsi.backend.config",
        "com.yeongsi.backend.exception"
})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
